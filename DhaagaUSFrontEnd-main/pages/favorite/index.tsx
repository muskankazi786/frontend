import { useContext, useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import Results from "@/components/Results/Results";
import { ListData } from "@/Models/ListData";
import isAuthenticated from "@/utils/isAuthenticated";
import { GetServerSideProps } from "next";

import styles from "../../styles/favortie.module.css";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ProductDistanceContext } from "@/context/product-distance-context";
import { FavoriteContext } from "@/context/favorite-context";
import ToastModal from "@/components/ToastModal/ToastModal";
import ErrorPage from "@/components/ErrorPage/ErrorPage";

const libraries: Libraries = ["places"];

const FavoritePage = (props: {
  data: { favProducts: ListData[]; error: { message: string } };
  isOnline: boolean;
}) => {
  const { data, isOnline } = props;
  const { favProducts, error } = data;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDsRLrZYiHB9PTnGfufaFZlIy8G_ffnIPc",
    libraries: libraries,
  });
  // const [processedData, setProcessedData] = useState<ListData[] | []>(
  //   favProducts || []
  // );
  const [resultsContainerHeight, setResultsContainerHeight] = useState(0);
  const [resultListUlHeight, setResultListUlHeight] = useState(0);
  const [overFlow, setOverFlow] = useState<boolean | null>(null);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const [isOnlineStatus, setIsOnlineStatus] = useState<boolean | null>(null);

  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const { processedData, getProductDistance, setProcessedData } = useContext(
    ProductDistanceContext
  );
  const { requestResponse, show, hideToast } = useContext(FavoriteContext);

  // const { currentLocation } = useContext(UserLocationContext);

  // useEffect(() => {
  //   setIsOnlineStatus(isOnline);
  // }, [isOnline]);

  useEffect(() => {
    const showPosition = (position: any) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const geoLocation = () =>
      navigator.geolocation.getCurrentPosition(showPosition, null, {
        enableHighAccuracy: true,
      });
    geoLocation();
  }, []);

  useEffect(() => {
    setResultsContainerHeight(
      (resultsContainerRef.current as HTMLDivElement)?.getBoundingClientRect()
        .height
    );
  });

  useEffect(() => {
    if (favProducts && favProducts.length) {
      setProcessedData(favProducts);
    }
  }, []);

  useEffect(() => {
    if (resultListUlHeight !== 0 && resultsContainerHeight !== 0) {
      if (resultListUlHeight > resultsContainerHeight - 54) {
        setOverFlow(true);
      } else if (resultListUlHeight <= resultsContainerHeight - 54) {
        setOverFlow(false);
      }
    }
  }, [resultListUlHeight, resultsContainerHeight]);

  useEffect(() => {
    if (
      isLoaded &&
      favProducts?.length &&
      currentLocation.lat &&
      currentLocation.lng
    ) {
      // const directionsService = new google.maps.DirectionsService();
      // let calculateDistancePromiseArray: any = [];
      // const calculateDistance = async (
      //   destCoords: { lat: number; lng: number },
      //   itemId: string
      // ) => {
      //   try {
      //     const results = await directionsService.route({
      //       origin: {
      //         lat: currentLocation.lat,
      //         lng: currentLocation.lng,
      //       },
      //       destination: destCoords,
      //       travelMode: google.maps.TravelMode.DRIVING,
      //     });
      //     const distanceInMeters = results.routes[0].legs[0].distance!.value;
      //     const distanceInMiles =
      //       Math.round(distanceInMeters * 0.000621371 * 10) / 10;
      //     return { _id: itemId, distance: distanceInMiles };
      //   } catch (err) {
      //     return { _id: itemId, distance: undefined };
      //   }
      // };

      // favProducts?.forEach((item: ListData) => {
      //   const coords = {
      //     lat: item.location.coordinates[1],
      //     lng: item.location.coordinates[0],
      //   };
      //   calculateDistancePromiseArray.push(calculateDistance(coords, item._id));
      // });

      // Promise.all(calculateDistancePromiseArray).then(
      //   (values: { _id: string; distance: number }[]) => {
      //     const processed_data = favProducts.map((item) => {
      //       const distanceOfProduct = values.find(
      //         (distanceOfProduct) => distanceOfProduct._id === item._id
      //       );
      //       item.distance = distanceOfProduct!.distance;
      //       return item;
      //     });
      //     setProcessedData(processed_data);
      //   }
      // );
      getProductDistance(favProducts);
    } else if (!favProducts?.length && processedData) {
      setProcessedData([]);
    }
    return;
  }, [isLoaded, favProducts, currentLocation]);

  // useEffect(() => {
  //   if (window.google && items.length) {
  //     const directionsService = new google.maps.DirectionsService();
  //     let calculateDistancePromiseArray: any = [];
  //     const calculateDistance = async (
  //       destCoords: { lat: number; lng: number },
  //       itemId: string
  //     ) => {
  //       const results = await directionsService.route({
  //         origin: {
  //           lat: currentLocation.lat,
  //           lng: currentLocation.lng,
  //         },
  //         destination: destCoords,
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       });
  //       if (results.routes.length !== 0) {
  //         const distanceInMeters = results.routes[0].legs[0].distance!.value;
  //         const distanceInMiles =
  //           Math.round(distanceInMeters * 0.000621371 * 10) / 10;
  //         return { _id: itemId, distance: distanceInMiles };
  //       } else {
  //         throw new Error("No routes available");
  //       }
  //     };

  //     items.forEach((item: ListData) => {
  //       const coords = {
  //         lat: item.location.coordinates[1],
  //         lng: item.location.coordinates[0],
  //       };
  //       calculateDistancePromiseArray.push(calculateDistance(coords, item._id));
  //     });

  //     Promise.all(calculateDistancePromiseArray)
  //       .then((values: { _id: string; distance: number }[]) => {
  //         // console.log("RoutesArray", values);
  //         getDistance(values);
  //       })
  //       .catch((err: any) => console.log("No Routes Found"));
  //   }
  //   return;
  // }, [items]);

  const resultListUlHeightChangeHandler = (height: number) => {
    setResultListUlHeight(height);
  };

  // if (isOnlineStatus === null) {
  //   return <div></div>;
  // }

  // if (isOnlineStatus && error) {
  //   return <ErrorPage message={error.message} />;
  // }

  // if (!isOnlineStatus && error) {
  //   return <ErrorPage message="Networkk Lost!" />;
  // }

  // if (!isOnlineStatus) {
  //   return <ErrorPage message="Networkk Lost!" />;
  // }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <Layout>
      <>
        {requestResponse && requestResponse.error && show && (
          <ToastModal
            variant="danger"
            header="Error!"
            body={requestResponse.error}
            show={show}
            onClose={() => hideToast()}
          />
        )}
        <div className={styles["grid-center-container"]}>
          <div></div>
          <div
            className={styles["results-cntnr"]}
            ref={resultsContainerRef}
            style={{
              height: "100%",
              overflowY:
                overFlow === true
                  ? "scroll"
                  : overFlow === null
                  ? "hidden"
                  : "unset",
            }}
          >
            <Results
              setUlHeight={resultListUlHeightChangeHandler}
              isForFavoritePage={true}
              items={processedData}
              notFoundText="You don't have any favorite Product"
            />
          </div>
          <div></div>
        </div>
      </>
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
  const response = await fetch(process.env.URL + "/api/favorite", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });

  const responseData = await response.json();

  let data;
  if (!response.ok && response.status === 500) {
    data = {
      error: responseData,
    };
  } else if (!response.ok && response.status === 404) {
    data = { favProducts: [] };
  } else {
    data = responseData;
  }

  return {
    props: {
      data,
    },
  };
};

export default FavoritePage;
