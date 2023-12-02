import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { uid } from "uid";
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file, type } = req.query;
  const fileName = file?.toString();
  const fileType = type?.toString();
  const key = req.query.key?.toString();

  if (req.method === "POST") {
    try {
      const createPresignedPostUrl = ({
        bucket,
        key,
      }: {
        bucket: string | undefined;
        key: string | undefined;
      }) => {
        const client = new S3Client({});
        return createPresignedPost(client, {
          Bucket: bucket,
          Key: key,
          Expires: 60,
          Fields: {
            acl: "public-read",
            "Content-Type": fileType,
          },
          Conditions: [
            ["starts-with", "$Content-Type", "image/"], // up to 1 MB
          ],
        });
      };
      const post = await createPresignedPostUrl({
        bucket: process.env.S3_BUCKET_NAME,
        key: `userProfilePictures/${uid()}-${fileName}`,
      });
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not sign Url!" });
    }
  } else if (req.method === "DELETE") {
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
      res.status(200).json({ message: "User image deleted." });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: "Could not delete user image!" });
    }
  }
  // const createPresignedPostUrl = ({
  //   bucket,
  //   key,
  // }: {
  //   bucket: string | undefined;
  //   key: string | undefined;
  // }) => {
  //   const client = new S3Client({});
  //   return createPresignedPost(client, {
  //     Bucket: bucket,
  //     Key: key,
  //     Expires: 60,
  //     Fields: {
  //       acl: "public-read",
  //       "Content-Type": fileType,
  //     },
  //     Conditions: [
  //       ["starts-with", "$Content-Type", "image/"], // up to 1 MB
  //     ],
  //   });
  // };
  // if (key) {
  //   const client = new S3Client({});
  //   const getObjectCommand = new GetObjectCommand({
  //     Bucket: process.env.S3_BUCKET_NAME,
  //     Key: key,
  //   });
  //   const deleteObjectCommand = new DeleteObjectCommand({
  //     Bucket: process.env.S3_BUCKET_NAME,
  //     Key: key,
  //   });
  //   try {
  //     await client.send(getObjectCommand);
  //     await client.send(deleteObjectCommand);
  //     const post = await createPresignedPostUrl({
  //       bucket: process.env.S3_BUCKET_NAME,
  //       key: `userProfilePictures/${uid()}-${fileName}`,
  //     });
  //     res.json(post);
  //   } catch (error: any) {
  //     res.status(500).json({ message: "Uploading Image Failed!" });
  //   }
  // } else {
  //   const post = await createPresignedPostUrl({
  //     bucket: process.env.S3_BUCKET_NAME,
  //     key: `userProfilePictures/${uid()}-${fileName}`,
  //   });
  //   res.json(post);
  // }
}
