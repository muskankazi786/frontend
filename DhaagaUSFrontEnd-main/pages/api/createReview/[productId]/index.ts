import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../../../server/mongodb";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";
import { ObjectId } from "mongodb";

type Data = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId } = req.query;
  const { rating, reviewText } = req.body;
  const productObjId = new ObjectId(productId?.toString());
  const ratingInNumber = +rating;
  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const user = await firebaseAdmin.auth().verifyIdToken(token);
    try {
      const client: any = await ClientPromise;
      const db = client.db("dhaaga-db");
      const reviewsColl = await db.collection("reviews");
      const entitiesColl = await db.collection("entity");

      const result = await reviewsColl.insertOne({
        user_id: user.uid,
        product_id: productObjId,
        rating: ratingInNumber,
        reviewText,
        created_date: Date.now(),
      });

      await entitiesColl.findOneAndUpdate(
        { _id: productObjId },
        { $push: { Reviews: result.insertedId } }
      );

      res.status(200).json({ message: "Review added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to add review!" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
