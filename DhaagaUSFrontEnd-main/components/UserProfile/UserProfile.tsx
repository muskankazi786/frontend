import { useRef } from "react";
import Image from "next/image";

import styles from "../../styles/UserProfile.module.css";

import EditUserInfoForm from "../EditUserInfoForm/EditUserInfoForm";

const UserProfile = (props: {
  selectedImage: any;
  userProfile: any;
  isUsernameEditing: boolean;
  uploadImageChangeHandler: (e: React.ChangeEvent) => void;
  hideEditFormHandler: () => void;
  showEditFormHandler: () => void;
}) => {
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const {
    selectedImage,
    userProfile,
    isUsernameEditing,
    uploadImageChangeHandler,
    hideEditFormHandler,
    showEditFormHandler,
  } = props;

  let src: string;
  if (selectedImage) {
    src = URL.createObjectURL(selectedImage);
  } else {
    src = userProfile?.profile_picture;
  }

  return (
    <div className={styles.user}>
      <div
        className="d-flex align-items-center"
        style={{ gap: 16, zIndex: 10 }}
      >
        <div className={styles["user-img-cntnr"]}>
          {selectedImage || userProfile?.profile_picture ? (
            <Image src={src} alt="Profile Picture" fill />
          ) : (
            ""
          )}
          {isUsernameEditing && (
            <>
              <div className={styles["edit-image-backdrop"]}>
                <label htmlFor="profile-image"></label>
                <input
                  type="file"
                  name="profile-image"
                  id="profile-image"
                  ref={uploadImageRef}
                  onChange={uploadImageChangeHandler}
                />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height={20}
                width={20}
                className={styles["upload-svg"]}
                fill="#7a52d3"
                onClick={(e) => uploadImageRef.current?.click()}
              >
                <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
              </svg>
            </>
          )}
        </div>
        {!isUsernameEditing && (
          <div className={styles.username}>
            {userProfile?.username || userProfile?.email}
          </div>
        )}
        {isUsernameEditing && (
          <EditUserInfoForm
            fromAccountInfoTab={false}
            user={userProfile}
            onCancel={hideEditFormHandler}
          />
        )}
      </div>
      {!isUsernameEditing && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["edit-icon"]}
          onClick={showEditFormHandler}
        >
          <path
            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4ZM14.325 9.675L13.625 8.975L15.025 10.375L14.325 9.675Z"
            fill="#562EC4"
          />
        </svg>
      )}
      <svg
        width="414"
        height="164"
        viewBox="0 0 414 164"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.lines}
      >
        <g opacity="0.24">
          <path
            d="M349.968 -28.9947C323.928 -37.5615 261.529 -46.2377 220.256 -12.407C168.664 29.8813 168.46 36.4546 111.597 30.4681C54.7341 24.4815 41.1289 62.1299 17.6512 73.5336C-1.13104 82.6565 -37.1665 78.4371 -52.8365 75.187"
            stroke="url(#paint0_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M359.931 -22.397C333.891 -30.9639 271.492 -39.64 230.219 -5.80936C178.627 36.479 178.423 43.0523 121.56 37.0657C64.697 31.0792 51.0918 68.7275 27.6141 80.1312C8.83185 89.2542 -27.2037 85.0348 -42.8736 81.7847"
            stroke="url(#paint1_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M372.781 -14.9243C346.741 -23.4912 284.343 -32.1673 243.069 1.6633C191.478 43.9516 191.274 50.5249 134.411 44.5384C77.5476 38.5518 63.9424 76.2002 40.4647 87.6039C21.6824 96.7268 -14.3531 92.5074 -30.023 89.2574"
            stroke="url(#paint2_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M385.633 -7.45072C359.593 -16.0176 297.194 -24.6937 255.921 9.13693C204.329 51.4252 204.125 57.9986 147.262 52.012C90.3992 46.0255 76.794 83.6738 53.3162 95.0775C34.534 104.2 -1.50151 99.9811 -17.1715 96.731"
            stroke="url(#paint3_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M398.484 0.0219393C372.444 -8.54495 310.046 -17.2211 268.773 16.6096C217.181 58.8979 216.977 65.4712 160.114 59.4847C103.251 53.4981 89.6455 91.1465 66.1678 102.55C47.3856 111.673 11.3501 107.454 -4.31992 104.204"
            stroke="url(#paint4_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M411.335 7.4946C385.295 -1.07229 322.897 -9.7484 281.623 24.0822C230.032 66.3706 229.828 72.9439 172.964 66.9573C116.101 60.9708 102.496 98.6191 79.0184 110.023C60.2361 119.146 24.2006 114.926 8.53066 111.676"
            stroke="url(#paint5_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M424.186 14.9682C398.146 6.40134 335.748 -2.27477 294.475 31.5559C242.883 73.8442 242.679 80.4175 185.816 74.431C128.953 68.4444 115.348 106.093 91.8699 117.496C73.0877 126.619 37.0522 122.4 21.3822 119.15"
            stroke="url(#paint6_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M437.038 22.4409C410.998 13.874 348.6 5.19789 307.326 39.0285C255.735 81.3168 255.531 87.8902 198.668 81.9036C141.804 75.9171 128.199 113.565 104.721 124.969C85.9393 134.092 49.9038 129.873 34.2338 126.623"
            stroke="url(#paint7_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M449.889 29.9145C423.849 21.3476 361.45 12.6715 320.177 46.5022C268.585 88.7905 268.381 95.3638 211.518 89.3772C154.655 83.3907 141.05 121.039 117.572 132.443C98.7899 141.566 62.7543 137.346 47.0844 134.096"
            stroke="url(#paint8_linear_452_9135)"
            strokeWidth="0.5"
          />
          <path
            d="M462.74 37.3872C436.7 28.8203 374.302 20.1442 333.028 53.9748C281.437 96.2631 281.233 102.836 224.37 96.8499C167.507 90.8634 153.901 128.512 130.424 139.915C111.641 149.038 75.6059 144.819 59.9359 141.569"
            stroke="url(#paint9_linear_452_9135)"
            strokeWidth="0.5"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_452_9135"
            x1="164.852"
            y1="-64.5711"
            x2="132.487"
            y2="109.644"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_452_9135"
            x1="174.815"
            y1="-57.9735"
            x2="142.45"
            y2="116.242"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_452_9135"
            x1="187.665"
            y1="-50.5008"
            x2="155.301"
            y2="123.714"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_452_9135"
            x1="200.517"
            y1="-43.0272"
            x2="168.152"
            y2="131.188"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_452_9135"
            x1="213.368"
            y1="-35.5545"
            x2="181.004"
            y2="138.661"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_452_9135"
            x1="226.219"
            y1="-28.0819"
            x2="193.855"
            y2="146.133"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_452_9135"
            x1="239.07"
            y1="-20.6082"
            x2="206.706"
            y2="153.607"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint7_linear_452_9135"
            x1="251.922"
            y1="-13.1356"
            x2="219.558"
            y2="161.08"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_452_9135"
            x1="264.773"
            y1="-5.66194"
            x2="232.408"
            y2="168.553"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_452_9135"
            x1="277.624"
            y1="1.81071"
            x2="245.26"
            y2="176.026"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9AB9" />
            <stop offset="1" stopColor="#9B9AB9" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default UserProfile;
