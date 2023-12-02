import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../server/mongodb";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";

type Data = {
  message?: string;
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
      const dataColl = db.collection("feedbacks");

      const parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { problemFlags, problemDescription, attachmentFiles } = parsedBody;

      const feedbackObject = {
        user_id: user.uid,
        problemFlags,
        problemDescription,
        attachmentFiles,
      };

      const result = await dataColl.insertOne(feedbackObject);

      res.status(200).json({ message: "Feedback is submitted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
