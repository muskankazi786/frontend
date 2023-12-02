import {
  ChangeEvent,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";

import styles from "../../styles/HomePage.module.css";

import HomeMap from "@/components/Maps/HomeMap";
import Layout from "@/components/Layout/Layout";
import Results from "@/components/Results/Results";
import Search from "@/components/Search/Search";
import Categories from "@/components/Categories/Categories";
import ToastModal from "@/components/ToastModal/ToastModal";
import SearchPlaceInput from "@/components/SearchPlaceInput/SearchPlaceInput";
import ErrorModal from "../ModalOverlay/ErrorModal";
import { ListData } from "@/Models/ListData";
import { CategoriesObject } from "@/Models/CategoriesObject";
import { countMilesToIncreaseRadiusByZoomingInAndOutMap } from "@/utils/countMilesToIncreaseRadiusByZoomingInAndOutMap";
import { ProductDistanceContext } from "@/context/product-distance-context";

const categoriesInitialState: CategoriesObject[] = [
  {
    category: "Restaurants",
    query: "restaurants",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.16675 25.6668V14.9918C7.17508 14.7196 6.34403 14.1752 5.67358 13.3585C5.00236 12.5418 4.66675 11.5891 4.66675 10.5002V2.3335H7.00008V10.5002H8.16675V2.3335H10.5001V10.5002H11.6667V2.3335H14.0001V10.5002C14.0001 11.5891 13.6645 12.5418 12.9932 13.3585C12.3228 14.1752 11.4917 14.7196 10.5001 14.9918V25.6668H8.16675Z"
          fill="#6033CA"
        />
        <path
          d="M19.8333 16.3335V25.6668H22.1666V2.3335C20.5527 2.3335 19.1772 2.90244 18.0401 4.04033C16.9022 5.17744 16.3333 6.55294 16.3333 8.16683V16.3335H19.8333Z"
          fill="#FFB914"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Henna",
    query: "henna",
    svg: (
      <svg
        width="28"
        height="30"
        viewBox="0 0 28 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.97119 25.7791C11.9574 25.4847 13.787 24.5886 15.227 23.2312C16.7588 24.6753 18.7315 25.5972 20.8649 25.8281"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.27039 23.8203L9.65048 23.6157C11.1876 23.3878 12.597 22.7046 13.7265 21.6399L15.227 20.2254L16.7276 21.6399C17.918 22.7622 19.471 23.4774 21.1003 23.6538L21.975 23.7485"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.8384 27.2773C17.8297 27.2747 17.821 27.272 17.8123 27.2693"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.2499 26.041C15.2422 26.0359 15.2347 26.0308 15.2271 26.0256C15.2195 26.0308 15.2119 26.0359 15.2043 26.041"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6417 27.2693C12.633 27.272 12.6244 27.2747 12.6156 27.2773"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.3484 12.3711H13.2526"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.3484 9.83398H13.2526"
          stroke="#562EC4"
          strokeWidth="1.09375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.99023 19.5781L7.55681 19.2218"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.42786 17.1055L6.99443 16.7492"
          stroke="#562EC4"
          strokeWidth="1.09375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.438 12.3711H16.5338"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.9042 13.5352H20"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.438 9.83594H16.5338"
          stroke="#562EC4"
          strokeWidth="1.09375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.9042 11H20"
          stroke="#562EC4"
          strokeWidth="1.09375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.448 8.43359H16.3522"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.448 5.89844H16.3522"
          stroke="#562EC4"
          strokeWidth="1.09375"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.2085 22.6495C18.496 22.2871 18.6678 21.8287 18.6678 21.3301H18.6668C18.6473 20.2126 18.0935 19.2668 17.0268 18.663C15.7624 17.9472 15.227 17.1339 15.227 17.1339C15.227 17.1339 14.6918 17.9472 13.4274 18.663C12.3607 19.2668 11.8068 20.2126 11.7873 21.3301H11.7864C11.7864 21.8435 11.9685 22.3144 12.2716 22.6816"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.1085 22.6187C11.6829 21.2291 10.4414 20.3772 9.33555 20.7159C8.30584 21.0313 7.75689 22.2679 8.02984 23.5586"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.3267 22.6816C18.3327 22.6601 18.3391 22.6387 18.3457 22.6173C18.7713 21.2277 20.0128 20.3757 21.1186 20.7145C21.9258 20.9617 22.4375 21.7748 22.4896 22.7363"
          stroke="#FFB914"
          strokeWidth="1.2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.5337 14.5898V5.9543C16.5337 5.04819 17.2683 4.31368 18.1743 4.31368C19.0804 4.31368 19.8149 5.04819 19.8149 5.9543V14.5898"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.0962 9.95469V7.89429C23.0962 6.98817 22.3617 6.25366 21.4556 6.25366C20.5495 6.25366 19.8149 6.98817 19.8149 7.89429V14.5898"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.8651 28.4512V25.7469C22.3098 23.9325 23.0964 21.6817 23.0964 19.3623V9.99902"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.97138 28.4512V25.7469L8.03659 23.6042C6.8887 22.3331 6.10159 20.7781 5.75684 19.1004L4.93625 15.1074C4.77979 14.3464 5.18672 13.5817 5.90515 13.2863C6.69856 12.9601 7.60861 13.3101 7.97879 14.0839L9.97138 18.2482V5.95409C9.97138 5.04803 10.7059 4.31347 11.612 4.31347C12.5181 4.31347 13.2526 5.04803 13.2526 5.95409V14.5896"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.2524 11.2607V3.18575C13.2524 2.27963 13.987 1.54512 14.8931 1.54512C15.7992 1.54512 16.5337 2.27963 16.5337 3.18575V14.5898"
          stroke="#6033CA"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Roommates",
    query: "roomMates",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 23.334C17.5 20.7557 14.3663 18.6673 10.5 18.6673C6.63367 18.6673 3.5 20.7557 3.5 23.334M10.5 15.1673C9.26232 15.1673 8.07534 14.6757 7.20017 13.8005C6.325 12.9253 5.83333 11.7383 5.83333 10.5007C5.83333 9.26297 6.325 8.07599 7.20017 7.20082C8.07534 6.32565 9.26232 5.83398 10.5 5.83398C11.7377 5.83398 12.9247 6.32565 13.7998 7.20082C14.675 8.07599 15.1667 9.26297 15.1667 10.5007C15.1667 11.7383 14.675 12.9253 13.7998 13.8005C12.9247 14.6757 11.7377 15.1673 10.5 15.1673Z"
          stroke="#6033CA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.5 23.332C24.5 21.2997 22.5517 19.5719 19.8333 18.9302M17.5 15.1654C18.7377 15.1654 19.9247 14.6737 20.7998 13.7985C21.675 12.9234 22.1667 11.7364 22.1667 10.4987C22.1667 9.26102 21.675 8.07404 20.7998 7.19887C19.9247 6.3237 18.7377 5.83203 17.5 5.83203"
          stroke="#FFB914"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Home Food",
    query: "homeFood",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_802_3077)">
          <mask
            id="mask0_802_3077"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="-1"
            width="28"
            height="29"
          >
            <path d="M0 -0.00196075H28V27.998H0V-0.00196075Z" fill="white" />
          </mask>
          <g mask="url(#mask0_802_3077)">
            <path
              d="M20.6173 27.1777H7.38293C5.57075 27.1777 4.10168 25.7087 4.10168 23.8965V12.3027H23.8986V23.8965C23.8986 25.7087 22.4295 27.1777 20.6173 27.1777Z"
              stroke="#6033CA"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.10156 17.2246C2.28938 17.2246 0.820312 15.7555 0.820312 13.9434C0.820312 13.0373 1.55487 12.3027 2.46094 12.3027H4.10156"
              stroke="#6033CA"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.8986 17.2246C25.7107 17.2246 27.1798 15.7555 27.1798 13.9434C27.1798 13.0373 26.4452 12.3027 25.5392 12.3027H23.8986"
              stroke="#6033CA"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.8626 5.93555L10.5196 5.19043C9.95119 3.9558 10.4913 2.49423 11.7259 1.92586C12.9605 1.35755 14.4221 1.89764 14.9904 3.13221L15.3334 3.87738"
              stroke="#6033CA"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.15613 9.02148L22.0397 0.818357"
              stroke="#FFB914"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.9218 4.38108C21.9218 4.38108 20.7617 4.38108 20.1816 4.96116C19.6015 5.54117 19.6015 6.70126 19.6015 6.70126C19.6015 6.70126 19.6015 7.8614 19.0215 8.44141C18.4415 9.02148 17.2814 9.02148 17.2814 9.02148"
              stroke="#FFB914"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26.8436 4.38108C26.8436 4.38108 25.6836 4.38108 25.1035 4.96116C24.5234 5.54117 24.5234 6.70126 24.5234 6.70126C24.5234 6.70126 24.5234 7.8614 23.9434 8.44141C23.3633 9.02148 22.2032 9.02148 22.2032 9.02148"
              stroke="#FFB914"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_802_3077">
            <rect width="28" height="28" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Clothing",
    query: "clothing",
    svg: (
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0521 10.0093L10.9715 10.0832C6.84124 13.8693 4.48962 19.2151 4.48962 24.8182C5.87415 25.2796 7.28394 25.635 8.70658 25.8965"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.9602 25.8965C21.3829 25.635 22.7926 25.2797 24.1771 24.8182C24.1771 19.2151 21.8255 13.8693 17.6952 10.0832L17.6146 10.0093"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.4115 4.77344V1.15044"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.2552 4.77344V1.15044"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8967 10.0098C10.5902 15.0766 9.16771 20.5006 8.69051 26.0472L8.59125 27.2012C12.4007 27.6126 16.2661 27.6126 20.0756 27.2012L19.9763 26.0472C19.4991 20.5006 18.0766 15.0766 15.7701 10.0098H15.7701"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9256 3.95558L14.3334 5.32026L12.7413 3.95558C11.6443 3.01534 9.9481 3.43195 9.41156 4.77338L11.0522 10.0098H17.6147L19.2553 4.77338C18.7187 3.43195 17.0225 3.01534 15.9256 3.95558Z"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Jewelry",
    query: "jewelry",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.6667 10.6654L20.6667 5.33203H7.34537L3.33337 10.6654"
          stroke="#FFB914"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.34534 5.33398L10 10.6673L14 5.33398L18 10.6673L20.6667 5.33398"
          stroke="#FFB914"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 24.0013L24.6666 10.668H3.33331L14 24.0013ZM14 24.0013L9.99998 10.668M14 24.0013L18 10.668"
          stroke="#6033CA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Salon",
    query: "salon",
    svg: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.1273 22.0338C11.2427 21.8555 11.2975 21.6448 11.2837 21.4329C11.125 19.7961 9.78333 18.5186 8.15 18.5186C6.4105 18.5186 5 19.9699 5 21.7596C5 23.5493 6.4105 24.9994 8.15 24.9994C9.7915 24.9994 10.2057 23.5574 11.1273 22.0349V22.0338ZM11.1273 22.0338L13.5 17.4995M20.75 14.1984L22.0415 12.8708C24.2955 10.5526 24.4938 6.86127 22.5023 4.3016C22.425 4.20066 22.3238 4.12045 22.2079 4.06814C22.092 4.01584 21.9649 3.99306 21.838 4.00184C21.7111 4.01062 21.5884 4.05069 21.4808 4.11847C21.3732 4.18625 21.2841 4.27963 21.2213 4.39027L15.5 14.1984"
          stroke="#FFB914"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.3727 21.5355C19.2944 23.058 19.7086 24.5 21.3501 24.5C23.0896 24.5 24.5001 23.0498 24.5001 21.2602C24.5001 19.4705 23.0896 18.0192 21.3501 18.0192C19.7167 18.0192 18.3751 19.2967 18.2152 20.9335C18.1954 21.1458 18.2619 21.3535 18.3727 21.5343M18.3727 21.5355V21.5343M18.3727 21.5355L8.27525 3.90367C8.21338 3.79195 8.12465 3.69741 8.01708 3.62857C7.90952 3.55974 7.7865 3.51878 7.65913 3.5094C7.53177 3.50002 7.40408 3.52252 7.28759 3.57485C7.1711 3.62719 7.06948 3.70772 6.99191 3.80917C5.00391 6.36417 5.20225 10.0508 7.45275 12.3643L18.3727 21.5343"
          stroke="#7A52D3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
  {
    category: "Grocery",
    query: "grocery",
    svg: (
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8461 6.62301C13.8084 6.44555 13.7866 6.26213 13.7866 6.07313C13.7866 4.56299 15.0107 3.33876 16.5209 3.33876C16.7258 3.33876 16.9239 3.36522 17.1159 3.40799C17.3427 2.1265 18.4557 1.15125 19.8022 1.15125C21.2097 1.15125 22.3553 2.21875 22.5063 3.586C22.85 3.43036 23.2285 3.33876 23.6303 3.33876C25.1404 3.33876 26.3647 4.56299 26.3647 6.07313C26.3647 7.42096 25.3875 8.53451 24.1043 8.75976C24.8082 9.25447 25.2709 10.0694 25.2709 10.995C25.2709 11.5429 25.106 12.0507 24.8285 12.4785"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.349 6.07278C20.349 6.07278 20.0888 9.13315 18.0102 12.1191"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.79278 6.79974L6.1308 7.01953"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.4334 9.64148L7.77142 9.86133"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.7434 14.2129C17.6142 13.4142 18.1615 12.2691 18.1615 10.9939C18.1615 8.57762 16.2027 6.61887 13.7865 6.61887C12.4917 6.61887 11.3319 7.18456 10.5309 8.07848"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.0707 14.2637C14.019 14.1423 13.962 14.0222 13.8943 13.9051L8.4256 4.43299C7.51953 2.86362 5.51278 2.32593 3.94335 3.23194H3.9433C2.37393 4.13811 1.83625 6.14487 2.74236 7.71424L5.63965 12.7325"
          stroke="#FFB914"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.349 22.8613H9.4115V18.4863H20.349V22.8613Z"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.8177 12.0879C23.6182 13.0044 19.7891 14.2754 14.8802 14.2754C12.4973 14.2754 8.47394 13.9759 3.94275 12.0879C4.43734 16.7042 4.93194 21.4101 5.42658 26.0435C5.51562 26.8775 6.21923 27.5098 7.05791 27.5098H22.7018C23.5407 27.5098 24.2444 26.8769 24.3332 26.0427L25.8177 12.0879Z"
          stroke="#6033CA"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    isActive: false,
  },
];

// const categoryIsActiveBySearchInitialState = {
//   restaurants: false,
//   henna: false,
//   roomMates: false,
//   homeFood: false,
//   clothing: false,
//   jewelry: false,
//   salon: false,
//   grocery: false,
// };

const Home = (props: { products: ListData[] }) => {
  const { products } = props;
  const [showForFetchUser, setShowForFetchUser] = useState(false);
  const [subscriptionPaymentError, setSubscriptionPaymentError] = useState<{
    last_payment_error: string;
  } | null>(null);
  const [fetchRejectError, setFetchRejectError] = useState(false);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [categories, setCategory] = useState(categoriesInitialState);
  const [hasUserGrantedPermission, setHasUserGrantedPermission] =
    useState(false);
  const [shouldResultOnchangeExecute, setShouldResultOnchangeExecute] =
    useState(true);
  const [result, setResult] = useState<PermissionStatus>();
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [latLngFromSearchLocationInput, setLatLngFromSearchLocationInput] =
    useState<{ lat: number; lng: number } | null>(null);
  const [isCurrentLocationButtonPressed, setIsCurrentLocationButtonPressed] =
    useState(false);
  const [currentLocationAndZoomValue, setCurrentLocationAndZoomValue] =
    useState<{ lat: number; lng: number; zoomValue: number | undefined }>({
      lat: 0,
      lng: 0,
      zoomValue: 15,
    });
  const [isLoading, setIsLoading] = useState(true);
  const { processedData, getProductDistance, setProcessedData } = useContext(
    ProductDistanceContext
  );

  const router = useRouter();

  const searchAddressInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const sort_param = router.query.sort;
  const previousPath = router.query.previousPath;

  useEffect(() => {
    setFirstRenderDone(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUser");

        const data = await res.json();

        if (res.ok) {
          const user = data.user;
          if (user.subscription && user.subscription.last_payment_error) {
            setShowForFetchUser(true);
            setSubscriptionPaymentError({
              last_payment_error: user.subscription.last_payment_error,
            });
          }
        }
      } catch (error) {
        const err = new Error("Something went wrong!");
        setFetchRejectError(true);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handlePermissions = async () => {
      const result = await navigator.permissions.query({
        name: "geolocation",
      });
      setResult(result);
      if (result.state === "granted") {
        setHasUserGrantedPermission(true);
        setIsLoading(false);
        setShouldResultOnchangeExecute(false);
      } else if (result.state === "denied") {
        setIsLoading(false);
        setShouldResultOnchangeExecute(false);
      } else if (result.state === "prompt") {
        setIsLoading(false);
      }
    };
    handlePermissions();
  }, []);

  useEffect(() => {
    if (result) {
      result.onchange = () => {
        if (result.state === "granted") {
          if (shouldResultOnchangeExecute) {
            setHasUserGrantedPermission(true);
            setIsLoading(false);
            setShouldResultOnchangeExecute(false);
          }
        } else if (result.state === "denied") {
          if (shouldResultOnchangeExecute) {
            setIsLoading(false);
            setShouldResultOnchangeExecute(false);
          }
        } else if (result.state === "prompt") {
          console.log("promptOnChange", result);
        }
      };
    }
  }, [result, shouldResultOnchangeExecute]);

  useEffect(() => {
    if (!firstRenderDone) {
      return;
    }
    const showPosition = (position: any) => {
      if (previousPath === "/products/[productId]") {
        let lngFromUrlQueryParam: number;
        let latFromUrlQueryParam: number;
        let zoomFromUrlQueryParam: number;

        const searchLocationParams = new URLSearchParams(
          router.query.locations?.toString()
        );
        lngFromUrlQueryParam = +searchLocationParams.get("longitude")!;
        latFromUrlQueryParam = +searchLocationParams.get("latitude")!;
        zoomFromUrlQueryParam = +router.query.zoomValue!;

        setCurrentLocationAndZoomValue({
          lat: latFromUrlQueryParam,
          lng: lngFromUrlQueryParam,
          zoomValue: zoomFromUrlQueryParam,
        });
      } else {
        setCurrentLocationAndZoomValue((prevState) => {
          return {
            ...prevState,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      }
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const geoLocation = () => {
      navigator.geolocation.getCurrentPosition(showPosition, null, {
        enableHighAccuracy: true,
      });
    };
    geoLocation();
  }, [hasUserGrantedPermission]);

  useEffect(() => {
    if (
      window.google &&
      products.length &&
      currentLocation.lat &&
      currentLocation.lng
    ) {
      getProductDistance(products);
    } else if (!products.length && processedData) {
      setProcessedData();
    }
    return;
  }, [products, currentLocation, sort_param]);

  useEffect(() => {
    if (isCurrentLocationButtonPressed) {
      setTimeout(() => {
        setIsCurrentLocationButtonPressed(false);
      }, 500);
    }
  }, [isCurrentLocationButtonPressed]);

  useEffect(() => {
    if (!firstRenderDone) {
      // console.log("first render");
      return;
    }
    if (previousPath === "/products/[productId]") {
      return;
    }
    const currLoc = {
      latitude: currentLocationAndZoomValue.lat.toString(),
      longitude: currentLocationAndZoomValue.lng.toString(),
    };
    const searchParams = new URLSearchParams(currLoc);
    const locationQuery = searchParams.toString();

    const milesToFeelTheMap = countMilesToIncreaseRadiusByZoomingInAndOutMap(
      currentLocationAndZoomValue.zoomValue!
    );
    const url = {
      pathname: router.pathname,
      query: {
        ...router.query,
        locations: locationQuery,
        radiusInMiles: milesToFeelTheMap.toString(),
        zoomValue: currentLocationAndZoomValue.zoomValue?.toString(),
      },
    };
    router.replace(url);
  }, [currentLocationAndZoomValue]);

  useEffect(() => {
    if (!router.query.search) {
      return;
    }
    setSearchTerm(
      typeof router.query.search === "string" ? router.query.search : ""
    );
  }, []);

  useEffect(() => {
    if (!firstRenderDone) {
      return;
    }

    const timer = setTimeout(() => {
      const searchRequest = async () => {
        let query;
        if (searchTerm) {
          query = { ...router.query, search: searchTerm };
        } else {
          delete router.query.search;
          query = { ...router.query };
        }

        const url = {
          pathname: router.pathname,
          query: query,
        };

        router.push(url);
      };
      searchRequest();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const searchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getLocationAndZoomValueOnCenterChange = (coordsAndZoomValue: {
    lat: number;
    lng: number;
    zoomValue: number | undefined;
  }) => {
    if (
      coordsAndZoomValue?.lat !== currentLocationAndZoomValue.lat &&
      coordsAndZoomValue?.lng !== currentLocationAndZoomValue?.lat
    ) {
      setCurrentLocationAndZoomValue((prevState) => {
        if (coordsAndZoomValue.zoomValue === undefined) {
          return { ...coordsAndZoomValue, zoomValue: prevState.zoomValue };
        }
        return coordsAndZoomValue;
      });
    }
  };

  return (
    <Layout>
      <>
        {subscriptionPaymentError && showForFetchUser && (
          <ToastModal
            variant="danger"
            header="Error!"
            body={`You had a Payment Failed error with a message "${subscriptionPaymentError.last_payment_error}"`}
            show={showForFetchUser}
            onClose={() => setShowForFetchUser(false)}
          />
        )}
        <ErrorModal
          show={fetchRejectError}
          onHide={() => setFetchRejectError(false)}
          error="Could not retrieve user subscription information"
        />
        <div className={`${styles["grid-container"]}`}>
          <div className={styles["grid-item-left"]}>
            <Search value={searchTerm} onChange={searchInputChangeHandler} />
            <SearchPlaceInput
              ref={searchAddressInputRef}
              getSearchedPlaceCoordinates={setLatLngFromSearchLocationInput}
              setIsCurrentLocationButtonPressed={
                setIsCurrentLocationButtonPressed
              }
            />
            <Categories
              searchTerm={searchTerm}
              categories={categoriesInitialState}
            />
            <Results
              isForFavoritePage={false}
              items={processedData}
              notFoundText="No records found!"
            />
          </div>
          <div className={styles["grid-item-right"]}>
            <HomeMap
              currentLocation={currentLocation}
              items={products}
              latLngFromSearchPlaceInput={latLngFromSearchLocationInput}
              isCurrentLocationButtonPressed={isCurrentLocationButtonPressed}
              onChange={getLocationAndZoomValueOnCenterChange}
              searchAddressInputRef={searchAddressInputRef}
            />
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Home;
