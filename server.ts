import express from 'express';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';
import path from 'path';

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

  // Stripe requires raw body for webhook signature verification
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  let stripeClient: Stripe | null = null;
  
  if (stripeSecretKey) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
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
            
            let plan = "plus";
            
            if (subscriptionId) {
              const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
              const priceId = subscription.items.data[0].price.id;
              
              if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
                plan = "pro";
              } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
                plan = "premium";
              }

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
                  currentPeriodEnd: subscription.current_period_end * 1000,
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
                 if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
                   plan = "pro";
                 } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
                   plan = "premium";
                 } else {
                   plan = "plus";
                 }
              }

              await doc.ref.update({
                plan: plan,
                status: subscription.status,
                stripeSubscriptionId: subscription.id,
                currentPeriodEnd: subscription.current_period_end * 1000,
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
