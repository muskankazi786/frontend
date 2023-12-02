import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";
import clientPromise from "@/server/mongodb";
import { ObjectId } from "mongodb";

type Data = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const productId = req.query.productId;
  const productObjId = new ObjectId(productId?.toString());
  try {
    const client: any = await clientPromise;
    const db = client.db("dhaaga-db");
    const dataColl = db.collection("entity");

    const parsedBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { lat, lng, address, ...rest } = parsedBody;

    // Location Object

    let location: any = { type: "Point", coordinates: [0, 0] };
    if (lat && lng) {
      location.coordinates[0] = parseFloat(lng as string);
      location.coordinates[1] = parseFloat(lat as string);
    }

    let finalObj = { ...rest };
    if (lat && lng) {
      finalObj.location = location;
    }
    if (address) {
      finalObj.full_address = address;
    }

    const rslt = await dataColl.updateOne(
      { _id: productObjId },
      { $set: { ...finalObj } }
    );
    res.status(200).json({ message: "Product is updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not update product!" });
  }
}
