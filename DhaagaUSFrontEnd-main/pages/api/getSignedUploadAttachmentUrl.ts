const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
import { S3Client } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { uid } from "uid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file, type } = req.query;
  const fileName = file?.toString();
  const fileType = type?.toString();

  const client = new S3Client({});

  try {
    const post = await createPresignedPost(client, {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `attachmentFiles/${uid()}-${fileName}`,
      Expires: 60,
      Fields: {
        acl: "public-read",
        "Content-Type": fileType,
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not sign Url!" });
  }
}
