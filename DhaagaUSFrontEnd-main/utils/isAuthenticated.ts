import nookies from "nookies";
import { firebaseAdmin } from "@/firebaseAdmin";

export default async (ctx: any) => {
  const cookies = nookies.get(ctx);
  let user;
  user = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  return {
    user,
    token: cookies.token,
  };
};
