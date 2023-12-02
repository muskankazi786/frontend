import { ProductDetail } from "@/Models/ListData";
import { firebaseAdmin } from "@/firebaseAdmin";
import clientPromise from "@/server/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

type Data = {
  userCanEditProduct?: boolean;
  product?: ProductDetail;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client: any = await clientPromise;
  const db = client.db("dhaaga-db");
  const dataColl = db.collection("users");
  const entityColl = db.collection("entity");

  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);

    try {
      const user = await dataColl.findOne({ _id: currentUser.uid });

      if (!user.joinAsBusiness) {
        res.json({ userCanEditProduct: false });
      } else if (user.joinAsBusiness) {
        const product = await entityColl.findOne({
          owner_id: currentUser.uid,
        });
        if (!product) {
          res.status(200).json({ userCanEditProduct: false });
        } else {
          res.json({ userCanEditProduct: true, product });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in checking allowance" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
