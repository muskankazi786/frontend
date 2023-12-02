import { useContext, useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";

import styles from "../../styles/AccountInfo.module.css";

import EditUserInfoForm from "../EditUserInfoForm/EditUserInfoForm";
import { editUserContext } from "@/context/edit-user-context";
import ToastModal from "../ToastModal/ToastModal";

const AccountInfo = (props: { user: any }) => {
  const {
    requestResponse,
    isPhoneEditing,
    show,
    hideToast,
    showEditForm,
    hideEditForm,
  } = useContext(editUserContext);

  useEffect(() => {
    return () => {
      hideEditForm("phone");
    };
  }, []);

  const { user } = props;

  let phoneNumberWithoutCode;
  let phoneCode;
  if (user?.phone) {
    phoneNumberWithoutCode = user?.phone?.substring(2);
    phoneCode = user?.phone?.substring(0, 2);
  }

  return (
    <>
      {requestResponse && requestResponse.success && show && (
        <ToastModal
          variant="success"
          header="Success"
          body={requestResponse.success}
          show={show}
          onClose={() => hideToast()}
        />
      )}
      {requestResponse && requestResponse.error && show && (
        <ToastModal
          variant="danger"
          header="Error!"
          body={requestResponse.error}
          show={show}
          onClose={() => hideToast()}
        />
      )}
      <div
        className="d-flex flex-column"
        style={{ gap: 16, position: "relative" }}
      >
        <div className={styles.label}>Account info</div>
        <div
          style={{ padding: "16px 0", background: "var(--light-blue-shade)" }}
          className="wrapper"
        >
          <div className={styles.info}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3337 4.99967C18.3337 4.08301 17.5837 3.33301 16.667 3.33301H3.33366C2.41699 3.33301 1.66699 4.08301 1.66699 4.99967V14.9997C1.66699 15.9163 2.41699 16.6663 3.33366 16.6663H16.667C17.5837 16.6663 18.3337 15.9163 18.3337 14.9997V4.99967ZM16.667 4.99967L10.0003 9.16634L3.33366 4.99967H16.667ZM16.667 14.9997H3.33366V6.66634L10.0003 10.833L16.667 6.66634V14.9997Z"
                fill="#7A52D3"
              />
            </svg>
            <div className={styles["user-info"]}>{user?.email}</div>
          </div>
          {!isPhoneEditing && (
            <div className={styles.info}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.625 17.5C16.875 17.5 17.0833 17.4167 17.25 17.25C17.4167 17.0833 17.5 16.875 17.5 16.625V13.25C17.5 13.0556 17.4375 12.8853 17.3125 12.7392C17.1875 12.5936 17.0278 12.5 16.8333 12.4583L13.9583 11.875C13.7639 11.8472 13.5658 11.8644 13.3642 11.9267C13.1631 11.9894 13 12.0833 12.875 12.2083L10.9167 14.1667C9.86111 13.5278 8.89583 12.7708 8.02083 11.8958C7.14583 11.0208 6.41667 10.0833 5.83333 9.08333L7.83333 7.04167C7.95833 6.91667 8.03833 6.77417 8.07333 6.61417C8.10778 6.45472 8.11111 6.27778 8.08333 6.08333L7.54167 3.16667C7.51389 2.97222 7.42361 2.8125 7.27083 2.6875C7.11806 2.5625 6.94444 2.5 6.75 2.5H3.375C3.125 2.5 2.91667 2.58333 2.75 2.75C2.58333 2.91667 2.5 3.125 2.5 3.375C2.5 5.16667 2.89944 6.91306 3.69833 8.61417C4.49667 10.3158 5.55222 11.8228 6.865 13.135C8.17722 14.4478 9.68389 15.5033 11.385 16.3017C13.0867 17.1006 14.8333 17.5 16.625 17.5Z"
                  fill="#7A52D3"
                />
              </svg>
              <PatternFormat
                className={styles["user-info"]}
                format="(###) ###-####"
                value={phoneNumberWithoutCode}
                readOnly
              />
            </div>
          )}
          {isPhoneEditing && (
            <EditUserInfoForm
              fromAccountInfoTab={true}
              user={user}
              onCancel={() => hideEditForm("phone")}
            />
          )}
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["edit-icon"]}
          onClick={() => showEditForm("phone")}
        >
          <path
            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4ZM14.325 9.675L13.625 8.975L15.025 10.375L14.325 9.675Z"
            fill="#562EC4"
          />
        </svg>
      </div>
    </>
  );
};

export default AccountInfo;
