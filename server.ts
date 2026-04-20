import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import path from 'path';
import crypto from 'crypto';
import { geminiService } from './src/services/geminiService';

// Load environment variables for local development
import { config } from 'dotenv';
config();

// Initialize Firebase Admin (requires GOOGLE_APPLICATION_CREDENTIALS or similar in production)
try {
  admin.initializeApp();
} catch (error) {
  console.warn("Firebase admin initialization warning:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Stripe requires raw body for webhook signature verification
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let stripeClient: Stripe | null = null;
  
  if (stripeSecretKey) {
    stripeClient = new Stripe(stripeSecretKey, {
      // @ts-ignore
      apiVersion: '2023-10-16',
    });
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Get User Plan (for extension)
  app.get('/api/user/plan', async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).send('Missing userId');

    try {
      const doc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('billing')
        .doc('subscription')
        .get();
      
      const data = doc.data();
      res.json({ 
        plan: data?.plan || 'free',
        status: data?.status || 'inactive'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Stripe Checkout Session
  app.post('/api/create-checkout-session', express.json(), async (req, res) => {
    const { priceId, userId } = req.body;

    if (!stripeClient) {
      return res.status(500).json({ error: 'Stripe is not configured on the server.' });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        client_reference_id: userId,
        success_url: `${req.headers.origin}/upgrade-success`,
        cancel_url: `${req.headers.origin}/pricing`,
      });

      res.json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook Endpoint
  app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripeClient || !endpointSecret) {
      console.warn("Stripe missing SECRET_KEY or WEBHOOK_SECRET");
      return res.status(500).send("Stripe not configured on server.");
    }

    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      const eventId = event.id;
      const eventRef = admin.firestore().collection("processed_events").doc(eventId);
      const eventDoc = await eventRef.get();
      
      if (eventDoc.exists) {
        return res.json({ received: true });
      }

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.client_reference_id;
          
          if (userId) {
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;
            
            if (subscriptionId) {
              const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
              const priceId = subscription.items.data[0].price.id;
              
              const plan = mapPriceIdToPlan(priceId);

              await admin.firestore()
                .collection("users")
                .doc(userId)
                .collection("billing")
                .doc("subscription")
                .set({
                  plan: plan,
                  status: subscription.status,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscriptionId,
                  currentPeriodEnd: subscription.items.data[0].current_period_end * 1000,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          const usersRef = admin.firestore().collectionGroup("billing").where("stripeCustomerId", "==", customerId);
          const snapshot = await usersRef.get();

          if (!snapshot.empty) {
            for (const doc of snapshot.docs) {
              let plan = "free";
              if (subscription.status === "active" || subscription.status === "trialing") {
                 const priceId = subscription.items.data[0].price.id;
                 plan = mapPriceIdToPlan(priceId);
              }

              await doc.ref.update({
                plan: plan,
                status: subscription.status,
                stripeSubscriptionId: subscription.id,
                currentPeriodEnd: subscription.items.data[0].current_period_end * 1000,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      await eventRef.set({
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        type: event.type
      });

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Regular express parsing for other APIs
  app.use(express.json());

  // Extension API: Save Quick Session
  app.post('/api/extension/save-session', async (req, res) => {
    const { userId, nextStep, links } = req.body;

    if (!userId || !nextStep) {
      return res.status(400).json({ error: 'User ID and Next Step are required.' });
    }

    try {
      const db = admin.firestore();
      
      // Check user plan before saving
      const subscriptionDoc = await db.collection('users')
        .doc(userId)
        .collection('billing')
        .doc('subscription')
        .get();
      
      const planData = subscriptionDoc.data();
      const plan = planData?.plan || 'free';
      const status = planData?.status || 'inactive';
      
      const hasSyncAccess = (plan === 'pro' || plan === 'premium') && (status === 'active' || status === 'trialing');

      if (!hasSyncAccess) {
        return res.status(403).json({ 
          error: 'Extension sync requires a Pro or Premium subscription.',
          code: 'INSUFFICIENT_PLAN'
        });
      }

      const sessionId = crypto.randomUUID();
      const timestamp = Date.now();
      
      let summaryStr = "";
      if (links && links.length > 0) {
        try {
          const summary = await geminiService.generateLinkSummary(links);
          summaryStr = `\n\n**AI Context Summary:**\n${summary}`;
        } catch (e) {
          console.warn("AI generation failed for session save:", e);
        }
      }
      
      const newSession = {
        id: sessionId,
        title: `MindMark Snapshot - ${new Date().toLocaleString()}`,
        nextStep: nextStep,
        links: links || [],
        status: 'active',
        priority: 'medium',
        category: 'Quick Capture',
        tags: ['browser-extension'],
        userId: userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        pinned: false,
        notes: summaryStr.trim()
      };

      await db.collection('users')
        .doc(userId)
        .collection('sessions')
        .doc(sessionId)
        .set(newSession);

      res.json({ success: true, sessionId });
    } catch (error: any) {
      console.error('Extension Save Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create Stripe Billing Portal Session
  app.post('/api/create-portal-session', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      // Get customer ID from Firestore
      const subscriptionDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('billing')
        .doc('subscription')
        .get();

      if (!subscriptionDoc.exists) {
        return res.status(404).send('No subscription found for this user.');
      }

      const { stripeCustomerId } = subscriptionDoc.data() || {};
      if (!stripeCustomerId) {
        return res.status(400).send('No Stripe customer ID associated with this account.');
      }

      if (!stripeClient) {
        return res.status(500).send('Stripe is not configured.');
      }

      // Create portal session
      const portalSession = await stripeClient.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${req.headers.origin}/settings`,
      });

      res.json({ url: portalSession.url });
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function mapPriceIdToPlan(priceId: string): string {
  const PLUS_ID = process.env.STRIPE_PLUS_PRICE_ID;
  const PRO_ID = process.env.STRIPE_PRO_PRICE_ID;
  const PREMIUM_ID = process.env.STRIPE_PREMIUM_PRICE_ID;

  if (priceId === PLUS_ID && PLUS_ID) return 'plus';
  if (priceId === PRO_ID && PRO_ID) return 'pro';
  if (priceId === PREMIUM_ID && PREMIUM_ID) return 'premium';
  return 'free';
}

startServer();
