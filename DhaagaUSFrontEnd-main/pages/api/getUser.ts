import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "@/firebaseAdmin";
import clientPromise from "@/server/mongodb";
import { User } from "firebase/auth";

type Data = {
  user?: User;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const authHeader = req.headers.authorization;
    const cookies = nookies.get({ req });

    const token = authHeader?.substring(7, authHeader?.length) || cookies.token;
    const user = await firebaseAdmin.auth().verifyIdToken(token);

    try {
      const client: any = await clientPromise;
      const db = client.db("dhaaga-db");
      const usersColl = db.collection("users");

      const userId = user?.uid;

      const agg = [
        {
          $facet: {
            whenUserHasNoSubscription: [
              {
                $match: {
                  _id: userId,
                  subscription: { $exists: false },
                },
              },
            ],
            whenUserHasSubscription: [
              {
                $match: {
                  _id: userId,
                  subscription: {
                    $exists: true,
                  },
                },
              },
              {
                $lookup: {
                  from: "subscriptions",
                  localField: "subscription",
                  foreignField: "subscription_id",
                  as: "subscription",
                },
              },
              {
                $unwind: {
                  path: "$subscription",
                },
              },
            ],
          },
        },
      ];

      const cursor = usersColl.aggregate(agg);
      const result = await cursor.toArray();

      const userWithoutSubscription = result[0].whenUserHasNoSubscription;
      const userWithSubscription = result[0].whenUserHasSubscription;

      let foundUser;
      if (userWithoutSubscription.length) {
        foundUser = userWithoutSubscription[0];
      } else if (userWithSubscription.length) {
        foundUser = userWithSubscription[0];
      } else {
        throw new Error("Aggregation failed!");
      }
      res.status(200).json({ user: foundUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error finding User!" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
