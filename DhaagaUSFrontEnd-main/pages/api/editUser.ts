import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../server/mongodb";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const user = await firebaseAdmin.auth().verifyIdToken(token);
    try {
      const client: any = await ClientPromise;
      const db = client.db("dhaaga-db");
      const dataColl = db.collection("users");

      const parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { username, profile_picture, phone } = parsedBody;

      if (phone && username && profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          {
            $set: {
              phone,
              username,
              profile_picture,
            },
          },
          { returnDocument: "after" }
        );
        res.status(200).json({
          message: "User updated successfully.",
          user: userProfile.value,
        });
      } else if (phone && username && !profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          {
            $set: {
              phone,
              username,
            },
          },
          { returnDocument: "after" }
        );
        return res.status(200).json({
          message: "User updated successfully.",
          user: userProfile.value,
        });
      } else if (phone && !username && profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          {
            $set: {
              phone,
              profile_picture,
            },
          },
          { returnDocument: "after" }
        );
        return res.status(200).json({
          message: "User updated successfully.",
          user: userProfile.value,
        });
      } else if (!phone && username && profile_picture) {
        const foundUser = await dataColl.findOne({ _id: user.uid });

        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          {
            $set: {
              username,
              profile_picture,
            },
          },
          { returnDocument: "after" }
        );

        if (foundUser.username === username) {
          res.status(200).json({
            message: "User image updated successfully.",
            user: userProfile.value,
          });
        } else {
          res.status(200).json({
            message: "User updated successfully.",
            user: userProfile.value,
          });
        }
      } else if (phone && !username && !profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          { $set: { phone } },
          { returnDocument: "after" }
        );
        res.status(200).json({
          message: "Phone number updated successfully.",
          user: userProfile.value,
        });
      } else if (!phone && username && !profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          { $set: { username } },
          { returnDocument: "after" }
        );

        return res.status(200).json({
          message: "Username updated successfully.",
          user: userProfile.value,
        });
      } else if (!phone && !username && profile_picture) {
        const userProfile = await dataColl.findOneAndUpdate(
          { _id: user.uid },
          { $set: { profile_picture } },
          { returnDocument: "after" }
        );

        return res.status(200).json({
          message: "User image updated successfully",
          user: userProfile.value,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not update user!" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
