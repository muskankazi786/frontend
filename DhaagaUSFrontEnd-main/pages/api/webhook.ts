import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import clientPromise from "@/server/mongodb";
const Cors = require("micro-cors");

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
  });

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (!sig || !webhookSecret) {
        return;
      }

      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (error: any) {
      console.log(`❌ Error message: ${error.message}`);
      console.log("ERROR", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    // Create a new subscription
    if (event.type === "checkout.session.completed") {
      let checkoutSessionEventId;
      if (
        !checkoutSessionEventId ||
        (checkoutSessionEventId && checkoutSessionEventId !== event.id)
      ) {
        checkoutSessionEventId = event.id;
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ["invoice", "subscription"],
          }
        );
        console.log("checkoutSessionEventId", checkoutSessionEventId);
        console.log(
          (session.subscription! as Stripe.Subscription).items.data[0].plan.id
        );
        console.log(
          (session.subscription! as Stripe.Subscription).items.data[0].plan
            .product
        );
        console.log(session);

        const invoiceObject = session.invoice as Stripe.Invoice;
        const subscriptionObject = session.subscription as Stripe.Subscription;

        if (
          (invoiceObject.paid =
            true &&
            invoiceObject.billing_reason === "subscription_create" &&
            subscriptionObject.status === "active")
        ) {
          try {
            const client: any = await clientPromise;
            const db = client.db("dhaaga-db");
            const subscriptionColl = await db.collection("subscriptions");

            const subscription = {
              user_id: session.client_reference_id,
              subscription_id: subscriptionObject.id,
              product_id: subscriptionObject.items.data[0].plan.product,
              price_id: subscriptionObject.items.data[0].plan.id,
              status: subscriptionObject.status,
              last_payment_error: null,
              starts_at: subscriptionObject.current_period_start * 1000,
              expires_at: subscriptionObject.current_period_end * 1000,
            };

            await subscriptionColl.insertOne(subscription);

            try {
              const userColl = await db.collection("users");
              await userColl.updateOne(
                { _id: session.client_reference_id },
                {
                  $set: { subscription: subscriptionObject.id },
                }
              );
            } catch (error) {
              console.log("Update User Error:", error);
            }
          } catch (error) {
            console.log("Store Subscription Error:", error);
          }
        }
      }
    }

    // Update subscription
    if (
      event.type === "invoice.paid" &&
      (event.data.object as Stripe.Invoice).billing_reason ===
        "subscription_cycle"
    ) {
      let invoicePaidEventId;
      const invoiceObject = event.data.object as Stripe.Invoice;

      if (
        !invoicePaidEventId ||
        (invoicePaidEventId && invoicePaidEventId !== event.id)
      ) {
        invoicePaidEventId = event.id;

        const invoice = await stripe.invoices.retrieve(invoiceObject.id, {
          expand: ["subscription"],
        });

        const subscription = invoice.subscription as Stripe.Subscription;
        if (subscription.status === "active") {
          try {
            const client: any = await clientPromise;
            const db = client.db("dhaaga-db");
            const subscriptionColl = await db.collection("subscriptions");

            await subscriptionColl.updateOne(
              { subscription_id: subscription.id },
              {
                $set: {
                  status: subscription.status,
                  last_payment_error: null,
                  starts_at: subscription.current_period_start * 100,
                  expires_at: subscription.current_period_end * 1000,
                },
              }
            );
          } catch (error) {
            console.log("Update Subscription Error:", error);
          }
        }
      }
    }

    // Update subscription on payment failure
    if (
      event.type === "invoice.payment_failed" &&
      (event.data.object as Stripe.Invoice).billing_reason ===
        "subscription_cycle"
    ) {
      let invoicePaymentFailedEventId;
      const invoiceObject = event.data.object as Stripe.Invoice;

      if (
        !invoicePaymentFailedEventId ||
        (invoicePaymentFailedEventId &&
          invoicePaymentFailedEventId !== event.id)
      ) {
        invoicePaymentFailedEventId = event.id;

        const invoice = await stripe.invoices.retrieve(invoiceObject.id, {
          expand: ["payment_intent", "subscription"],
        });

        const subscription = invoice.subscription as Stripe.Subscription;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        try {
          const client: any = await clientPromise;
          const db = client.db("dhaaga-db");
          const subscriptionColl = await db.collection("subscriptions");

          await subscriptionColl.updateOne(
            { subscription_id: subscription.id },
            {
              $set: {
                status: subscription.status,
                last_payment_error: paymentIntent.last_payment_error?.message,
                starts_at: subscription.current_period_start * 1000,
                expires_at: subscription.current_period_end * 1000,
              },
            }
          );
        } catch (error) {
          console.log("Update Subscription Error:", error);
        }
      }
    }

    // Delete Subscription on subscription canceled
    if (event.type === "customer.subscription.deleted") {
      let customerSubscriptionDeletedEventId;
      const subscription = event.data.object as Stripe.Subscription;

      if (
        !customerSubscriptionDeletedEventId ||
        (customerSubscriptionDeletedEventId &&
          customerSubscriptionDeletedEventId !== event.id)
      ) {
        customerSubscriptionDeletedEventId = event.id;

        try {
          const client: any = await clientPromise;
          const db = client.db("dhaaga-db");
          const subscriptionsColl = await db.collection("subscriptions");
          const usersColl = await db.collection("users");

          await subscriptionsColl.deleteOne({
            subscription_id: subscription.id,
          });

          try {
            await usersColl.updateOne(
              { subscription: subscription.id },
              { $unset: { subscription: "" } }
            );
          } catch (error) {
            console.log("Update User Error:", error);
          }
        } catch (error) {
          console.log("Delete Subscription Error:", error);
        }
      }
    }

    res.status(200).send({ received: true });
  }
});
