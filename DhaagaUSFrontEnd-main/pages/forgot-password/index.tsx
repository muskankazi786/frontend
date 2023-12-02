import PasswordChangeModal from "@/components/ModalOverlay/PasswordChangeModal";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const ForgotPasswordPage = () => {
  const { loading, user } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  if (loading || user) {
    return <div></div>;
  }
  return <PasswordChangeModal header="Forgot Password" />;
};

export default ForgotPasswordPage;
