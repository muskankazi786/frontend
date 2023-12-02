import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useErrorBoundary } from "react-error-boundary";

import { ListData } from "@/Models/ListData";
import BusinessProfileForm from "@/components/BusinessProfileForm/BusinessProfileForm";
import Layout from "@/components/Layout/Layout";
import { AuthContext } from "@/context/auth-context";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

const EditBusinessProfilePage = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [product, setProduct] = useState<ListData>();

  const router = useRouter();
  const { showBoundary } = useErrorBoundary();

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      const isUserAllowed = async () => {
        const res = await catchAsyncFetch(
          "/api/isUserEditBusinessProfile",
          showBoundary
        );

        if (!res) {
          return;
        }

        return res.json();
      };
      isUserAllowed().then((data: any) => {
        if (data.userCanEditProduct) {
          setProduct(data.product);
          setIsAllowed(true);
        } else if (!data.userCanEditProduct) {
          router.push("/home");
        }
      });
    }
  }, [loading, user]);

  const setIsAllowedHandler = () => {
    setIsAllowed(false);
  };

  if (loading || !user || !isAllowed) {
    return <div></div>;
  }

  return (
    <Layout>
      <BusinessProfileForm action="edit" product={product} />
    </Layout>
  );
};

export default EditBusinessProfilePage;
