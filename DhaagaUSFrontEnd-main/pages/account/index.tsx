import ErrorPage from "@/components/ErrorPage/ErrorPage";
import Layout from "@/components/Layout/Layout";
import Profile from "@/components/Profile/Profile";
import isAuthenticated from "@/utils/isAuthenticated";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

const AccountPage = (props: {
  data: { user: any; error: { message: string } };
}) => {
  const { data } = props;
  const { user, error } = data;

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <Layout>
      <Profile user={user} />
    </Layout>
  );
};

export default AccountPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let authToken;
  try {
    const { token } = await isAuthenticated(ctx);
    authToken = token;
  } catch (err) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const res = await fetch(process.env.URL + "/api/getUser", {
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });

  const resData = await res.json();

  let data;
  if (!res.ok && res.status === 500) {
    data = {
      error: resData,
    };
  } else {
    data = {
      user: resData.user,
    };
  }

  return {
    props: {
      data,
    },
  };
};
