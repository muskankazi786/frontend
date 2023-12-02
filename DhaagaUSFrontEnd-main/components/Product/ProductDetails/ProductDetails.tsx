import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "../../../styles/ProductDetails.module.css";

import { BusinessHoursObject } from "@/Models/BusinessHoursObject";
import { BusinessDay, ListData } from "@/Models/ListData";

import ReviewsCountBadge from "@/components/Reviews/ReviewsCountBadge";
import { changeTimeToTwelveHourFormat } from "@/utils/changeTimeToTwelveHourFormat";

const daysInWeek: any = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const ProductDetails = (props: {
  product: ListData;
  isProductFavorite: boolean;
  AddOrRemoveAsFavProductHandler: (identifier: string) => void;
  setBusinessHoursModalShow: (show: boolean) => void;
}) => {
  const {
    product,
    isProductFavorite,
    AddOrRemoveAsFavProductHandler,
    setBusinessHoursModalShow,
  } = props;

  const [timingsOfToday, setTimingsOfToday] = useState("");

  const { business_hours } = product;
  useEffect(() => {
    let timingsOfToday = "";

    if (business_hours) {
      const date = new Date();
      const dayIndex = date.getDay();
      const isDayToday = daysInWeek[dayIndex];

      if (isDayToday) {
        if (
          business_hours[isDayToday][2] &&
          business_hours[isDayToday][2].closed
        ) {
          timingsOfToday = business_hours[isDayToday][2].closed!;
        } else if (
          business_hours[isDayToday][2] &&
          business_hours[isDayToday][2].open
        ) {
          timingsOfToday = business_hours[isDayToday][2].open!;
        } else if (
          business_hours[isDayToday].length === 2 &&
          business_hours[isDayToday][0].open &&
          business_hours[isDayToday][0].close &&
          business_hours[isDayToday][1].open &&
          business_hours[isDayToday][1].close
        ) {
          timingsOfToday = `${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][0] as BusinessDay).open
          )}-${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][0] as BusinessDay).close
          )} \u00A0${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][1] as BusinessDay).open
          )}-${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][1] as BusinessDay).close
          )}`;
        } else if (
          business_hours[isDayToday].length === 2 &&
          business_hours[isDayToday][0].open &&
          business_hours[isDayToday][0].close &&
          !business_hours[isDayToday][1].open &&
          !business_hours[isDayToday][1].close
        ) {
          timingsOfToday = `${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][0] as BusinessDay).open
          )}-${changeTimeToTwelveHourFormat(
            (business_hours[isDayToday][0] as BusinessDay).close
          )}`;
        }
        setTimingsOfToday(timingsOfToday);
      }
    }
  }, [business_hours]);

  const isBusinessHours = (businessHours: BusinessHoursObject) => {
    const businessHoursObjectKeys = Object.keys(businessHours);
    const isBusinessHours = businessHoursObjectKeys.some(
      (key) =>
        businessHours[key][0].open !== "" && businessHours[key][0].close !== ""
    );
    return isBusinessHours;
  };

  return (
    <div className={`wrapper d-flex flex-column ${styles.details}`}>
      <ReviewsCountBadge
        avgRating={product.avgRating}
        totalReviews={product.reviewCount}
      />
      <div
        className={`${styles["business-desc"]} d-flex flex-column align-items-start`}
      >
        <div
          className={`${styles["business-name"]} d-flex justify-content-between align-items-center w-100`}
        >
          <h1>{product.name}</h1>
          {!isProductFavorite && (
            <div>
              <button
                className={`${styles["icon-button"]} position-relative`}
                onClick={AddOrRemoveAsFavProductHandler.bind(null, "fav")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5132 17.7195L11.5117 17.7182C9.43208 15.8323 7.78656 14.3355 6.64926 12.9441C5.52296 11.5661 5 10.4142 5 9.23495C5 7.31644 6.48709 5.83496 8.4 5.83496C9.4897 5.83496 10.5521 6.34742 11.2412 7.15024L12 8.03439L12.7588 7.15024C13.4479 6.34742 14.5103 5.83496 15.6 5.83496C17.5129 5.83496 19 7.31644 19 9.23495C19 10.4142 18.477 11.5661 17.3507 12.9441C16.2134 14.3355 14.5679 15.8323 12.4883 17.7182L12.4868 17.7195L12 18.1626L11.5132 17.7195Z"
                    stroke="#562EC4"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          )}
          {isProductFavorite && (
            <button
              className={`${styles["icon-button"]} position-relative`}
              onClick={AddOrRemoveAsFavProductHandler.bind(null, "unfav")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 19.5149L10.84 18.4589C6.72 14.7229 4 12.251 4 9.23495C4 6.76296 5.936 4.83496 8.4 4.83496C9.792 4.83496 11.128 5.48296 12 6.49896C12.872 5.48296 14.208 4.83496 15.6 4.83496C18.064 4.83496 20 6.76296 20 9.23495C20 12.251 17.28 14.7229 13.16 18.4589L12 19.5149Z"
                  fill="#562EC4"
                />
              </svg>
            </button>
          )}
        </div>
        <div className={styles["business-desc-text"]}>
          {product.type
            ? product.type
            : "Lorem ipsum dolor sit amet consectetur adipisicing elit."}
        </div>
      </div>
      <div
        className={`d-flex flex-column align-items-start ${styles["reach-info"]}`}
      >
        <div>
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_425_4970)">
                <path
                  d="M1.3335 4H14.6668V6.66667L14.2008 6.94667C13.8382 7.16425 13.4232 7.27919 13.0003 7.27919C12.5774 7.27919 12.1625 7.16425 11.7998 6.94667L11.3335 6.66667L10.8675 6.94667C10.5049 7.16425 10.0899 7.27919 9.667 7.27919C9.24409 7.27919 8.82913 7.16425 8.4665 6.94667L8.00016 6.66667L7.53416 6.94667C7.17149 7.16432 6.75647 7.27929 6.3335 7.27929C5.91052 7.27929 5.49551 7.16432 5.13283 6.94667L4.66683 6.66667L4.2005 6.94667C3.8379 7.16419 3.423 7.27909 3.00016 7.27909C2.57732 7.27909 2.16243 7.16419 1.79983 6.94667L1.3335 6.66667V4Z"
                  stroke="#9B9AB9"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66699 7.49601V14.6663H13.3337V7.33301M2.66699 3.94034V1.33301H13.3337V3.99967"
                  stroke="#9B9AB9"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.3335 10.666H9.66683V14.666H6.3335V10.666Z"
                  stroke="#9B9AB9"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_425_4970">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <div className={styles["reach-heading"]}>Address</div>
          </div>
          <div className="d-flex" style={{ gap: 8 }}>
            <div
              className={`${styles["reach-heading"]} ${styles["reach-text-colon"]}`}
            >
              :
            </div>
            <div className={styles["reach-text"]}>{product.full_address}</div>
          </div>
        </div>
        <div className="w-100">
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.70016 11.033L7.3335 8.66634V5.33301H8.66683V8.11634L10.6335 10.083L9.70016 11.033ZM7.3335 3.99967V2.66634H8.66683V3.99967H7.3335ZM12.0002 8.66634V7.33301H13.3335V8.66634H12.0002ZM7.3335 13.333V11.9997H8.66683V13.333H7.3335ZM2.66683 8.66634V7.33301H4.00016V8.66634H2.66683ZM8.00016 14.6663C7.07794 14.6663 6.21127 14.4912 5.40016 14.141C4.58905 13.7912 3.8835 13.3163 3.2835 12.7163C2.6835 12.1163 2.20861 11.4108 1.85883 10.5997C1.50861 9.78856 1.3335 8.9219 1.3335 7.99967C1.3335 7.07745 1.50861 6.21079 1.85883 5.39967C2.20861 4.58856 2.6835 3.88301 3.2835 3.28301C3.8835 2.68301 4.58905 2.2079 5.40016 1.85767C6.21127 1.5079 7.07794 1.33301 8.00016 1.33301C8.92238 1.33301 9.78905 1.5079 10.6002 1.85767C11.4113 2.2079 12.1168 2.68301 12.7168 3.28301C13.3168 3.88301 13.7917 4.58856 14.1415 5.39967C14.4917 6.21079 14.6668 7.07745 14.6668 7.99967C14.6668 8.9219 14.4917 9.78856 14.1415 10.5997C13.7917 11.4108 13.3168 12.1163 12.7168 12.7163C12.1168 13.3163 11.4113 13.7912 10.6002 14.141C9.78905 14.4912 8.92238 14.6663 8.00016 14.6663ZM8.00016 13.333C9.48905 13.333 10.7502 12.8163 11.7835 11.783C12.8168 10.7497 13.3335 9.48856 13.3335 7.99967C13.3335 6.51079 12.8168 5.24967 11.7835 4.21634C10.7502 3.18301 9.48905 2.66634 8.00016 2.66634C6.51127 2.66634 5.25016 3.18301 4.21683 4.21634C3.1835 5.24967 2.66683 6.51079 2.66683 7.99967C2.66683 9.48856 3.1835 10.7497 4.21683 11.783C5.25016 12.8163 6.51127 13.333 8.00016 13.333Z"
                fill="#9B9AB9"
              />
            </svg>
            <div className={styles["reach-heading"]}>Hours</div>
          </div>
          <div className="d-flex" style={{ gap: 8 }}>
            <div
              className={`${styles["reach-heading"]} ${styles["reach-text-colon"]}`}
            >
              :
            </div>
            {isBusinessHours(business_hours) ? (
              <div
                className="d-flex align-items-center flex-wrap"
                style={{ gap: 4 }}
              >
                <div className={styles["reach-text"]}>{timingsOfToday}</div>
                <div
                  className={`${styles["reach-text-link"]}`}
                  onClick={() => setBusinessHoursModalShow(true)}
                >
                  view all
                </div>
              </div>
            ) : (
              <div
                className="offset-2"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#9b9ab9",
                }}
              >
                Not available
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.3335 7.99967C1.3335 4.31967 4.3135 1.33301 7.9935 1.33301C11.6802 1.33301 14.6668 4.31967 14.6668 7.99967C14.6668 11.6797 11.6802 14.6663 7.9935 14.6663C4.3135 14.6663 1.3335 11.6797 1.3335 7.99967ZM10.6468 5.33301H12.6135C11.9735 4.23301 10.9535 3.37967 9.72683 2.95967C10.1268 3.69967 10.4335 4.49967 10.6468 5.33301ZM8.00016 2.69301C8.5535 3.49301 8.98683 4.37967 9.2735 5.33301H6.72683C7.0135 4.37967 7.44683 3.49301 8.00016 2.69301ZM2.66683 7.99967C2.66683 8.45967 2.7335 8.90634 2.84016 9.33301H5.0935C5.04016 8.89301 5.00016 8.45301 5.00016 7.99967C5.00016 7.54634 5.04016 7.10634 5.0935 6.66634H2.84016C2.7335 7.09301 2.66683 7.53967 2.66683 7.99967ZM3.38683 10.6663H5.3535C5.56683 11.4997 5.8735 12.2997 6.2735 13.0397C5.04683 12.6197 4.02683 11.773 3.38683 10.6663ZM3.38683 5.33301H5.3535C5.56683 4.49967 5.8735 3.69967 6.2735 2.95967C5.04683 3.37967 4.02683 4.22634 3.38683 5.33301ZM8.00016 13.3063C7.44683 12.5063 7.0135 11.6197 6.72683 10.6663H9.2735C8.98683 11.6197 8.5535 12.5063 8.00016 13.3063ZM6.3335 7.99967C6.3335 8.45301 6.38016 8.89301 6.44016 9.33301H9.56016C9.62016 8.89301 9.66683 8.45301 9.66683 7.99967C9.66683 7.54634 9.62016 7.09967 9.56016 6.66634H6.44016C6.38016 7.09967 6.3335 7.54634 6.3335 7.99967ZM9.72683 13.0397C10.1268 12.2997 10.4335 11.4997 10.6468 10.6663H12.6135C11.9735 11.7663 10.9535 12.6197 9.72683 13.0397ZM11.0002 7.99967C11.0002 8.45301 10.9602 8.89301 10.9068 9.33301H13.1602C13.2668 8.90634 13.3335 8.45967 13.3335 7.99967C13.3335 7.53967 13.2668 7.09301 13.1602 6.66634H10.9068C10.9602 7.10634 11.0002 7.54634 11.0002 7.99967Z"
                fill="#9B9AB9"
              />
            </svg>
            <div className={styles["reach-heading"]}>Website</div>
          </div>
          <div className="d-flex" style={{ gap: 8 }}>
            <div
              className={`${styles["reach-heading"]} ${styles["reach-text-colon"]}`}
            >
              :
            </div>
            {product.site === "N/A" ||
            product.site === "NA" ||
            product.site === "" ? (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "var(--gray-shade-2)",
                }}
              >
                N/A
              </div>
            ) : (
              <Link href="" className={`${styles["reach-text-link"]}`}>
                {product.site}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex w-100" style={{ gap: 16 }}>
        <a
          href={`tel:${product.phone}`}
          className={`${styles["btn-links"]} d-flex justify-content-between align-items-center`}
          style={{
            border: 0,
            flexGrow: 1,
            borderRadius: 12,
            padding: "12px 16px",
            backgroundColor: "#f3f2ff",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--black)",
          }}
        >
          Call us
          <span className={styles["btn-icon"]}>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.125 17.5C15.3333 17.5 13.5869 17.1006 11.8858 16.3017C10.1842 15.5033 8.67722 14.4478 7.365 13.135C6.05222 11.8228 4.99667 10.3158 4.19833 8.61417C3.39944 6.91306 3 5.16667 3 3.375C3 3.125 3.08333 2.91667 3.25 2.75C3.41667 2.58333 3.625 2.5 3.875 2.5H7.25C7.44444 2.5 7.61806 2.5625 7.77083 2.6875C7.92361 2.8125 8.01389 2.97222 8.04167 3.16667L8.58333 6.08333C8.61111 6.27778 8.60778 6.45472 8.57333 6.61417C8.53833 6.77417 8.45833 6.91667 8.33333 7.04167L6.33333 9.08333C6.91667 10.0833 7.64583 11.0208 8.52083 11.8958C9.39583 12.7708 10.3611 13.5278 11.4167 14.1667L13.375 12.2083C13.5 12.0833 13.6633 11.9894 13.865 11.9267C14.0661 11.8644 14.2639 11.8472 14.4583 11.875L17.3333 12.4583C17.5278 12.5 17.6875 12.5936 17.8125 12.7392C17.9375 12.8853 18 13.0556 18 13.25V16.625C18 16.875 17.9167 17.0833 17.75 17.25C17.5833 17.4167 17.375 17.5 17.125 17.5Z"
                fill="#562EC4"
              />
            </svg>
          </span>
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            product.full_address
          )}`}
          target="_blank"
          className={`${styles["btn-links"]} d-flex justify-content-between align-items-center`}
          style={{
            border: 0,
            flexGrow: 1,
            borderRadius: 12,
            padding: "12px 16px",
            backgroundColor: "#f3f2ff",
            fontSize: 14,
            fontWeight: 500,
            color: "#1c1e36",
          }}
        >
          Directions
          <span className={styles["btn-icon"]}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_425_5001)">
                <path
                  d="M6 13H8V10H11.5V12.5L15 9L11.5 5.5V8H7C6.71667 8 6.47933 8.09567 6.288 8.287C6.096 8.479 6 8.71667 6 9V13ZM10 20C9.75 20 9.504 19.95 9.262 19.85C9.02067 19.75 8.8 19.6 8.6 19.4L0.6 11.4C0.4 11.2 0.25 10.9793 0.15 10.738C0.0500001 10.496 0 10.25 0 10C0 9.75 0.0500001 9.504 0.15 9.262C0.25 9.02067 0.4 8.8 0.6 8.6L8.6 0.6C8.8 0.4 9.02067 0.25 9.262 0.15C9.504 0.0500001 9.75 0 10 0C10.25 0 10.496 0.0500001 10.738 0.15C10.9793 0.25 11.2 0.4 11.4 0.6L19.4 8.6C19.6 8.8 19.75 9.02067 19.85 9.262C19.95 9.504 20 9.75 20 10C20 10.25 19.95 10.496 19.85 10.738C19.75 10.9793 19.6 11.2 19.4 11.4L11.4 19.4C11.2 19.6 10.9793 19.75 10.738 19.85C10.496 19.95 10.25 20 10 20V20Z"
                  fill="#6033CA"
                />
              </g>
              <defs>
                <clipPath id="clip0_425_5001">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
