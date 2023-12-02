import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = req.query.key?.toString();

  const client = new S3Client({});

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await client.send(getObjectCommand);
    await client.send(deleteObjectCommand);
    res.status(200).json({ message: "Product images deleted" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.name });
  }
}
