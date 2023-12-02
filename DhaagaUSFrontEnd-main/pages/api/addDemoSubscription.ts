import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/server/mongodb";

type Data = string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client: any = await clientPromise;
  const db = client.db("dhaaga-db");
  const subColl = db.collection("subscriptions");
  const userColl = db.collection("users");

  const user_id = "FQObxfagd2VnNi6jZBsajILkIoh1";
  const subscription_id = "sub_1Nd3BdG1wrh7M1ZpoZfrRDtj";
  const product_id = "prod_OL7M13FiBn5j8g";
  const price_id = "price_1NYR7SG1wrh7M1Zpmv7GGEm0";
  const status = "active";
  const starts_at = 1691552110000;
  const expires_at = 1694230510000;

  const subscription = {
    user_id: user_id,
    subscription_id,
    product_id,
    price_id,
    status,
    starts_at,
    expires_at,
  };

  try {
    await subColl.insertOne(subscription);
    await userColl.updateOne(
      { _id: user_id },
      { $set: { subscription: subscription_id } }
    );
    res.send("ok");
  } catch (error) {
    console.log(error);
    res.send("error");
  }
}
