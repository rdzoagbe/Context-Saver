import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing signature or secret");
    }
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    functions.logger.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    const eventId = event.id;
    const eventRef = admin.firestore().collection("processed_events").doc(eventId);

    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
      functions.logger.info(`Event ${eventId} already processed. Skipping.`);
      res.json({ received: true });
      return;
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
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
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
        functions.logger.info(`Unhandled event type ${event.type}`);
    }

    await eventRef.set({
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      type: event.type
    });

    res.json({ received: true });
  } catch (error) {
    functions.logger.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});
