import { useContext, useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapJsApiLoaderContext } from "@/context/map-js-api-loader";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px",
};

const options = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const MapInProfileForm = (props: {
  location: { lat: number; lng: number };
  addressCardRects: { width: number; height: number };
  isLoading: boolean;
}) => {
  const { location, addressCardRects, isLoading } = props;
  const { width: addressCardWidth, height: addressCardHeight } =
    addressCardRects;
  const [map, setMap] = useState<google.maps.Map>();

  const { isLoaded, loadError } = useContext(MapJsApiLoaderContext);

  useEffect(() => {
    if (map && addressCardWidth && addressCardHeight && !isLoading) {
      const windowInnerWidth = window.innerWidth;
      let x = 0;
      let y = 0;
      if (windowInnerWidth > 575) {
        x = addressCardWidth / 1.7;
      } else {
        y = addressCardHeight / 1.7;
      }
      setTimeout(() => {
        map?.panBy(x, 29);
      }, 1000);
    }
  }, [map, addressCardRects, isLoading]);

  if (!isLoaded) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }

  return (
    <GoogleMap
      onLoad={(map) => {
        setMap(map);
      }}
      mapContainerStyle={containerStyle}
      center={location}
      zoom={14}
      options={options}
    >
      <Marker position={location} onLoad={() => map?.panBy(100, 0)} />
    </GoogleMap>
  );
};

export default MapInProfileForm;
