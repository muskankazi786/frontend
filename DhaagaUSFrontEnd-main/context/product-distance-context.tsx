import { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";

import { ListData } from "@/Models/ListData";
import { ProductDistanceContextObject } from "@/Models/ProductDistanceContextObject";

export const ProductDistanceContext =
  createContext<ProductDistanceContextObject>({
    currentLocation: {
      lat: 0,
      lng: 0,
    },
    processedData: [],
    getProductDistance: () => {},
    setProcessedData: () => {},
  });

const ProductDistanceProvider: React.FC<{ children: any }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [processedData, setProcessedData] = useState<ListData[] | []>([]);

  const router = useRouter();

  const sort_param = router.query.sort;
  const pathname = router.pathname;

  useEffect(() => {
    // console.log("inside find user's current location");
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

  const getProductDistanceHandler = (data: ListData[]) => {
    const directionsService = new google.maps.DirectionsService();
    let calculateDistancePromiseArray: any = [];
    const calculateDistance = async (
      destCoords: { lat: number; lng: number },
      itemId: string
    ) => {
      try {
        const results = await directionsService.route({
          origin: {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
          },
          destination: destCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        const distanceInMeters = results.routes[0].legs[0].distance!.value;
        const distanceInMiles =
          Math.round(distanceInMeters * 0.000621371 * 10) / 10;
        return { _id: itemId, distance: distanceInMiles };
      } catch (err) {
        return { _id: itemId, distance: undefined };
      }
    };
    data.forEach((item: ListData) => {
      const coords = {
        lat: item.location.coordinates[1],
        lng: item.location.coordinates[0],
      };
      calculateDistancePromiseArray.push(calculateDistance(coords, item._id));
    });
    Promise.all(calculateDistancePromiseArray).then(
      (values: { _id: string; distance: number }[]) => {
        const processed_data = data.map((item) => {
          const distanceOfProduct = values.find(
            (distanceOfProduct) => distanceOfProduct._id === item._id
          );
          item.distance = distanceOfProduct!.distance;
          return item;
        });
        if (sort_param === "distance" && pathname === "/home") {
          processed_data.sort((a, b) => a.distance! - b.distance!);
          console.log("processed_Data", processed_data);
        }
        setProcessedData(processed_data);
      }
    );
  };

  const setProcessedDataHandler = (data?: ListData[]) => {
    setProcessedData(data || []);
  };

  const contextValue = {
    currentLocation,
    processedData,
    getProductDistance: getProductDistanceHandler,
    setProcessedData: setProcessedDataHandler,
  };

  return (
    <ProductDistanceContext.Provider value={contextValue}>
      {children}
    </ProductDistanceContext.Provider>
  );
};

export default ProductDistanceProvider;
