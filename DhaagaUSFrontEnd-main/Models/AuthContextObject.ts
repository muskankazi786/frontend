import { User } from "firebase/auth";
import { UserCred } from "./UserCred";
import { CreateUserResponse } from "./CreateUserResponse";

export interface AuthContextObject {
  user: User | null;
  signIn: (userCred: UserCred) => void;
  signOut: () => void;
  signUp: (userCred: UserCred, joinAsBusiness: boolean) => void;
  sendPasswordResetEmail: (email: string) => void;
  confirmPasswordReset: (oobCode: string, newPassword: string) => void;
  loading: boolean;
  isSubmitting: boolean;
  show: boolean;
  hideToast: () => void;
  requestResponse: null | { success?: string; error?: string };
  createUserResponseData: CreateUserResponse | null;
  userIsLoggingIn: boolean;
  userIsSigningUp: boolean;
}
