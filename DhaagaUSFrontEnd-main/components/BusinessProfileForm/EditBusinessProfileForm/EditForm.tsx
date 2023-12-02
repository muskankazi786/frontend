import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { PatternFormat } from "react-number-format";

import useInput from "@/hooks/useInput";
import useTextArea from "@/hooks/useTextArea";
import usePhoneInput from "@/hooks/usePhoneInput";

import { AddressData } from "@/Models/AddressData";

import styles from "../../../styles/ProfileForm.module.css";

import AddLocationModal from "@/components/ModalOverlay/AddLocationModal";
import MapInProfileForm from "@/components/Maps/MapInProfileForm";
import ToastModal from "@/components/ToastModal/ToastModal";
import FileListObject, { ImageUrlsObject } from "@/Models/FileListObject";
import { BusinessHoursObject } from "@/Models/BusinessHoursObject";
import { ListData } from "@/Models/ListData";
import BusinessHoursInput from "../BusinessHoursInput";
import {
  isNotEmpty,
  isNotMoreThanSaidLimit,
  isValidUrl,
} from "@/utils/validation/conditions";
import {
  addImagesToTheCloud,
  delteImagesFromTheCloud,
} from "@/utils/editProductImages";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

const us_states = require("../../../us_states.json");

const initialBusinessDaysState: {
  [key: string]: boolean;
} = {
  Sunday: false,
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: false,
};

const initialBusinessHoursState: BusinessHoursObject = {
  Sunday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Monday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Tuesday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Wednesday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Thursday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Friday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
  Saturday: [
    { open: "", close: "" },
    { open: "", close: "" },
  ],
};

const initialStoreIsClosedState: { [key: string]: boolean } = {
  Sunday: false,
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: false,
};

const showMoreTimeFieldFromTheForm: { [key: string]: boolean } = {
  Sunday: false,
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: false,
};

