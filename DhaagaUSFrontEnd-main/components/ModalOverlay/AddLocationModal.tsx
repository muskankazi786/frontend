import { MutableRefObject, useContext, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";

import styles from "../../styles/AddLocationModal.module.css";

import { MapJsApiLoaderContext } from "@/context/map-js-api-loader";
import { ProductDistanceContext } from "@/context/product-distance-context";
import { Button } from "react-bootstrap";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

const options = {
  fields: [
    "address_components",
    "geometry",
    // "icon",
    // "name",
    // "types",
    "formatted_address",
  ],
  componentRestrictions: { country: "us" },
  strictBounds: false,
  types: [],
};

const AddLocationModal = ({
  onData,
  onHide,
  ...otherProps
}: {
  show: boolean;
  onHide: () => void;
  onData: (addressData: {}) => void;
}) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [autocomplte, setAutocomplete] =
    useState<null | google.maps.places.Autocomplete>();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [fullAddress, setFullAddress] = useState<null | undefined | string>(
    null
  );
  const [addressObjectForForm, setAddressObjectForForm] = useState({});

  const { isLoaded, loadError } = useContext(MapJsApiLoaderContext);
  const { currentLocation } = useContext(ProductDistanceContext);

  const searchAddressInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const placeChangeHandler = () => {
    const place: google.maps.places.PlaceResult | undefined =
      autocomplte?.getPlace();
    if (place?.geometry) {
      let address = "";
      let addressObj: any = {
        address: "",
        location: { lat: 0, lng: 0 },
        city: "",
        state: "",
        country: "",
        zipCode: "",
        fullAddress: "",
      };
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];

        // if (componentType === "street_number") {
        //   address = component.long_name;
        // } else if (componentType === "route") {
        //   address += component.long_name;
        // } else if (componentType.includes("sublocality")) {
        //   address = `${address}, ${component.long_name}`;
        // }
        if (componentType === "locality" || componentType === "postal_town") {
          addressObj.city = component.long_name;
        } else if (componentType === "administrative_area_level_1") {
          addressObj.state = component.long_name;
        } else if (componentType === "country") {
          addressObj.country = component.long_name;
        } else if (componentType === "postal_code") {
          addressObj.zipCode = component.long_name;
        }
      }

      // Changing formatted_address from place object by cutting out the country name from it.
      const countryIndexFromAddress = place.formatted_address?.search(", USA");

      if (countryIndexFromAddress && countryIndexFromAddress !== -1) {
        addressObj.address = place.formatted_address?.slice(
          0,
          countryIndexFromAddress
        );
      } else if (countryIndexFromAddress && countryIndexFromAddress === -1) {
        const alternateCountryIndexFromAddress =
          place.formatted_address?.search(", United States");
        if (alternateCountryIndexFromAddress !== -1) {
          addressObj.address = place.formatted_address?.slice(
            0,
            alternateCountryIndexFromAddress
          );
        } else {
          addressObj.address = place.formatted_address;
        }
      } else {
        addressObj.address = place.formatted_address;
      }

      const locationObj = {
        lat: place.geometry.location?.lat()!,
        lng: place.geometry.location?.lng()!,
      };
      addressObj.location = locationObj;
      addressObj.fullAddress = place.formatted_address;
      setSelectedLocation(locationObj);
      setFullAddress(place.formatted_address);
      setAddressObjectForForm(addressObj);
    }
  };

  const sendDataToTheFormHandler = () => {
    if (!selectedLocation && !fullAddress) {
      return;
    }
    onData(addressObjectForForm);
    onHide();
    setSelectedLocation(null);
    setFullAddress(null);
    setAddressObjectForForm({});
  };

  return (
    <Modal
      {...otherProps}
      fullscreen="lg-down"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        onHide();
        setSelectedLocation(null);
        setFullAddress(null);
        setAddressObjectForForm({});
      }}
    >
      <Modal.Header
        closeButton
        style={{ borderBottom: 0, paddingBottom: 0 }}
      ></Modal.Header>
      <Modal.Body className={styles["custom-modal-body"]}>
        <div className="row position-relative h-100">
          <div className={`${styles["place-search"]} col-12 col-lg-6`}>
            {!isLoaded && <div style={{ textAlign: "center" }}>Loading...</div>}
            {isLoaded && (
              <GoogleMap
                onLoad={(map) => {
                  setMap(map);
                }}
                mapContainerStyle={containerStyle}
                center={!selectedLocation ? currentLocation : selectedLocation}
                zoom={15}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {selectedLocation?.lat && selectedLocation?.lng && (
                  <Marker position={selectedLocation} />
                )}
              </GoogleMap>
            )}
          </div>
          <div className="col">
            <div className="position-relative h-100">
              <div className={styles.label}>Add Location</div>
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
                >
                  <input
                    type="search"
                    name="search_address"
                    placeholder="Search address"
                    ref={searchAddressInputRef}
                  />
                </Autocomplete>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation(null);
                    setFullAddress(null);
                    setAddressObjectForForm({});
                    searchAddressInputRef.current.value = "";
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
              {fullAddress && (
                <div className={styles["address-card"]}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.2474 19.9353C9.28662 18.4137 7.82403 16.9314 6.85964 15.4882C5.89462 14.0451 5.41211 12.6255 5.41211 11.2294C5.41211 10.1157 5.61227 9.13906 6.01258 8.29953C6.41227 7.46063 6.92584 6.75882 7.55329 6.19412C8.18074 5.62941 8.88662 5.20588 9.67093 4.92353C10.4552 4.64118 11.2317 4.5 12.0003 4.5C12.769 4.5 13.5454 4.64118 14.3298 4.92353C15.1141 5.20588 15.82 5.62941 16.4474 6.19412C17.0749 6.75882 17.5887 7.46063 17.9891 8.29953C18.3887 9.13906 18.5886 10.1157 18.5886 11.2294C18.5886 12.6255 18.1061 14.0451 17.1411 15.4882C16.1767 16.9314 14.7141 18.4137 12.7533 19.9353L12.0003 20.5L11.2474 19.9353ZM13.3302 12.4172C12.9613 12.7861 12.518 12.9706 12.0003 12.9706C11.4827 12.9706 11.0397 12.7861 10.6714 12.4172C10.3025 12.0489 10.118 11.6059 10.118 11.0882C10.118 10.5706 10.3025 10.1273 10.6714 9.75835C11.0397 9.39004 11.4827 9.20588 12.0003 9.20588C12.518 9.20588 12.9613 9.39004 13.3302 9.75835C13.6985 10.1273 13.8827 10.5706 13.8827 11.0882C13.8827 11.6059 13.6985 12.0489 13.3302 12.4172Z"
                      fill="#71718F"
                    />
                  </svg>
                  <div className={styles.address}>{fullAddress}</div>
                  {/* <button type="button">EDIT</button> */}
                </div>
              )}
              <div className={styles["use-btn"]}>
                <button type="button" onClick={sendDataToTheFormHandler}>
                  Use this Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddLocationModal;
