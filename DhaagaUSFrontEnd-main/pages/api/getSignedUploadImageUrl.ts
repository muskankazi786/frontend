import {
  DeleteObjectCommand,
  GetBucketAclCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
import { NextApiRequest, NextApiResponse } from "next";
import { uid } from "uid";

// export const config = {
//   api: {
// bodyParser: false,
//   },
// };                                                                                 //MULTER

// interface NextReq extends NextApiRequest {
//   files: Express.Multer.File[];
// }                                                                                  //MULTER

// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }                                                                                          // MULTER

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   try {
  //     const result = await runMiddleware(req, res, upload.array("uploads"));
  //     console.log(req.files);
  //   } catch (e) {
  //     console.log("ERROR FROM TRY UPLOAD", e);
  //   }

  //   res.send("ok");                                                                           //MULTER

  //   const s3Client = new S3Client({});

  //   const uploadCommand = new PutObjectCommand({
  //     Bucket: process.env.S3_BUCKET_NAME,
  //     Key: 'file-name',
  //     Body: createReadStream('file-path'),
  //   });

  //   const response = await s3Client.send(uploadCommand);

  //   res.status(200).json(response);

  const { file, type } = req.query;
  const fileName = file?.toString();
  const fileType = type?.toString();

  // const createPresignedUrl = ({
  //   region,
  //   bucket,
  //   key,
  // }: {
  //   region: string;
  //   bucket: string | undefined;
  //   key: string | undefined;
  // }) => {
  //   const client = new S3Client({
  //     region: region,
  //   });
  //   const command = new PutObjectCommand({
  //     Bucket: bucket,
  //     Key: key,
  //     ContentType: fileType,
  //   });
  //   return getSignedUrl(client, command, { expiresIn: 60 });
  // };

  // const clientUrl = await createPresignedUrl({
  //   region: "us-east-1",
  //   bucket: "dhaagaawsbucket",
  //   key: `BusinessImages/${uid()}-${fileName}`,
  // });
  // res.json({ url: clientUrl });

  // const createPresignedUrl = ({
  //   region,
  //   bucket,
  //   key,
  // }: {
  //   region: string;
  //   bucket: string | undefined;
  //   key: string | undefined;
  // }) => {
  //   const client = new S3Client({region: region});
  //   const command = new PutObjectCommand({
  //     Bucket: bucket,
  //     Key: key,
  //     ContentType: fileType,
  //   });
  //   return getSignedUrl(client, command, { expiresIn: 60 });
  // };

  // const clientUrl = await createPresignedUrl({
  //   region: "us-east-1",
  //   bucket: "dhaagaawsbucket",
  //   key: `BusinessImages/${uid()}-${fileName}`,
  // });

  // GET OBJECT

  // const client = new S3Client({
  //   region: "us-east-1",
  // });
  // const createPresignedUrl = ({
  //   region,
  //   bucket,
  //   key,
  // }: {
  //   region: string;
  //   bucket: string | undefined;
  //   key: string | undefined;
  // }) => {
  //   const client = new S3Client({
  //     region: region,
  //   });
  //   const command = new GetObjectCommand({
  //     Bucket: bucket,
  //     Key: key,
  //   });
  //   return getSignedUrl(client, command, { expiresIn: 3600 });
  // };

  // const command = new GetObjectCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   Key: "rahul-upadhyay-yDKHJxfiWDk-unsplash.jpg",
  // });

  // try {
  //   const response = await client.send(command);
  //   // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
  //   const stream = response.Body as Readable;
  //   const streamToBuffer = (stream: Readable) =>
  //     new Promise<Buffer>((resolve, reject) => {
  //       const chunks: Buffer[] = [];
  //       stream.on("data", (chunk) => chunks.push(chunk));
  //       stream.once("end", () => resolve(Buffer.concat(chunks)));
  //       stream.once("error", reject);
  //     });
  //   streamToBuffer(stream).then((data) => {
  //     const base64 = data.toString("base64");
  //     res.send(base64);
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.send(err);
  // }

  // try {
  //   const url = await createPresignedUrl({
  //     region: "us-east-1",
  //     bucket: process.env.S3_BUCKET_NAME,
  //     key: "rahul-upadhyay-yDKHJxfiWDk-unsplash.jpg",
  //   });
  //   const response = await fetch(url);
  //   const data = await response.text();
  //   res.send(data);
  // } catch (err) {
  //   console.error(err);
  //   res.send(err);
  // }

  // LIST COMMAND

  // const client = new S3Client({
  //   region: "us-east-1",
  // });

  // const command = new ListObjectsCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   EncodingType: "url",
  // });

  // try {
  //   const response = await client.send(command);
  //   console.log(response);
  //   res.send("ok");
  // } catch (err) {
  //   res.send(err);
  // }

  // DELETE OBJECT

  // const client = new S3Client({});

  // const command = new DeleteObjectCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   Key: "pranjall-kumar-sejqj6Eaqe8-unsplash.jpg",
  // });

  // try {
  //   const response = await client.send(command);
  //   console.log(response);
  // } catch (err) {
  //   console.error(err);
  // }

  // res.send("ok");

  // CORSRules
  // const client = new S3Client({
  //   region: "us-east-1",
  // });

  // const command = new PutBucketCorsCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   CORSConfiguration: {
  //     CORSRules: [
  //       {
  //         // Allow all headers to be sent to this bucket.
  //         AllowedHeaders: ["*"],
  //         // Allow only GET and PUT methods to be sent to this bucket.
  //         AllowedMethods: ["GET", "PUT", "POST", "DELETE"],
  //         // Allow only requests from the specified origin.
  //         AllowedOrigins: [process.env.URL!],
  //         // Allow the entity tag (ETag) header to be returned in the response. The ETag header
  //         // The entity tag represents a specific version of the object. The ETag reflects
  //         // changes only to the contents of an object, not its metadata.
  //         ExposeHeaders: ["ETag"],
  //         // How long the requesting browser should cache the preflight response. After
  //         // this time, the preflight request will have to be made again.
  //         MaxAgeSeconds: 3600,
  //       },
  //     ],
  //   },
  // });

  // try {
  //   const response = await client.send(command);
  //   console.log(response);
  // } catch (err) {
  //   console.log(err);
  // }

  // BUCKET POLICY

  //  const client = new S3Client({
  //    region: "us-east-1",
  //  });

  // const command = new PutBucketPolicyCommand({
  //   Policy: JSON.stringify({
  //     Version: "2012-10-17",
  //     Statement: [
  //       {
  //         Effect: "Allow",
  //         Principal: {
  //           AWS: "arn:aws:iam::498346629205:user/dhaga_s3_user",
  //         },
  //         Action: [
  //           "s3:DeleteObject",
  //           "s3:GetObject",
  //           "s3:PutObject",
  //           "s3:PutObjectAcl",
  //         ],
  //         Resource: "arn:aws:s3:::dhaagaawsbucket/*",
  //       },
  //     ],
  //   }),
  //   // Apply the preceding policy to this bucket.
  //   Bucket: "dhaagaawsbucket",
  // });

  // try {
  //   const response = await client.send(command);
  //   console.log(response);
  // } catch (err) {
  //   console.error(err);
  // }

  // res.send("ok");

  // set ACL

  // const client = new S3Client({ region: "us-east-1"});

  // const command = new GetBucketAclCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  // });

  // try {
  //   const response = await client.send(command);
  //   console.log(response);
  // } catch (err) {
  //   console.error(err);
  // }

  // res.send("ok");
  try {
    const client = new S3Client({});
    const post = await createPresignedPost(client, {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `BusinessImages/${uid()}-${fileName}`,
      Expires: 60,
      Fields: {
        acl: "public-read",
        "Content-Type": fileType,
      },
      Conditions: [["starts-with", "$Content-Type", "image/"]],
    });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not sign Url!" });
  }
}
