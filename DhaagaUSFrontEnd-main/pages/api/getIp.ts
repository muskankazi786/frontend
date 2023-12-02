import type { NextApiRequest, NextApiResponse } from "next";
const requestIp = require("request-ip");

type Data = string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ipAddress: any = requestIp.getClientIp(req);

  res.send(ipAddress);
}
