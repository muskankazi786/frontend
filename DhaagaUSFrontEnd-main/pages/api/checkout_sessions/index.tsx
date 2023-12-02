import { firebaseAdmin } from "@/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import Stripe from "stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const cookies = nookies.get({ req });
      const token = cookies.token;
      const user = await firebaseAdmin.auth().verifyIdToken(token);

      try {
        const params: Stripe.Checkout.SessionCreateParams = {
          line_items: [
            {
              price: "price_1NYR7SG1wrh7M1Zpmv7GGEm0",
              quantity: 1,
            },
          ],
          mode: "subscription",
          billing_address_collection: "auto",
          client_reference_id: user.uid,
          success_url: `${process.env.URL}/account?success=true`,
          cancel_url: `${process.env.URL}/account?cancel=true`,
        };

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: "2022-11-15",
        });

        const checkoutSession: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create(params);
        res.status(200).json(checkoutSession);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Couldn't create checkout session." });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Authentication is required!" });
    }
  }
}
