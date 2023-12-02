import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  User,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { useErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import nookies from "nookies";
import firebaseClient from "@/firebaseClient";

import { AuthContextObject } from "@/Models/AuthContextObject";
import { UserCred } from "@/Models/UserCred";
import { CreateUserResponse } from "@/Models/CreateUserResponse";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

let signOutTimer: any;

export const AuthContext = createContext<AuthContextObject>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  sendPasswordResetEmail: () => {},
  confirmPasswordReset: () => {},
  loading: true,
  isSubmitting: false,
  requestResponse: null,
  createUserResponseData: null,
  show: true,
  hideToast: () => {},
  userIsLoggingIn: false,
  userIsSigningUp: false,
});

const AuthProvider: React.FC<{ children: any; isOnline: boolean }> = ({
  children,
  isOnline,
}) => {
  firebaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [requestResponse, setRequestResponse] = useState<{
    success?: string;
    error?: string;
  } | null>(null);
  const [createUserResponseData, setCreateUserResponseData] =
    useState<CreateUserResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [userIsLoggingIn, setUserIsLoggingIn] = useState(false);
  const [userIsSigningUp, setUserIsSigningUp] = useState(false);

  const router = useRouter();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const isGetIdTokenScheduled = localStorage.getItem("isGetIdTokenScheduled");
    if (isOnline && isGetIdTokenScheduled) {
      const getIdToken = async () => {
        const auth = getAuth();
        await auth.currentUser?.getIdToken(true);
      };
      getIdToken().then(() => localStorage.removeItem("isGetIdTokenScheduled"));
    }
  }, [isOnline]);

  useEffect(() => {
    return getAuth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        nookies.destroy(undefined, "token");
        return;
      }
      if (isOnline) {
        const accessToken = await user.getIdToken();
        const expiration = (await user.getIdTokenResult()).expirationTime;
        const expirationTime = new Date(expiration);
        const currentTime = new Date();
        const remainingTime = expirationTime.getTime() - currentTime.getTime();

        setUser(user);
        setLoading(false);
        nookies.set(undefined, "token", accessToken, {
          maxAge: remainingTime / 1000,
          path: "/",
          samSite: "Strict",
          secure: false, // set this to false in local (non-HTTPS) development
        });
        signOutTimer = setTimeout(async () => {
          try {
            const auth = getAuth();
            await auth.currentUser?.getIdToken(true);
            // window.location.reload();
            // console.log("ID token from set time out", token);
          } catch (error) {
            localStorage.setItem("isGetIdTokenScheduled", "1");
          }
        }, remainingTime);
      }
    });
  }, []);

  const signUpHandler = async (
    userCredential: UserCred,
    joinAsBusiness: boolean
  ) => {
    const { firstname, lastname, email, password, phone } = userCredential;

    try {
      setRequestResponse(null);
      setCreateUserResponseData(null);
      setUserIsSigningUp(true);
      setIsSubmitting(true);
      setShow(true);
      const auth = getAuth();
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;
      const userData = {
        firstname,
        lastname,
        email: user.email,
        user_id: user.uid,
        phone,
        joinAsBusiness,
      };

      const response = await catchAsyncFetch("/api/createUser", showBoundary, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "aaplication/json",
        },
      });

      if (!response) {
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCreateUserResponseData(data);
      }
    } catch (error: any) {
      const errorMessage = error.message.split(": ")[1];
      setRequestResponse({ error: errorMessage });
    }
    setIsSubmitting(false);
  };

  const signInHandler = async (userCredential: UserCred) => {
    const { email, password } = userCredential;

    try {
      setRequestResponse(null);
      setIsSubmitting(true);
      setShow(true);
      setUserIsLoggingIn(true);
      const auth = getAuth();
      const userCred = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setRequestResponse({ error: "Invalid credentials" });
      } else {
        setRequestResponse({ error: error.code });
      }
    }
    setIsSubmitting(false);
  };

  const signOutHandler = async () => {
    try {
      setRequestResponse(null);
      setUserIsSigningUp(false);
      setUserIsLoggingIn(false);
      setIsSubmitting(true);
      const auth = getAuth();
      await signOut(auth);
      if (signOutTimer) {
        clearTimeout(signOutTimer);
      }
      router.replace("/");
      setRequestResponse({ success: "You have successfully logged out" });
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
    }
  };

  const sendPasswordResetEmailHandler = async (email: string) => {
    try {
      setRequestResponse(null);
      setIsSubmitting(true);
      setShow(true);
      const auth = getAuth();
      const res = await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000?mode=login",
      });
      setRequestResponse({ success: "Email sent, check your email." });
      console.log("res", res);
    } catch (error: any) {
      const errorMessage = error.message.split(": ")[1];
      setRequestResponse({ error: errorMessage });
    }
    setIsSubmitting(false);
  };

  const confirmPasswordResetHandler = async (
    oobCode: string,
    newPassword: string
  ) => {
    try {
      setRequestResponse(null);
      setIsSubmitting(true);
      setShow(true);
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      router.push("http://localhost:3000?mode=login");
    } catch (error: any) {
      const errorMessage = error.message.split(": ")[1];
      setRequestResponse({ error: errorMessage });
    }
    setIsSubmitting(false);
  };

  const hideToastHandler = () => {
    setShow(false);
  };

  const contextValue = {
    user: user,
    loading,
    isSubmitting,
    requestResponse,
    createUserResponseData,
    show,
    signIn: signInHandler,
    signOut: signOutHandler,
    signUp: signUpHandler,
    sendPasswordResetEmail: sendPasswordResetEmailHandler,
    confirmPasswordReset: confirmPasswordResetHandler,
    hideToast: hideToastHandler,
    userIsLoggingIn,
    userIsSigningUp,
  };

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
