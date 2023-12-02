import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../server/mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";

type Data = {
  message: string;
  productId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const user = await firebaseAdmin.auth().verifyIdToken(token);
    try {
      const client: any = await ClientPromise;
      const db = client.db("dhaaga-db");
      const dataColl = db.collection("entity");

      const parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { address, lat, lng, business_hours, photos, ...rest } = parsedBody;

      // Location Object

      let location: any = { type: "Point", coordinates: [0, 0] };
      location.coordinates[0] = parseFloat(lng as string);
      location.coordinates[1] = parseFloat(lat as string);

      // Reviews
      const Reviews: any = [];

      const finalObj = {
        ...rest,
        full_address: address,
        location,
        business_hours,
        photos,
        Reviews,
        owner_id: user.uid,
      };

      const rslt = await dataColl.insertOne(finalObj);
      res.status(200).json({
        message: "Product is created successfully",
        productId: rslt.insertedId.toString(),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not create product!" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
  // const client: any = await ClientPromise;
  // const db = client.db("dhaaga-db");
  // const dataColl = db.collection("entity");

  // const cookies = nookies.get({ req });

  // let user;
  // try {
  //   const token = cookies.token;
  //   user = await firebaseAdmin.auth().verifyIdToken(token);

  //   const parsedBody = JSON.parse(req.body);

  //   const { address, lat, lng, ...rest } = parsedBody;

  //   // Location Object

  //   let location: any = { type: "Point", coordinates: [0, 0] };
  //   location.coordinates[0] = parseFloat(lng as string);
  //   location.coordinates[1] = parseFloat(lat as string);

  //   // Reviews
  //   const Reviews: any = [];

  //   const finalObj = {
  //     ...rest,
  //     full_address: address,
  //     location,
  //     Reviews,
  //     owner_id: user.uid,
  //   };

  //   const rslt = await dataColl.insertOne(finalObj);
  //   res.json({
  //     message: "Product is created successfully",
  //     productId: rslt.insertedId.toString(),
  //   });
  // } catch (err: any) {
  //   res.json({ error: err.message });
  // }
}
