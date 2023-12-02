import React, {
  Fragment,
  MutableRefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { ListData } from "@/Models/ListData";
import { MapJsApiLoaderContext } from "@/context/map-js-api-loader";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const options = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// const circleOptions = {
//   strokeColor: "#FF0000",
//   strokeOpacity: 0.8,
//   strokeWeight: 2,
//   fillColor: "#FF0000",
//   fillOpacity: 0.35,
//   clickable: false,
//   draggable: false,
//   editable: false,
//   visible: true,
//   radius: 1609.34 * 8192,
//   zIndex: 1,
// };

const HomeMap = (props: {
  currentLocation: { lat: number; lng: number };
  latLngFromSearchPlaceInput: { lat: number; lng: number } | null;
  items: ListData[];
  isCurrentLocationButtonPressed: boolean;
  onChange: (coords: { lat: number; lng: number; zoomValue: number }) => void;
  searchAddressInputRef: MutableRefObject<HTMLInputElement>;
}) => {
  const [firstTimeMapLoad, setFirstTimeMapLoad] = useState(false);
  const [map, setMap] = useState<google.maps.Map>();
  const { isLoaded, loadError } = useContext(MapJsApiLoaderContext);

  const router = useRouter();

  const {
    currentLocation,
    latLngFromSearchPlaceInput,
    items,
    isCurrentLocationButtonPressed,
    searchAddressInputRef,
    onChange,
  } = props;

  const previousPath = router.query.previousPath;

  useEffect(() => {
    if (
      previousPath === "/products/[productId]" &&
      map &&
      currentLocation.lat &&
      currentLocation.lng
    ) {
      const searchParams = new URLSearchParams(
        router.query.locations?.toString()
      );
      const lat = +searchParams.get("latitude")!;
      const lng = +searchParams.get("longitude")!;
      const zoom = +router.query.zoomValue!;
      map.setCenter({ lat, lng });
      map.setZoom(zoom);
      delete router.query.previousPath;
    }
  }, [map, currentLocation]);

  useEffect(() => {
    if (latLngFromSearchPlaceInput) {
      map?.setCenter(latLngFromSearchPlaceInput);
    }
  }, [latLngFromSearchPlaceInput]);

  useEffect(() => {
    if (isCurrentLocationButtonPressed) {
      map?.setCenter(currentLocation);
      searchAddressInputRef.current.value = "";
    }
  }, [isCurrentLocationButtonPressed]);

  if (!isLoaded) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }

  return (
    <GoogleMap
      onLoad={(map) => {
        setMap(map);
      }}
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={15}
      options={options}
      onIdle={() => {
        if (!firstTimeMapLoad) {
          setFirstTimeMapLoad(true);
          return;
        }
        const currentZoomValue = map?.getZoom();
        const locationCoordsAndZoomValue = {
          lat: map?.getCenter()?.lat()!,
          lng: map?.getCenter()?.lng()!,
          zoomValue: currentZoomValue!,
        };
        if (
          locationCoordsAndZoomValue.lat < -90 ||
          locationCoordsAndZoomValue.lat > 90 ||
          locationCoordsAndZoomValue.lng < -180 ||
          locationCoordsAndZoomValue.lng > 180
        ) {
          map?.setCenter({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
          });
        } else {
          onChange(locationCoordsAndZoomValue);
        }
      }}
    >
      {items &&
        items.map((item, index) => {
          const lat = item.location.coordinates[1];
          const lng = item.location.coordinates[0];
          return (
            <Fragment key={item._id}>
              <Marker position={{ lat, lng }} icon="/static/icon/marker.svg" />
            </Fragment>
          );
        })}

      {/* <Circle
          center={map?.getCenter() as google.maps.LatLng}
          options={circleOptions}
        /> */}
    </GoogleMap>
  );
};

export default React.memo(HomeMap);