const EditForm = (props: { product: ListData | undefined }) => {
  const { product } = props;

  let phoneNumberWithoutCode;
  let phoneCode;
  if (product?.phone) {
    phoneNumberWithoutCode = product?.phone?.substring(2);
    phoneCode = product?.phone?.substring(0, 2);
  }

  for (let key in product?.business_hours) {
    if (
      product?.business_hours[key][0].open &&
      product?.business_hours[key][0].close
    ) {
      initialBusinessDaysState[key] = true;
      initialBusinessHoursState[key][0].open =
        product?.business_hours[key][0].open;
      initialBusinessHoursState[key][0].close =
        product?.business_hours[key][0].close;
    }
    if (
      product?.business_hours[key][1].open &&
      product?.business_hours[key][1].close
    ) {
      initialBusinessHoursState[key][1].open =
        product?.business_hours[key][1].open;
      initialBusinessHoursState[key][1].close =
        product?.business_hours[key][1].close;
      showMoreTimeFieldFromTheForm[key] = true;
    }
    if (product?.business_hours[key][2]) {
      initialBusinessDaysState[key] = true;
      initialStoreIsClosedState[key] = true;
      initialBusinessHoursState[key][2] = { closed: "Closed" };
    }
  }

  const lat = product?.location.coordinates[1]!;
  const lng = product?.location.coordinates[0]!;
  const initialAddressFromProduct: AddressData = {
    location: { lat, lng },
  };

  // Business Name Input's useInput Hook

  const {
    value: enteredBusinessName,
    isValid: businessNameIsValid,
    hasError: businessNameInputHasError,
    errorText: businessNameInputErrorText,
    valueChangeHandler: businessNameInputChangeHandler,
    inputBlurHandler: businessNameInputBlurHandler,
    inputTouchHandler: businessNameInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 50)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Business name must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "Business name must be at most 50 characters",
      };
    }
  }, product?.name);

  // Business Description Input's useTextAreaHook

  const {
    value: enteredBusinessDescription,
    wordCount: businessDescriptionWordCount,
    isValid: businessDescriptionIsValid,
    hasError: businessDescriptionInputHasError,
    errorText: businessDescriptionInputErrorText,
    valueChangeHandler: businessDescriptionInputChangeHandler,
    inputBlurHandler: businessDescriptionInputBlurHandler,
    inputTouchHandler: businssDescriptionInputTouchHandler,
  } = useTextArea(
    (value: string | undefined) => {
      if (!isNotEmpty(value)) {
        return { valid: true };
      } else if (!isNotMoreThanSaidLimit(value, 200)) {
        return {
          valid: false,
          errorText: "Business description must be at most 200 characters",
        };
      } else {
        return { valid: true };
      }
    },
    product?.description,
    product?.description?.length
  );

  // Website Url Input's useInputHook

  const {
    value: enteredBusinessWebsite,
    isValid: businessWebsiteIsValid,
    hasError: businessWebsiteInputHasError,
    errorText: businessWebsiteInputErrorText,
    valueChangeHandler: businessWebsiteInputChangeHandler,
    inputBlurHandler: businessWebsiteInputBlurHandler,
    inputTouchHandler: businessWebsiteInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (!isNotEmpty(value)) {
      return { valid: true };
    } else if (!isValidUrl(value)) {
      return { valid: false, errorText: "Please enter a valid url" };
    } else {
      return { valid: true };
    }
  }, product?.site);

  // // Business Address Input's useInputHook

  const {
    value: enteredAddress,
    isValid: businessAddressIsValid,
    hasError: businessAddressInputHasError,
    errorText: businessAddressInputErrorText,
    valueChangeHandler: businessAddressInputChangeHandler,
    inputBlurHandler: businessAddressInputBlurHandler,
    updateValueHandler: addressUpdateHandler,
    inputTouchHandler: businessAddressInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 200)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Address must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "Address must be at most 200 characters",
      };
    }
  }, product?.full_address);

  // City Input's useInputHook

  const {
    value: enteredCity,
    isValid: cityIsValid,
    hasError: cityInputHasError,
    errorText: cityInputErrorText,
    valueChangeHandler: cityInputChangeHandler,
    inputBlurHandler: cityInputBlurHandler,
    updateValueHandler: cityUpdateHandler,
    inputTouchHandler: cityInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 50)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "City must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "City must be at most 50 characters",
      };
    }
  }, product?.city);

  // Zip Code Input's useInputHook

  const {
    value: enteredZipCode,
    isValid: zipCodeIsValid,
    hasError: zipCodeInputHasError,
    errorText: zipCodeInputErrorText,
    valueChangeHandler: zipCodeInputChangeHandler,
    inputBlurHandler: zipCodeInputBlurHandler,
    updateValueHandler: zipCodeUpdateHandler,
    inputTouchHandler: zipCodeInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (!isNotEmpty(value)) {
      return { valid: true };
    } else if (!isNotMoreThanSaidLimit(value, 15)) {
      return {
        valid: false,
        errorText: "Zip code must be at most 15 characters",
      };
    } else {
      return { valid: true };
    }
  }, product?.zip_code);

  // Phone number Input's usePhoneInput hook

  const {
    enteredPhoneNumber,
    phoneNumberIsValid,
    phoneNumberInputHasError,
    phoneNumberInputErrorText,
    phoneNumberInputChangeHandler,
    phoneNumberInputBlurHandler,
    phoneNumberInputTouchHandler,
  } = usePhoneInput(phoneNumberWithoutCode);

  const [showToast, setShowToast] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [reqResponse, setRequestResponse] = useState<{
    success?: string;
    error?: string;
  } | null>(null);

  const [enteredCategory, setEnteredCategory] = useState(product?.category);
  const [enteredStateReg, setEnteredStateReg] = useState(product?.state);
  const [enteredStateRegSelect, setEnteredStateRegSelect] = useState(
    product?.state
  );
  const [enteredPhoneCode, setEnteredPhoneCode] = useState(phoneCode || "+1");
  const [phoneNumberWithCode, setPhoneNumberWithCode] = useState(
    product?.phone
  );
  const [enteredBusinessDays, setEnteredBusinessDays] = useState<{
    [key: string]: boolean;
  }>(initialBusinessDaysState);
  const [enteredBusinessHours, setEnteredBusinessHours] =
    useState<BusinessHoursObject>(initialBusinessHoursState);
  const [storeIsClosed, setStoreIsClosed] = useState<{
    [key: string]: boolean;
  }>(initialStoreIsClosedState);

  const [imageUrls, setImageUrls] = useState<
    (ImageUrlsObject | string)[] | [] | undefined
  >(product?.photos);
  const [fileList, setFileList] = useState<FileListObject[] | []>([]);

  const [addressDataFromLocationModal, setAddressDataFromLocationModal] =
    useState<null | AddressData>(initialAddressFromProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [addressCardElementRects, setAddressCardElementRects] = useState({
    width: 0,
    height: 0,
  });

  const [imagesToBeRemoved, setImagesToBeRemoved] = useState<string[] | []>([]);

  const [isVerifying, setIsVerifying] = useState(false);

  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  const businessNameInputRef = useRef<HTMLInputElement>(null);
  const businessDescriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const businessWebsiteInputRef = useRef<HTMLInputElement>(null);
  const businessAddressInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const zipCodeInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const addressCardElementRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    setAddressCardElementRects({
      width: (
        addressCardElementRef.current as HTMLDivElement
      ).getBoundingClientRect().width,
      height: (
        addressCardElementRef.current as HTMLDivElement
      ).getBoundingClientRect().height,
    });
    setIsLoading(false);
  }, [addressDataFromLocationModal]);

  useEffect(() => {
    if (fileList.length === 0) {
      return;
    }
    const fileListLength = fileList.length;
    let urlsOfImages: ImageUrlsObject[] = [];
    for (let i = 0; i < fileListLength; i++) {
      const url = URL.createObjectURL(fileList[i].file);
      const imageUrlObject = new ImageUrlsObject(url, fileList[i].id);
      urlsOfImages.push(imageUrlObject);
    }

    setImageUrls((prevState) => {
      const filteredState = prevState?.filter(
        (item) => typeof item === "string"
      );
      return [...filteredState!, ...urlsOfImages];
    });
  }, [fileList]);

  useEffect(() => {
    if (
      addressDataFromLocationModal &&
      addressDataFromLocationModal.address &&
      !enteredAddress
    ) {
      addressUpdateHandler(addressDataFromLocationModal.address);
    }
    if (
      addressDataFromLocationModal &&
      addressDataFromLocationModal.city &&
      !enteredCity
    ) {
      cityUpdateHandler(addressDataFromLocationModal.city);
    }
    if (addressDataFromLocationModal && addressDataFromLocationModal.state) {
      setEnteredStateRegSelect(addressDataFromLocationModal.state);
    }
    if (
      addressDataFromLocationModal &&
      addressDataFromLocationModal.zipCode &&
      !enteredZipCode
    ) {
      zipCodeUpdateHandler(addressDataFromLocationModal.zipCode);
    }
  }, [addressDataFromLocationModal]);

  let formIsValid = false;
  if (
    businessNameIsValid &&
    businessDescriptionIsValid &&
    businessWebsiteIsValid &&
    businessAddressIsValid &&
    cityIsValid &&
    zipCodeIsValid &&
    phoneNumberIsValid
  ) {
    formIsValid = true;
  }

  // Category Select
  const categorySelectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setEnteredCategory(e.target.value);
  };

  // Business State Input
  const stateSelectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setEnteredStateRegSelect(e.target.value);
  };

  // Business Phone Number and Phone Code Input
  const phoneNumberInputHandler = (
    e?: ChangeEvent<HTMLSelectElement>,
    phoneNumber?: string
  ) => {
    if (e && e.target.id === "country-code") {
      setEnteredPhoneCode(e.target.value);
      if (enteredPhoneNumber) {
        const phoneNumberWithCode = `${e.target.value}${enteredPhoneNumber}`;
        setPhoneNumberWithCode(phoneNumberWithCode);
      }
    }
    if (phoneNumber !== undefined) {
      if (phoneNumber === "") {
        phoneNumberInputChangeHandler("");
        setPhoneNumberWithCode("");
      } else {
        phoneNumberInputChangeHandler(phoneNumber);
        const phoneNumberWithCode = `${enteredPhoneCode}${phoneNumber}`;
        setPhoneNumberWithCode(phoneNumberWithCode);
      }
    }
  };

  // BUSINESS HOURS HANDLERS

  // Business Day Select Handler
  const businessDayCheckHandler = (e: ChangeEvent<HTMLDivElement>) => {
    const day = (e.target as HTMLInputElement).value;
    setEnteredBusinessDays((prevState) => {
      if (prevState[day] === true) {
        if (storeIsClosed[day] === true) {
          setStoreIsClosed((prevStoreState) => ({
            ...prevStoreState,
            [day]: false,
          }));
        } else {
          setEnteredBusinessHours((prevHoursState) => ({
            ...prevHoursState,
            [day]: [
              { open: "", close: "" },
              { open: "", close: "" },
            ],
          }));
        }
      }
      return { ...prevState, [day]: !prevState[day] };
    });
  };

  // Business Hours Input Handlers

  const businessHoursFirstSpanFromHandler = (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => {
    e.stopPropagation();
    setEnteredBusinessHours((prevState) => ({
      ...prevState,
      [dayId]: [
        { ...prevState[dayId][0], open: e.target.value },
        { ...prevState[dayId][1] },
      ],
    }));
  };
  const businessHoursFirstSpanToHandler = (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => {
    e.stopPropagation();
    setEnteredBusinessHours((prevState) => ({
      ...prevState,
      [dayId]: [
        { ...prevState[dayId][0], close: e.target.value },
        { ...prevState[dayId][1] },
      ],
    }));
  };
  const businessHoursSecondSpanFromHandler = (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => {
    e.stopPropagation();
    setEnteredBusinessHours((prevState) => ({
      ...prevState,
      [dayId]: [
        { ...prevState[dayId][0] },
        { ...prevState[dayId][1], open: e.target.value },
      ],
    }));
  };
  const businessHoursSecondSpanToHandler = (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => {
    e.stopPropagation();
    setEnteredBusinessHours((prevState) => ({
      ...prevState,
      [dayId]: [
        { ...prevState[dayId][0] },
        { ...prevState[dayId][1], close: e.target.value },
      ],
    }));
  };

  // Store Closed Handler
  const storeCloseHandler = (dayId: string) => {
    setStoreIsClosed((prevState) => {
      if (prevState[dayId] === false) {
        setEnteredBusinessHours((prevHoursState) => ({
          ...prevHoursState,
          [dayId]: [
            { open: "", close: "" },
            { open: "", close: "" },
            { closed: "Closed" },
          ],
        }));
      } else {
        setEnteredBusinessHours((prevHoursState) => ({
          ...prevHoursState,
          [dayId]: [
            { open: "", close: "" },
            { open: "", close: "" },
          ],
        }));
      }
      return { ...prevState, [dayId]: !prevState[dayId] };
    });
  };

  // Second Span Reset While Pressing Minus Button
  const secondSpanResetHandler = (dayId: string) => {
    setEnteredBusinessHours((prevState) => ({
      ...prevState,
      [dayId]: [{ ...prevState[dayId][0] }, { open: "", close: "" }],
    }));
  };

  // Business Images Upload Handler
  const uploadFileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files![0];
    const files = e.target.files!;

    const fileListArray: FileListObject[] = [...fileList];

    let loopLength = 0;
    const idealFileLength = 5 - imageUrls!.length;
    const filesLength = Object.keys(files).length;

    if (filesLength <= idealFileLength) {
      loopLength = filesLength;
    }
    if (filesLength > idealFileLength) {
      loopLength = idealFileLength;
    }

    for (let i = 0; i < loopLength; i++) {
      const filesObject = new FileListObject(files[i]);
      fileListArray.push(filesObject);
    }

    setFileList(fileListArray);
    e.target.value = "";
  };

  // Remove Business Images From Selected Images
  const removeFromSelectedImagesHandler = (
    imageItem: ImageUrlsObject | string
  ) => {
    if (typeof imageItem === "string") {
      const filteredImages = imageUrls!.filter(
        (imageData) =>
          typeof imageData === "object" ||
          (typeof imageData === "string" && imageData !== imageItem)
      );
      setImageUrls(filteredImages);
      setImagesToBeRemoved((prevState) => [...prevState, imageItem]);
    } else if (typeof imageItem === "object") {
      const filteredImages = imageUrls!.filter(
        (imageData) =>
          typeof imageData === "string" ||
          (typeof imageData === "object" && imageData.url !== imageItem.url)
      );
      const filteredFileList = fileList.filter(
        (fileItem) => fileItem.id !== imageItem.id
      );
      setImageUrls(filteredImages);
      setFileList(filteredFileList);
    }
  };

  //Updating Address Data Coming From The Add Location Model
  const addressDataFromLocationModalHandler = (addressData: any) => {
    setIsLoading(true);
    setAddressDataFromLocationModal(addressData);
  };

  // Form Submit Handler
  const submitFormHandler = async () => {
    // e.preventDefault();

    // Set all touch state to true
    businessNameInputTouchHandler();
    businssDescriptionInputTouchHandler();
    businessWebsiteInputTouchHandler();
    businessAddressInputTouchHandler();
    cityInputTouchHandler();
    zipCodeInputTouchHandler();
    phoneNumberInputTouchHandler();

    if (!formIsValid) {
      if (!businessNameIsValid) {
        setTimeout(() => {
          businessNameInputRef.current?.focus();
        }, 0);
        return;
      } else if (!businessDescriptionIsValid) {
        setTimeout(() => {
          businessDescriptionInputRef.current?.focus();
        }, 0);
        return;
      } else if (!businessWebsiteIsValid) {
        setTimeout(() => {
          businessWebsiteInputRef.current?.focus();
        }, 0);
        return;
      } else if (!businessAddressIsValid) {
        setTimeout(() => {
          businessAddressInputRef.current?.focus();
        }, 0);
        return;
      } else if (!cityIsValid) {
        setTimeout(() => {
          cityInputRef.current?.focus();
        }, 0);
        return;
      } else if (!zipCodeIsValid) {
        setTimeout(() => {
          zipCodeInputRef.current?.focus();
        }, 0);
        return;
      } else {
        setTimeout(() => {
          phoneNumberInputRef.current?.focus();
        }, 0);
        return;
      }
    }
    setRequestResponse(null);
    setIsVerifying(true);
    setShowToast(true);
    const formData = new FormData(formRef.current!);

    const formDataObject: any = {};

    formData.append("phone", phoneNumberWithCode!);

    const currentBusinessHours = Object.assign({}, enteredBusinessHours);
    for (let key in currentBusinessHours) {
      if (
        currentBusinessHours[key].length === 3 &&
        ((currentBusinessHours[key][0].open &&
          currentBusinessHours[key][0].close) ||
          (currentBusinessHours[key][0].open &&
            currentBusinessHours[key][0].close &&
            currentBusinessHours[key][1].open &&
            currentBusinessHours[key][1].close))
      ) {
        currentBusinessHours[key].splice(2, 1);
      }
    }

    formDataObject["business_hours"] = currentBusinessHours;

    if (addressDataFromLocationModal?.location.lat) {
      const lat = addressDataFromLocationModal?.location.lat.toString();
      const lng = addressDataFromLocationModal?.location.lng.toString();
      formData.append("lat", lat);
      formData.append("lng", lng);
    }

    let photos: string[] = [];
    let newAddedPhotos: string[] = [];

    try {
      if (!imagesToBeRemoved.length && !fileList.length) {
        photos = [...product?.photos!];
      }
      if (imagesToBeRemoved.length && !fileList.length) {
        const deleteImagesPromiseArray = delteImagesFromTheCloud(
          imagesToBeRemoved,
          showBoundary
        );

        await Promise.all(deleteImagesPromiseArray);
        let filteredPhotos = [...product?.photos!];
        for (let i = 0; i < imagesToBeRemoved.length; i++) {
          const indexOfImageToBeRemoved = filteredPhotos.findIndex(
            (item) => item === imagesToBeRemoved[i]
          );
          filteredPhotos.splice(indexOfImageToBeRemoved, 1);
        }
        photos = filteredPhotos;
      }
      if (imagesToBeRemoved.length && fileList.length) {
        // Add images to the cloud

        const fetchSignedUrlPromiseArray = addImagesToTheCloud(
          fileList,
          showBoundary
        );

        const values = await Promise.all(fetchSignedUrlPromiseArray);
        for (let value of values) {
          const key = value.key;
          const url = `https://s3.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${key}`;
          newAddedPhotos.push(url);
        }

        // Delete images from the cloud

        const deleteImagesPromiseArray = delteImagesFromTheCloud(
          imagesToBeRemoved,
          showBoundary
        );

        await Promise.all(deleteImagesPromiseArray);

        let filteredPhotos = [...product?.photos!];
        for (let i = 0; i < imagesToBeRemoved.length; i++) {
          const indexOfImageToBeRemoved = filteredPhotos.findIndex(
            (item) => item === imagesToBeRemoved[i]
          );
          filteredPhotos.splice(indexOfImageToBeRemoved, 1);
        }
        photos = filteredPhotos.concat(newAddedPhotos);
      }
      if (!imagesToBeRemoved.length && fileList.length) {
        const fetchSignedUrlPromiseArray = addImagesToTheCloud(
          fileList,
          showBoundary
        );

        const values = await Promise.all(fetchSignedUrlPromiseArray);
        let filteredPhotos = [...product?.photos!];
        for (let value of values) {
          const key = value.key;
          const url = `https://s3.us-east-1.amazonaws.com/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${key}`;
          filteredPhotos.push(url);
        }
        photos = filteredPhotos;
      }

      formDataObject["photos"] = photos;

      for (let pair of formData.entries()) {
        formDataObject[pair[0]] =
          typeof pair[1] === "string" ? pair[1].trim() : pair[1];
      }

      const res = await catchAsyncFetch(
        `/api/editProduct/${product?._id}`,
        showBoundary,
        {
          method: "POST",
          body: JSON.stringify(formDataObject),
        }
      );

      if (!res) {
        return;
      }

      const data = await res.json();

      if (res.ok) {
        router.push(`/products/${product?._id}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      setRequestResponse({ error: error.message });
      setIsVerifying(false);
    }
  };

  return (
    <>
      {reqResponse && reqResponse.error && showToast && (
        <ToastModal
          variant="danger"
          header="Error!"
          body={reqResponse.error}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
      <AddLocationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onData={addressDataFromLocationModalHandler}
      />
      <form
        onSubmit={submitFormHandler}
        ref={formRef}
        className={`wrapper d-flex flex-column align-items-center ${styles.form}`}
      >
        {/*Business Details Section */}
        <div
          className={"d-flex flex-column align-items-start w-100"}
          style={{ gap: 20 }}
        >
          <div
            className={"d-flex flex-column align-items-start w-100"}
            style={{ gap: 20 }}
          >
            {/* Business Name */}
            <div
              className={`${styles.controls} ${styles["svg-control"]} ${
                businessNameInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label className={styles.label} htmlFor="name">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your Business Name"
                ref={businessNameInputRef}
                onChange={businessNameInputChangeHandler}
                value={enteredBusinessName}
                onBlur={businessNameInputBlurHandler}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33301 6H16.6663V8.66667L16.2003 8.94667C15.8377 9.16425 15.4227 9.27919 14.9998 9.27919C14.5769 9.27919 14.162 9.16425 13.7993 8.94667L13.333 8.66667L12.867 8.94667C12.5044 9.16425 12.0894 9.27919 11.6665 9.27919C11.2436 9.27919 10.8286 9.16425 10.466 8.94667L9.99967 8.66667L9.53367 8.94667C9.171 9.16432 8.75598 9.27929 8.33301 9.27929C7.91004 9.27929 7.49502 9.16432 7.13234 8.94667L6.66634 8.66667L6.20001 8.94667C5.83741 9.16419 5.42251 9.27909 4.99967 9.27909C4.57683 9.27909 4.16194 9.16419 3.79934 8.94667L3.33301 8.66667V6Z"
                  stroke="#7A52D3"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66602 9.49601V16.6663H15.3327V9.33301M4.66602 5.94034V3.33301H15.3327V5.99967"
                  stroke="#7A52D3"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.33301 12.666H11.6663V16.666H8.33301V12.666Z"
                  stroke="#7A52D3"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {businessNameInputHasError && (
                <p className={styles["error-text"]}>
                  {businessNameInputErrorText}
                </p>
              )}
            </div>

            {/* Business Category */}
            <div className={`${styles.controls} ${styles.category}`}>
              <label htmlFor="category" className={styles.label}>
                Category
              </label>
              <select
                name="category"
                id="category"
                value={enteredCategory}
                onChange={categorySelectHandler}
              >
                <option value="restaurants">Restaurants</option>
                <option value="henna">Henna</option>
                <option value="roomMates">Roommates</option>
                <option value="homeFood">Home Food</option>
                <option value="clothing">Clothing</option>
                <option value="jewelry">Jewelry</option>
                <option value="salon">Salon</option>
                <option value="grocery">Grocery</option>
              </select>
            </div>

            {/* Business Type */}
            {/* <div className={styles.controls}>
              <label htmlFor="type" className={styles.label}>
                Business Type
              </label>
              <input
                type="text"
                id="type"
                name="type"
                placeholder="Enter your business type"
                onChange={businessTypeInputHandler}
                value={enteredBusinessType}
              />
            </div> */}

            {/* Business Description */}
            <div
              className={`${styles.controls} ${styles["business-desc"]} ${
                businessDescriptionInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label
                className={`d-flex justify-content-between align-items-baseline ${styles.label}`}
                htmlFor="description"
              >
                Business Description{" "}
                <span>{`${businessDescriptionWordCount}/200`}</span>
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter Description"
                rows={2}
                maxLength={200}
                ref={businessDescriptionInputRef}
                value={enteredBusinessDescription}
                onChange={businessDescriptionInputChangeHandler}
                onBlur={businessDescriptionInputBlurHandler}
              ></textarea>
              {businessDescriptionInputHasError && (
                <p className={styles["error-text"]}>
                  {businessDescriptionInputErrorText}
                </p>
              )}
            </div>

            {/* Website Url */}
            <div
              className={`${styles.controls} ${
                businessWebsiteInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label htmlFor="site" className={styles.label}>
                Website Url
              </label>
              <input
                type="url"
                name="site"
                id="site"
                placeholder="Enter Url"
                ref={businessWebsiteInputRef}
                value={enteredBusinessWebsite}
                onChange={businessWebsiteInputChangeHandler}
                onBlur={businessWebsiteInputBlurHandler}
              />
              {businessWebsiteInputHasError && (
                <p className={styles["error-text"]}>
                  {businessWebsiteInputErrorText}
                </p>
              )}
            </div>
          </div>

          {/* Business Contact Deatail */}
          <div
            className="d-flex flex-column"
            style={{ gap: 20, width: "100%" }}
          >
            {/* Business Address */}
            <div
              className={`${styles.controls} ${
                businessAddressInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label htmlFor="address" className={styles.label}>
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter address"
                ref={businessAddressInputRef}
                value={enteredAddress}
                onChange={businessAddressInputChangeHandler}
                onBlur={businessAddressInputBlurHandler}
              />
              {businessAddressInputHasError && (
                <p className={styles["error-text"]}>
                  {businessAddressInputErrorText}
                </p>
              )}
            </div>

            {/* City, State*/}
            <div className="d-flex flex-column flex-sm-row" style={{ gap: 8 }}>
              <div
                className={`${styles.controls} ${
                  cityInputHasError ? styles["invalid"] : ""
                } w-auto flex-grow-1`}
              >
                <label htmlFor="city" className={styles.label}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  ref={cityInputRef}
                  value={enteredCity}
                  onChange={cityInputChangeHandler}
                  onBlur={cityInputBlurHandler}
                />
                {cityInputHasError && (
                  <p className={styles["error-text"]}>{cityInputErrorText}</p>
                )}
              </div>
              {/* <div className={`${styles.controls} w-auto flex-grow-1`}>
                <label htmlFor="state" className={styles.label}>
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State"
                  onChange={stateInputHandler}
                  value={enteredStateReg}
                />
              </div> */}
              <div
                className={`${styles.controls} ${styles.category} w-auto flex-grow-1`}
              >
                <label htmlFor="state" className={styles.label}>
                  State
                </label>
                <select
                  name="state"
                  id="category"
                  value={enteredStateRegSelect}
                  onChange={stateSelectHandler}
                >
                  {us_states.map((item: any) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country, Zip code */}
            <div className="d-flex flex-column flex-sm-row" style={{ gap: 8 }}>
              <div className={`${styles.controls} w-auto flex-grow-1`}>
                <label htmlFor="country" className={styles.label}>
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className={styles["grayed-input"]}
                  readOnly
                  value="United States"
                />
              </div>
              <div
                className={`${styles.controls} ${
                  zipCodeInputHasError ? styles["invalid"] : ""
                } w-auto flex-grow-1`}
              >
                <label htmlFor="zip_code" className={styles.label}>
                  Zip code
                </label>
                <input
                  type="number"
                  name="zip_code"
                  id="zip_code"
                  placeholder="Zip code"
                  ref={zipCodeInputRef}
                  value={enteredZipCode}
                  onChange={zipCodeInputChangeHandler}
                  onBlur={zipCodeInputBlurHandler}
                  onWheel={(e) => zipCodeInputRef.current?.blur()}
                />
                {zipCodeInputHasError && (
                  <p className={styles["error-text"]}>
                    {zipCodeInputErrorText}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="d-flex" style={{ gap: 8 }}>
              <div
                className={`${styles.controls} ${styles["phone-nmbr"]} ${
                  phoneNumberInputHasError ? styles["invalid"] : ""
                }`}
              >
                <label className={styles.label} htmlFor="phone-number">
                  Phone Number
                </label>
                <PatternFormat
                  format="(###) ###-####"
                  getInputRef={phoneNumberInputRef}
                  value={phoneNumberWithoutCode}
                  onValueChange={(values, sourceInfo) => {
                    if (sourceInfo.source === "event") {
                      phoneNumberInputHandler(undefined, values.value);
                    }
                    console.log({ values, sourceInfo });
                  }}
                  onBlur={() => phoneNumberInputBlurHandler()}
                />
                {phoneNumberInputHasError && (
                  <p className={styles["error-text"]}>
                    {phoneNumberInputErrorText}
                  </p>
                )}
                <div className={styles["country-code"]}>
                  <select
                    id="country-code"
                    value={enteredPhoneCode}
                    onChange={phoneNumberInputHandler}
                  >
                    <option value="+1">&#43;1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className={styles.controls}>
            <label
              htmlFor="businessHoursFirstSpanFrom"
              className={styles.label}
            >
              Business Hours
            </label>
            <div
              className="w-100 d-flex flex-column"
              style={{ gap: 8 }}
              onChange={businessDayCheckHandler}
            >
              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="sunday"
                    value="Sunday"
                    defaultChecked={enteredBusinessDays["Sunday"]}
                  />
                  <label htmlFor="sunday" className={styles.label}>
                    Sunday
                  </label>
                </div>

                {enteredBusinessDays.Sunday && (
                  <BusinessHoursInput
                    day={"Sunday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Sunday}
                    businessHoursOfTheDay={enteredBusinessHours["Sunday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Sunday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="monday"
                    value="Monday"
                    defaultChecked={enteredBusinessDays["Monday"]}
                  />
                  <label htmlFor="monday" className={styles.label}>
                    Monday
                  </label>
                </div>

                {enteredBusinessDays.Monday && (
                  <BusinessHoursInput
                    day={"Monday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Monday}
                    businessHoursOfTheDay={enteredBusinessHours["Monday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Monday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="tuesday"
                    value="Tuesday"
                    defaultChecked={enteredBusinessDays["Tuesday"]}
                  />
                  <label htmlFor="tuesday" className={styles.label}>
                    Tuesday
                  </label>
                </div>

                {enteredBusinessDays.Tuesday && (
                  <BusinessHoursInput
                    day={"Tuesday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Tuesday}
                    businessHoursOfTheDay={enteredBusinessHours["Tuesday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Tuesday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="wednesday"
                    value="Wednesday"
                    defaultChecked={enteredBusinessDays["Wednesday"]}
                  />
                  <label htmlFor="wednesday" className={styles.label}>
                    Wednesday
                  </label>
                </div>

                {enteredBusinessDays.Wednesday && (
                  <BusinessHoursInput
                    day={"Wednesday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Wednesday}
                    businessHoursOfTheDay={enteredBusinessHours["Wednesday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Wednesday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="thursday"
                    value="Thursday"
                    defaultChecked={enteredBusinessDays["Thursday"]}
                  />
                  <label htmlFor="thursday" className={styles.label}>
                    Thursday
                  </label>
                </div>

                {enteredBusinessDays.Thursday && (
                  <BusinessHoursInput
                    day={"Thursday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Thursday}
                    businessHoursOfTheDay={enteredBusinessHours["Thursday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Thursday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="friday"
                    value="Friday"
                    defaultChecked={enteredBusinessDays["Friday"]}
                  />
                  <label htmlFor="friday" className={styles.label}>
                    Friday
                  </label>
                </div>

                {enteredBusinessDays.Friday && (
                  <BusinessHoursInput
                    day={"Friday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Friday}
                    businessHoursOfTheDay={enteredBusinessHours["Friday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Friday
                    }
                  />
                )}
              </div>

              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                <div className={styles["input-check-cntnr"]}>
                  <input
                    type="checkbox"
                    id="saturday"
                    value="Saturday"
                    defaultChecked={enteredBusinessDays["Saturday"]}
                  />
                  <label htmlFor="saturday" className={styles.label}>
                    Saturday
                  </label>
                </div>

                {enteredBusinessDays.Saturday && (
                  <BusinessHoursInput
                    day={"Saturday"}
                    onChangeFirstSpanFrom={businessHoursFirstSpanFromHandler}
                    onChangeFirstSpanTo={businessHoursFirstSpanToHandler}
                    onChangeSecondSpanFrom={businessHoursSecondSpanFromHandler}
                    onChangeSecondSpanTo={businessHoursSecondSpanToHandler}
                    onStoreClose={storeCloseHandler}
                    secondSpanReset={secondSpanResetHandler}
                    storeIsClosed={storeIsClosed.Saturday}
                    businessHoursOfTheDay={enteredBusinessHours["Saturday"]}
                    showMoreTimeFieldFromTheForm={
                      showMoreTimeFieldFromTheForm.Saturday
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className={`${styles["images-upload"]}`}>
          <div className={`w-100 ${styles.label}`}>Business Images</div>

          {imageUrls!.length < 1 && (
            <div className={styles["wrpr-cntnr"]}>
              <label htmlFor="business-images">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_435_8267)">
                    <path
                      d="M28.0003 20V24H32.0003V26.6667H28.0003V30.6667H25.3337V26.6667H21.3337V24H25.3337V20H28.0003ZM28.011 4C28.7417 4 29.3337 4.59333 29.3337 5.324V17.3333H26.667V6.66667H5.33366V25.332L18.667 12L22.667 16V19.772L18.667 15.772L9.10299 25.3333H18.667V28H3.98966C3.63874 27.9996 3.30232 27.86 3.05431 27.6117C2.8063 27.3635 2.66699 27.0269 2.66699 26.676V5.324C2.66943 4.97384 2.80953 4.63869 3.05701 4.39096C3.30449 4.14322 3.6395 4.00279 3.98966 4H28.011ZM10.667 9.33333C11.3742 9.33333 12.0525 9.61428 12.5526 10.1144C13.0527 10.6145 13.3337 11.2928 13.3337 12C13.3337 12.7072 13.0527 13.3855 12.5526 13.8856C12.0525 14.3857 11.3742 14.6667 10.667 14.6667C9.95975 14.6667 9.28147 14.3857 8.78137 13.8856C8.28128 13.3855 8.00033 12.7072 8.00033 12C8.00033 11.2928 8.28128 10.6145 8.78137 10.1144C9.28147 9.61428 9.95975 9.33333 10.667 9.33333Z"
                      fill="#9B9AB9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_435_8267">
                      <rect width="32" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Add Image
                <input
                  type="file"
                  id="business-images"
                  accept="image/*"
                  ref={imageUploadInputRef}
                  multiple
                  onChange={uploadFileInputChangeHandler}
                />
              </label>
              <div className={styles.info}>
                <div>
                  Business Images will help customers to
                  <br /> understand your services easily.
                </div>
                <p>{"(Add upto 5 images)"}</p>
              </div>
            </div>
          )}

          {/* Selected Images */}

          {imageUrls!.length > 0 && (
            <div
              className="d-flex w-100 flex-wrap"
              style={{ gap: 12, marginTop: 4, flex: 1 }}
            >
              {imageUrls!.map((imageItem) => (
                <div
                  className={styles["selected-images"]}
                  key={typeof imageItem === "object" ? imageItem.id : imageItem}
                >
                  <Image
                    src={
                      typeof imageItem === "object" ? imageItem.url : imageItem
                    }
                    alt="Selected Images"
                    fill
                  />
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={removeFromSelectedImagesHandler.bind(
                      null,
                      imageItem
                    )}
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="19"
                      height="19"
                      rx="9.49999"
                      fill="white"
                    />
                    <path
                      d="M6.66634 14.1663L5.83301 13.333L9.16634 9.99967L5.83301 6.66634L6.66634 5.83301L9.99967 9.16634L13.333 5.83301L14.1663 6.66634L10.833 9.99967L14.1663 13.333L13.333 14.1663L9.99967 10.833L6.66634 14.1663Z"
                      fill="#1C1E36"
                    />
                    <rect
                      x="0.5"
                      y="0.5"
                      width="19"
                      height="19"
                      rx="9.49999"
                      stroke="#EBEAFF"
                    />
                  </svg>
                </div>
              ))}
              {imageUrls!.length > 0 && imageUrls!.length < 5 && (
                <div className={styles["add-images-sec-with-selected-images"]}>
                  <label htmlFor="business-images">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_435_8267)">
                        <path
                          d="M28.0003 20V24H32.0003V26.6667H28.0003V30.6667H25.3337V26.6667H21.3337V24H25.3337V20H28.0003ZM28.011 4C28.7417 4 29.3337 4.59333 29.3337 5.324V17.3333H26.667V6.66667H5.33366V25.332L18.667 12L22.667 16V19.772L18.667 15.772L9.10299 25.3333H18.667V28H3.98966C3.63874 27.9996 3.30232 27.86 3.05431 27.6117C2.8063 27.3635 2.66699 27.0269 2.66699 26.676V5.324C2.66943 4.97384 2.80953 4.63869 3.05701 4.39096C3.30449 4.14322 3.6395 4.00279 3.98966 4H28.011ZM10.667 9.33333C11.3742 9.33333 12.0525 9.61428 12.5526 10.1144C13.0527 10.6145 13.3337 11.2928 13.3337 12C13.3337 12.7072 13.0527 13.3855 12.5526 13.8856C12.0525 14.3857 11.3742 14.6667 10.667 14.6667C9.95975 14.6667 9.28147 14.3857 8.78137 13.8856C8.28128 13.3855 8.00033 12.7072 8.00033 12C8.00033 11.2928 8.28128 10.6145 8.78137 10.1144C9.28147 9.61428 9.95975 9.33333 10.667 9.33333Z"
                          fill="#9B9AB9"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_435_8267">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Add Image
                    <input
                      type="file"
                      id="business-images"
                      accept="image/*"
                      ref={imageUploadInputRef}
                      multiple
                      onChange={uploadFileInputChangeHandler}
                    />
                  </label>
                  <div className={styles.info}>
                    <div>
                      Business Images will help customers to
                      <br /> understand your services easily.
                    </div>
                    <p>{"(Add upto 5 images)"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className={`${styles["location-cntnr"]}`}>
          <div className={`w-100 ${styles.label}`}>Location</div>
          <div
            className={styles.location}
            style={{
              backgroundColor: `${
                addressDataFromLocationModal?.location.lat
                  ? "unset"
                  : "var(--light-blue-shade)"
              }`,
            }}
          >
            {addressDataFromLocationModal?.location.lat && (
              <>
                <MapInProfileForm
                  location={addressDataFromLocationModal.location}
                  addressCardRects={addressCardElementRects}
                  isLoading={isLoading}
                />
                <div
                  className={styles["address-card"]}
                  ref={addressCardElementRef}
                >
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
                  <div className={styles.address}>
                    {addressDataFromLocationModal.fullAddress
                      ? addressDataFromLocationModal.fullAddress
                      : `${product?.full_address}${", USA"}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalShow(true)}
                    className={styles["edit-location-btn"]}
                  >
                    EDIT
                  </button>
                </div>
              </>
            )}
            {!addressDataFromLocationModal && (
              <button
                type="button"
                onClick={() => setModalShow(true)}
                className={styles["add-location-btn"]}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.9327 27.2006C12.1549 25.0451 10.0829 22.9451 8.71668 20.9007C7.34957 18.8562 6.66602 16.8451 6.66602 14.8673C6.66602 13.2895 6.94957 11.906 7.51668 10.7167C8.0829 9.52821 8.81046 8.53398 9.69935 7.73398C10.5882 6.93398 11.5882 6.33398 12.6993 5.93398C13.8105 5.53398 14.9105 5.33398 15.9993 5.33398C17.0882 5.33398 18.1882 5.53398 19.2993 5.93398C20.4105 6.33398 21.4105 6.93398 22.2993 7.73398C23.1882 8.53398 23.9162 9.52821 24.4833 10.7167C25.0496 11.906 25.3327 13.2895 25.3327 14.8673C25.3327 16.8451 24.6491 18.8562 23.282 20.9007C21.9158 22.9451 19.8438 25.0451 17.066 27.2006L15.9993 28.0007L14.9327 27.2006ZM17.8833 16.55C17.3607 17.0726 16.7327 17.334 15.9993 17.334C15.266 17.334 14.6385 17.0726 14.1167 16.55C13.594 16.0282 13.3327 15.4007 13.3327 14.6673C13.3327 13.934 13.594 13.306 14.1167 12.7833C14.6385 12.2615 15.266 12.0007 15.9993 12.0007C16.7327 12.0007 17.3607 12.2615 17.8833 12.7833C18.4051 13.306 18.666 13.934 18.666 14.6673C18.666 15.4007 18.4051 16.0282 17.8833 16.55Z"
                    fill="#9B9AB9"
                  />
                </svg>
                Add Location
              </button>
            )}
          </div>
        </div>

        {/* Verify Button Section */}
        <div
          className={`${styles["verify-button"]} ${
            isVerifying ? styles["verifying"] : ""
          }`}
        >
          <button
            type="button"
            onMouseDown={(e) => {
              if (e.button === 0) {
                submitFormHandler();
              }
            }}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying" : "Verify"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditForm;
