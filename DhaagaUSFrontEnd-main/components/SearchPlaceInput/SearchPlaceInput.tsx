import { ForwardedRef, forwardRef, useContext, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

import styles from "../../styles/SearchPlaceInput.module.css";

import { MapJsApiLoaderContext } from "@/context/map-js-api-loader";

const options = {
  fields: [
    // "address_components",
    "geometry",
    // "icon",
    // "name",
    // "types",
    // "formatted_address",
  ],
  componentRestrictions: { country: "us" },
  strictBounds: false,
  types: [],
};

const SearchPlaceInput = forwardRef(
  (
    props: {
      getSearchedPlaceCoordinates: (latLng: {
        lat: number;
        lng: number;
      }) => void;
      setIsCurrentLocationButtonPressed: (pressed: boolean) => void;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [autocomplte, setAutocomplete] =
      useState<null | google.maps.places.Autocomplete>();

    const { isLoaded } = useContext(MapJsApiLoaderContext);

    const { setIsCurrentLocationButtonPressed, getSearchedPlaceCoordinates } =
      props;

    const placeChangeHandler = () => {
      const place: google.maps.places.PlaceResult | undefined =
        autocomplte?.getPlace();
      if (place?.geometry) {
        console.log(place);
        const latLng = {
          lat: place.geometry.location?.lat()!,
          lng: place.geometry.location?.lng()!,
        };
        getSearchedPlaceCoordinates(latLng);
      }
    };

    if (!isLoaded) {
      return <div></div>;
    }

    return (
      <div className={styles.controls}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["search-icon"]}
        >
          <path
            d="M11.7001 17.4001C14.8481 17.4001 17.4001 14.8481 17.4001 11.7001C17.4001 8.552 14.8481 6 11.7001 6C8.55201 6 6 8.552 6 11.7001C6 14.8481 8.55201 17.4001 11.7001 17.4001Z"
            stroke="#9B9AB9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.0004 19.0004L15.8252 15.8252"
            stroke="#9B9AB9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <Autocomplete
          options={options}
          onLoad={(autocomplete: google.maps.places.Autocomplete) =>
            setAutocomplete(autocomplete)
          }
          onPlaceChanged={placeChangeHandler}
          className={styles.autocomplete}
        >
          <input
            type="search"
            name="search_address"
            placeholder="Search address"
            ref={ref}
            //   value={searchAddress}
            //   onChange={(e) => setSearchAddress(e.target.value)}
          />
        </Autocomplete>
        <div className={styles["action-controls"]}>
          <button
            type="button"
            onClick={() => {
              setIsCurrentLocationButtonPressed(true);
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2694 19.9999V18.5387C9.7473 18.3683 8.44149 17.7382 7.35194 16.6487C6.2619 15.5587 5.63165 14.2526 5.46118 12.7305H4V11.2694H5.46118C5.63165 9.7473 6.2619 8.44125 7.35194 7.35121C8.44149 6.26166 9.7473 5.63165 11.2694 5.46118V4H12.7305V5.46118C14.2526 5.63165 15.5587 6.26166 16.6487 7.35121C17.7382 8.44125 18.3683 9.7473 18.5387 11.2694H19.9999V12.7305H18.5387C18.3683 14.2526 17.7382 15.5587 16.6487 16.6487C15.5587 17.7382 14.2526 18.3683 12.7305 18.5387V19.9999H11.2694ZM11.9999 17.1141C13.4124 17.1141 14.6179 16.6148 15.6164 15.6164C16.6148 14.6179 17.1141 13.4124 17.1141 11.9999C17.1141 10.5875 16.6148 9.38201 15.6164 8.38353C14.6179 7.38506 13.4124 6.88583 11.9999 6.88583C10.5875 6.88583 9.38201 7.38506 8.38353 8.38353C7.38506 9.38201 6.88583 10.5875 6.88583 11.9999C6.88583 13.4124 7.38506 14.6179 8.38353 15.6164C9.38201 16.6148 10.5875 17.1141 11.9999 17.1141ZM11.9999 14.9223C11.1963 14.9223 10.5083 14.6362 9.93604 14.0639C9.36374 13.4916 9.07759 12.8036 9.07759 11.9999C9.07759 11.1963 9.36374 10.5083 9.93604 9.93604C10.5083 9.36374 11.1963 9.07759 11.9999 9.07759C12.8036 9.07759 13.4916 9.36374 14.0639 9.93604C14.6362 10.5083 14.9223 11.1963 14.9223 11.9999C14.9223 12.8036 14.6362 13.4916 14.0639 14.0639C13.4916 14.6362 12.8036 14.9223 11.9999 14.9223Z"
                fill="#6033CA"
              />
            </svg>
            Current Location
          </button>
        </div>
      </div>
    );
  }
);

export default SearchPlaceInput;
