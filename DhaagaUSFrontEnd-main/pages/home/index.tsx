import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import HomeMap from "@/components/Maps/HomeMap";
import Layout from "@/components/Layout/Layout";
import Results from "@/components/Results/Results";
import Search from "@/components/Search/Search";
import Categories from "@/components/Categories/Categories";
import { ListData } from "@/Models/ListData";
import isAuthenticated from "@/utils/isAuthenticated";
import { countMilesToIncreaseRadiusByZoomingInAndOutMap } from "@/utils/countMilesToIncreaseRadiusByZoomingInAndOutMap";
import styles from "../../styles/HomePage.module.css";
import { CategoriesObject } from "@/Models/CategoriesObject";
import { usePrevious } from "@/hooks/usePreviousHook";
import { ProductDistanceContext } from "@/context/product-distance-context";
import ToastModal from "@/components/ToastModal/ToastModal";
import { UserLocationPermissionContext } from "@/context/user-location-permission-context";
import SearchPlaceInput from "@/components/SearchPlaceInput/SearchPlaceInput";
import getStripe from "@/get-stripejs";
import { useErrorBoundary } from "react-error-boundary";
import Home from "@/components/Home/Home";
import ErrorPage from "@/components/ErrorPage/ErrorPage";

const categoryIsActiveBySearchInitialState = {
  restaurants: false,
  henna: false,
  roomMates: false,
  homeFood: false,
  clothing: false,
  jewelry: false,
  salon: false,
  grocery: false,
};

const HomePage = (props: {
  data: { productsResult: ListData[]; error: { message: string } };
}) => {
  const { data } = props;
  const { productsResult, error } = data;

  if (error) {
    return <ErrorPage message={error.message} />;
  }
  return <Home products={productsResult} />;
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    await isAuthenticated(ctx);
  } catch (error: any) {
    console.log("Index Homepage getserversideprops", error);
    // ctx.res.writeHead(302, { Location: "/" });
    // ctx.res.end();

    // return { props: {} as never };

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const searchParams = new URLSearchParams();

  Object.entries(ctx.query).forEach(([key, value]) =>
    searchParams.append(key, `${value}`)
  );

  const queryString = searchParams.toString();

  const response = await fetch(
    process.env.URL + "/api/getList" + "?" + queryString
  );
  const responseData = await response.json();
  let data;
  if (!response.ok && response.status === 500) {
    data = {
      error: responseData,
    };
  } else {
    data = {
      productsResult: responseData,
    };
  }

  return {
    props: {
      data,
    },
  };
};

export default HomePage;
