import BusinessProfileForm from "@/components/BusinessProfileForm/BusinessProfileForm";
import Layout from "@/components/Layout/Layout";
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const NewBusinessProfilePage = () => {
  // const [isAllowed, setIsAllowed] = useState(false);

  // const router = useRouter();

  // const { user, loading } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/");
  //   } else if (user) {
  //     const isUserAllowed = async () => {
  //       const res = await fetch("/api/isUserBusinessProfile");
  //       return res.json();
  //     };
  //     isUserAllowed().then((data: any) => {
  //       if (data.userCanMakeProduct) {
  //         setIsAllowed(true);
  //       } else if (!data.userCanMakeProduct) {
  //         router.push("/home");
  //       }
  //     });
  //   }
  // }, [loading, user, isAllowed]);

  // if (loading || !user || !isAllowed) {
  //   return <div></div>;
  // }

  return (
    <Layout>
      <BusinessProfileForm action="new" />
    </Layout>
  );
};

export default NewBusinessProfilePage;
