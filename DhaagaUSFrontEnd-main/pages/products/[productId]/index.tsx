import { GetServerSideProps } from "next";

import ErrorPage from "@/components/ErrorPage/ErrorPage";
import Layout from "@/components/Layout/Layout";
import Product from "@/components/Product/Product";
import { ProductDetail } from "@/Models/ListData";
import isAuthenticated from "@/utils/isAuthenticated";

const ProductPage = (props: {
  data: { productDetail: ProductDetail; error: { message: string } };
}) => {
  const { data } = props;
  const { productDetail, error } = data;

  if (error) {
    return <ErrorPage message={error.message} />;
  }
  return (
    <Layout>
      <Product productDetail={productDetail} />
    </Layout>
  );
};

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

  const productId = ctx.params?.productId;

  const response = await fetch(
    process.env.URL + "/api/getProduct/" + productId,
    {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );

  const responseData = await response.json();

  let data;
  if (!response.ok) {
    data = { error: responseData };
  } else {
    data = { productDetail: responseData };
  }

  return {
    props: {
      data,
    },
  };
};

export default ProductPage;
