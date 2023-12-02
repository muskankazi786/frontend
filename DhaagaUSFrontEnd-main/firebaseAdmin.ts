import * as firebaseAdmin from "firebase-admin";

import serviceAccount from "./dhaaga-auth-firebase-adminsdk-q94kr-a40bc8613b.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
      serviceAccount as firebaseAdmin.ServiceAccount
    ),
  });
}

export { firebaseAdmin };
