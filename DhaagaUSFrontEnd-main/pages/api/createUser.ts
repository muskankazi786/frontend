import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../server/mongodb";

type Data = {
  message: string;
  user?: any;
  joinAsBusiness?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client: any = await ClientPromise;
    const db = client.db("dhaaga-db");
    const userColl = db.collection("users");
    const parsedBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const {
      email = "",
      firstname = "",
      lastname = "",
      user_id,
      joinAsBusiness,
      phone = "",
    } = parsedBody;
    //   const { email, user_id } = req.body;

    const result = await userColl.insertOne({
      _id: user_id,
      firstname,
      lastname,
      email,
      phone,
      joinAsBusiness,
    });
    res
      .status(200)
      .json({ message: "User is created successfully", joinAsBusiness });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not create user!" });
  }
}
