import { firebaseAdmin } from "@/firebaseAdmin";
import clientPromise from "@/server/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

type Data = {
  userCanMakeProduct?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);

    try {
      const client: any = await clientPromise;
      const db = client.db("dhaaga-db");
      const dataColl = db.collection("users");
      const entityColl = db.collection("entity");

      const user = await dataColl.findOne({ _id: currentUser.uid });

      if (!user.joinAsBusiness) {
        res.json({ userCanMakeProduct: false });
      } else if (user.joinAsBusiness) {
        const isProductExist = await entityColl.findOne({
          owner_id: currentUser.uid,
        });
        if (!isProductExist) {
          res.status(200).json({ userCanMakeProduct: true });
        } else {
          res.status(200).json({ userCanMakeProduct: false });
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
