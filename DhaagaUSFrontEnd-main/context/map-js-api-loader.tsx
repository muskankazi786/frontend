import { createContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import { MapJsApiLoaderContextObject } from "@/Models/MapJsApiLoaderContextObject";

// const libraries: (
//   | "drawing"
//   | "geometry"
//   | "localContext"
//   | "places"
//   | "visualization"
// )[] = ["places"];

export const MapJsApiLoaderContext = createContext<MapJsApiLoaderContextObject>(
  {
    isLoaded: false,
    loadError: undefined,
  }
);

const MapJsApiLoaderProvider: React.FC<{ children: any }> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDsRLrZYiHB9PTnGfufaFZlIy8G_ffnIPc",
    libraries: ["places"],
  });

  const contextValue = {
    isLoaded,
    loadError,
  };

  return (
    <MapJsApiLoaderContext.Provider value={contextValue}>
      {children}
    </MapJsApiLoaderContext.Provider>
  );
};

export default MapJsApiLoaderProvider;
