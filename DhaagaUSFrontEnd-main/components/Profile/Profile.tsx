import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

import { editUserContext } from "@/context/edit-user-context";
import { AuthContext } from "@/context/auth-context";

import styles from "../../styles/Profile.module.css";

import AccountInfo from "../AccountInfo/AccountInfo";
import NotificationHistory from "../NotificationHistory/NotificationHistory";
import PaymentInfo from "../PaymentInfo/PaymentInfo";
import SendFeedback from "../SendFeedback/SendFeedback";
import AboutUs from "../AboutUs/AboutUs";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";
import FAQS from "../FAQS/FAQS";
import ToastModal from "../ToastModal/ToastModal";
import UserProfile from "../UserProfile/UserProfile";
import { useRouter } from "next/router";

const Profile = (props: { user: any }) => {
  const { user } = props;

  const [show, setShow] = useState(false);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [settingsNotCollapsed, setSettingsNotCollapsed] = useState(false);
  const [helpNotCollapsed, setHelpNotCollapsed] = useState(false);
  const [pages, setPages] = useState<{ [key: string]: boolean }>({
    accountInfo: true,
    notificationHistory: false,
    paymentInfo: false,
    sendFeedback: false,
    aboutUs: false,
    termsAndConditions: false,
    faqs: false,
  });
  const [userProfile, setUserProfile] = useState<any>(user);

  const { signOut } = useContext(AuthContext);

  const router = useRouter();

  const success = router.query.success;
  const cancel = router.query.cancel;

  const {
    updatedUserProfile,
    isUsernameEditing,
    selectedImage,
    setImage,
    showEditForm,
    hideEditForm,
    setUserProfilePicture,
  } = useContext(editUserContext);

  useEffect(() => {
    setFirstRenderDone(true);
  }, []);

  useEffect(() => {
    return () => {
      hideEditForm("username");
    };
  }, []);

  useEffect(() => {
    if (userProfile?.profile_picture) {
      setUserProfilePicture(userProfile?.profile_picture);
    }
  }, [userProfile]);

  useEffect(() => {
    if (!firstRenderDone) {
      return;
    }
    setImage(undefined, false);
    setUserProfile(updatedUserProfile);
  }, [updatedUserProfile]);

  useEffect(() => {
    if (user.subscription && user.subscription.last_payment_error) {
      setShow(true);
    }
  }, [user]);

  useEffect(() => {
    if (success || cancel) {
      setShow(true);
    }
  }, [success, cancel]);

  const changePageHandler = (identifier: string) => {
    setPages((prevState) => {
      const updatedState = { ...prevState };
      for (const key in updatedState) {
        if (updatedState[key] === true) {
          updatedState[key] = false;
        }
      }
      updatedState[identifier] = !updatedState[identifier];
      return updatedState;
    });
  };

  const uploadImageChangeHandler = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files![0];
    setImage(file, undefined);
  };

  let src: string;
  if (selectedImage) {
    src = URL.createObjectURL(selectedImage);
  } else {
    src = userProfile?.profile_picture;
  }

  return (
    <>
      {user.subscription && user.subscription.last_payment_error && show && (
        <ToastModal
          variant="danger"
          header="Error!"
          body={`You had a Payment Failed error with a message "${user.subscription.last_payment_error}"`}
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      {success && show && (
        <ToastModal
          variant="success"
          header="Success"
          body="Your payment was successful."
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      {cancel && show && (
        <ToastModal
          variant="danger"
          header="Cancel"
          body="Your session was canceled !"
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      <div className="row gap-4">
        <div className="col-12 col-lg-11 col-xl-10 col-xxl-9 mx-auto">
          <div className="row justify-content-center" style={{ gap: 20 }}>
            <div
              className="d-flex flex-column col-sm-12 col-md-8 col-lg-5 px-0"
              style={{ gap: 20 }}
            >
              <UserProfile
                selectedImage={selectedImage}
                userProfile={userProfile}
                isUsernameEditing={isUsernameEditing}
                uploadImageChangeHandler={uploadImageChangeHandler}
                hideEditFormHandler={() => hideEditForm("username")}
                showEditFormHandler={() => showEditForm("username")}
              />
              <div className={styles.menu}>
                <Accordion>
                  <Accordion.Item eventKey="0" style={{ border: 0 }}>
                    <Accordion.Header
                      className={`${styles["card-header"]} ${
                        settingsNotCollapsed
                          ? styles["settings-not-collapsed"]
                          : ""
                      }`}
                      onClick={() =>
                        setSettingsNotCollapsed((prevState) => !prevState)
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles["header-icon"]}
                      >
                        <path
                          d="M7.70833 18.3337L7.375 15.667C7.19444 15.5975 7.02444 15.5142 6.865 15.417C6.705 15.3198 6.54861 15.2156 6.39583 15.1045L3.91667 16.1462L1.625 12.1878L3.77083 10.5628C3.75694 10.4656 3.75 10.3717 3.75 10.2812V9.71866C3.75 9.62866 3.75694 9.53505 3.77083 9.43783L1.625 7.81283L3.91667 3.85449L6.39583 4.89616C6.54861 4.78505 6.70833 4.68088 6.875 4.58366C7.04167 4.48644 7.20833 4.4031 7.375 4.33366L7.70833 1.66699H12.2917L12.625 4.33366C12.8056 4.4031 12.9758 4.48644 13.1358 4.58366C13.2953 4.68088 13.4514 4.78505 13.6042 4.89616L16.0833 3.85449L18.375 7.81283L16.2292 9.43783C16.2431 9.53505 16.25 9.62866 16.25 9.71866V10.2812C16.25 10.3717 16.2361 10.4656 16.2083 10.5628L18.3542 12.1878L16.0625 16.1462L13.6042 15.1045C13.4514 15.2156 13.2917 15.3198 13.125 15.417C12.9583 15.5142 12.7917 15.5975 12.625 15.667L12.2917 18.3337H7.70833ZM10.0417 12.917C10.8472 12.917 11.5347 12.6323 12.1042 12.0628C12.6736 11.4934 12.9583 10.8059 12.9583 10.0003C12.9583 9.19477 12.6736 8.50727 12.1042 7.93783C11.5347 7.36838 10.8472 7.08366 10.0417 7.08366C9.22222 7.08366 8.53111 7.36838 7.96833 7.93783C7.40611 8.50727 7.125 9.19477 7.125 10.0003C7.125 10.8059 7.40611 11.4934 7.96833 12.0628C8.53111 12.6323 9.22222 12.917 10.0417 12.917ZM10.0417 11.2503C9.69444 11.2503 9.39944 11.1287 9.15667 10.8853C8.91333 10.6425 8.79167 10.3475 8.79167 10.0003C8.79167 9.6531 8.91333 9.3581 9.15667 9.11532C9.39944 8.87199 9.69444 8.75033 10.0417 8.75033C10.3889 8.75033 10.6842 8.87199 10.9275 9.11532C11.1703 9.3581 11.2917 9.6531 11.2917 10.0003C11.2917 10.3475 11.1703 10.6425 10.9275 10.8853C10.6842 11.1287 10.3889 11.2503 10.0417 11.2503ZM9.16667 16.667H10.8125L11.1042 14.4587C11.5347 14.3475 11.9342 14.1842 12.3025 13.9687C12.6703 13.7537 13.0069 13.4934 13.3125 13.1878L15.375 14.042L16.1875 12.6253L14.3958 11.2712C14.4653 11.0767 14.5139 10.8717 14.5417 10.6562C14.5694 10.4412 14.5833 10.2225 14.5833 10.0003C14.5833 9.7781 14.5694 9.55921 14.5417 9.34366C14.5139 9.12866 14.4653 8.92394 14.3958 8.72949L16.1875 7.37533L15.375 5.95866L13.3125 6.83366C13.0069 6.51421 12.6703 6.24671 12.3025 6.03116C11.9342 5.81616 11.5347 5.6531 11.1042 5.54199L10.8333 3.33366H9.1875L8.89583 5.54199C8.46528 5.6531 8.06611 5.81616 7.69833 6.03116C7.33 6.24671 6.99306 6.50727 6.6875 6.81283L4.625 5.95866L3.8125 7.37533L5.60417 8.70866C5.53472 8.91699 5.48611 9.12533 5.45833 9.33366C5.43056 9.54199 5.41667 9.76421 5.41667 10.0003C5.41667 10.2225 5.43056 10.4378 5.45833 10.6462C5.48611 10.8545 5.53472 11.0628 5.60417 11.2712L3.8125 12.6253L4.625 14.042L6.6875 13.167C6.99306 13.4864 7.33 13.7537 7.69833 13.9687C8.06611 14.1842 8.46528 14.3475 8.89583 14.4587L9.16667 16.667Z"
                          fill="#562EC4"
                        />
                      </svg>
                      Settings
                    </Accordion.Header>
                    <Accordion.Body className={styles["accord-body"]}>
                      <ul className={styles.links}>
                        <li
                          onClick={changePageHandler.bind(
                            null,
                            "notificationHistory"
                          )}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 17.5C8.08333 17.5 6.41333 16.8644 4.99 15.5933C3.56611 14.3228 2.75 12.7361 2.54167 10.8333H4.25C4.44444 12.2778 5.08667 13.4722 6.17667 14.4167C7.26722 15.3611 8.54167 15.8333 10 15.8333C11.625 15.8333 13.0033 15.2672 14.135 14.135C15.2672 13.0033 15.8333 11.625 15.8333 10C15.8333 8.375 15.2672 6.99639 14.135 5.86417C13.0033 4.7325 11.625 4.16667 10 4.16667C9.04167 4.16667 8.14583 4.38889 7.3125 4.83333C6.47917 5.27778 5.77778 5.88889 5.20833 6.66667H7.5V8.33333H2.5V3.33333H4.16667V5.29167C4.875 4.40278 5.73972 3.71528 6.76083 3.22917C7.78139 2.74306 8.86111 2.5 10 2.5C11.0417 2.5 12.0175 2.69778 12.9275 3.09333C13.8369 3.48944 14.6286 4.02417 15.3025 4.6975C15.9758 5.37139 16.5106 6.16306 16.9067 7.0725C17.3022 7.9825 17.5 8.95833 17.5 10C17.5 11.0417 17.3022 12.0172 16.9067 12.9267C16.5106 13.8367 15.9758 14.6283 15.3025 15.3017C14.6286 15.9756 13.8369 16.5106 12.9275 16.9067C12.0175 17.3022 11.0417 17.5 10 17.5ZM12.3333 13.5L9.16667 10.3333V5.83333H10.8333V9.66667L13.5 12.3333L12.3333 13.5Z"
                              fill="#562EC4"
                            />
                          </svg>
                          Notification History
                        </li>
                        <li
                          onClick={changePageHandler.bind(null, "accountInfo")}
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
                              d="M12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3ZM14.25 7.5C14.25 6.2625 13.2375 5.25 12 5.25C10.7625 5.25 9.75 6.2625 9.75 7.5C9.75 8.7375 10.7625 9.75 12 9.75C13.2375 9.75 14.25 8.7375 14.25 7.5ZM18.75 17.625C18.525 16.8263 15.0375 15.375 12 15.375C8.9625 15.375 5.475 16.8263 5.25 17.6362V18.75H18.75V17.625ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                              fill="#562EC4"
                            />
                          </svg>
                          Account info
                        </li>
                        {/* <li>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.8333 14.167V9.83366C15.4167 9.91699 15 10.0003 14.5833 10.0003H14.1667V15.0003H5.83333V9.16699C5.83333 6.83366 7.66667 5.00033 10 5.00033C10.0833 3.91699 10.5833 3.00033 11.25 2.25033C11 1.91699 10.5 1.66699 10 1.66699C9.08333 1.66699 8.33333 2.41699 8.33333 3.33366V3.58366C5.83333 4.33366 4.16667 6.58366 4.16667 9.16699V14.167L2.5 15.8337V16.667H17.5V15.8337L15.8333 14.167ZM8.33333 17.5003C8.33333 18.417 9.08333 19.167 10 19.167C10.9167 19.167 11.6667 18.417 11.6667 17.5003H8.33333ZM17.5 5.41699C17.5 7.00033 16.1667 8.33366 14.5833 8.33366C13 8.33366 11.6667 7.00033 11.6667 5.41699C11.6667 3.83366 13 2.50033 14.5833 2.50033C16.1667 2.50033 17.5 3.83366 17.5 5.41699Z"
                        fill="#562EC4"
                      />
                    </svg>
                    Push Notifications
                  </li> */}
                        {/* <li>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.667 6.66699H11.9903L12.9262 3.86116C13.0945 3.35449 13.0095 2.79283 12.697 2.35949C12.3845 1.92616 11.8778 1.66699 11.3437 1.66699H10.0003C9.75283 1.66699 9.51866 1.77699 9.35949 1.96699L5.44283 6.66699H3.33366C2.41449 6.66699 1.66699 7.41449 1.66699 8.33366V15.8337C1.66699 16.7528 2.41449 17.5003 3.33366 17.5003H14.4228C14.7619 17.4992 15.0926 17.3952 15.3713 17.2021C15.65 17.0089 15.8636 16.7357 15.9837 16.4187L18.2812 10.2928C18.316 10.1993 18.3338 10.1002 18.3337 10.0003V8.33366C18.3337 7.41449 17.5862 6.66699 16.667 6.66699ZM3.33366 8.33366H5.00033V15.8337H3.33366V8.33366ZM16.667 9.84949L14.4228 15.8337H6.66699V7.80199L10.3903 3.33366H11.3453L10.0437 7.23616C10.0014 7.36142 9.98962 7.49495 10.0093 7.62568C10.0289 7.75641 10.0795 7.88057 10.1567 7.98786C10.2339 8.09515 10.3356 8.18249 10.4534 8.24263C10.5711 8.30276 10.7015 8.33397 10.8337 8.33366H16.667V9.84949Z"
                        fill="#562EC4"
                      />
                    </svg>
                    Rate Us
                  </li> */}
                        {/* <li>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.9997 11.6663V9.16634H12.4997V7.49967H14.9997V4.99967H16.6663V7.49967H19.1663V9.16634H16.6663V11.6663H14.9997ZM7.49967 9.99967C6.58301 9.99967 5.79829 9.67329 5.14551 9.02051C4.49273 8.36773 4.16634 7.58301 4.16634 6.66634C4.16634 5.74967 4.49273 4.96495 5.14551 4.31217C5.79829 3.6594 6.58301 3.33301 7.49967 3.33301C8.41634 3.33301 9.20106 3.6594 9.85384 4.31217C10.5066 4.96495 10.833 5.74967 10.833 6.66634C10.833 7.58301 10.5066 8.36773 9.85384 9.02051C9.20106 9.67329 8.41634 9.99967 7.49967 9.99967ZM0.833008 16.6663V14.333C0.833008 13.8608 0.954674 13.4266 1.19801 13.0305C1.44079 12.635 1.76356 12.333 2.16634 12.1247C3.02745 11.6941 3.90245 11.3711 4.79134 11.1555C5.68023 10.9405 6.58301 10.833 7.49967 10.833C8.41634 10.833 9.31912 10.9405 10.208 11.1555C11.0969 11.3711 11.9719 11.6941 12.833 12.1247C13.2358 12.333 13.5586 12.635 13.8013 13.0305C14.0447 13.4266 14.1663 13.8608 14.1663 14.333V16.6663H0.833008ZM2.49967 14.9997H12.4997V14.333C12.4997 14.1802 12.4616 14.0413 12.3855 13.9163C12.3088 13.7913 12.208 13.6941 12.083 13.6247C11.333 13.2497 10.5761 12.9683 9.81217 12.7805C9.04829 12.5933 8.27745 12.4997 7.49967 12.4997C6.7219 12.4997 5.95106 12.5933 5.18717 12.7805C4.42329 12.9683 3.66634 13.2497 2.91634 13.6247C2.79134 13.6941 2.69079 13.7913 2.61467 13.9163C2.53801 14.0413 2.49967 14.1802 2.49967 14.333V14.9997ZM7.49967 8.33301C7.95801 8.33301 8.35051 8.16967 8.67718 7.84301C9.00329 7.5169 9.16634 7.12467 9.16634 6.66634C9.16634 6.20801 9.00329 5.81579 8.67718 5.48967C8.35051 5.16301 7.95801 4.99967 7.49967 4.99967C7.04134 4.99967 6.64912 5.16301 6.32301 5.48967C5.99634 5.81579 5.83301 6.20801 5.83301 6.66634C5.83301 7.12467 5.99634 7.5169 6.32301 7.84301C6.64912 8.16967 7.04134 8.33301 7.49967 8.33301Z"
                        fill="#562EC4"
                      />
                    </svg>
                    Invite friends
                  </li> */}
                        <li onClick={signOut}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.16667 17.5C3.70833 17.5 3.31583 17.3369 2.98917 17.0108C2.66306 16.6842 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66306 3.31583 2.98917 2.98917C3.31583 2.66306 3.70833 2.5 4.16667 2.5H10V4.16667H4.16667V15.8333H10V17.5H4.16667ZM13.3333 14.1667L12.1875 12.9583L14.3125 10.8333H7.5V9.16667H14.3125L12.1875 7.04167L13.3333 5.83333L17.5 10L13.3333 14.1667Z"
                              fill="#C42E49"
                            />
                          </svg>
                          Sign Out
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" style={{ border: 0 }}>
                    <Accordion.Header
                      className={`${styles["card-header"]} ${
                        helpNotCollapsed ? styles["help-not-collapsed"] : ""
                      }`}
                      onClick={() =>
                        setHelpNotCollapsed((prevState) => !prevState)
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles["header-icon"]}
                      >
                        <path
                          d="M9.95866 15.0003C10.2503 15.0003 10.497 14.8995 10.6987 14.6978C10.8998 14.4967 11.0003 14.2503 11.0003 13.9587C11.0003 13.667 10.8998 13.4206 10.6987 13.2195C10.497 13.0178 10.2503 12.917 9.95866 12.917C9.66699 12.917 9.42033 13.0178 9.21866 13.2195C9.01755 13.4206 8.91699 13.667 8.91699 13.9587C8.91699 14.2503 9.01755 14.4967 9.21866 14.6978C9.42033 14.8995 9.66699 15.0003 9.95866 15.0003ZM9.20866 11.792H10.7503C10.7503 11.3337 10.8025 10.9725 10.907 10.7087C11.0109 10.4448 11.3059 10.0837 11.792 9.62533C12.1531 9.26421 12.4378 8.92033 12.6462 8.59366C12.8545 8.26755 12.9587 7.87533 12.9587 7.41699C12.9587 6.63921 12.6739 6.04199 12.1045 5.62533C11.535 5.20866 10.8614 5.00033 10.0837 5.00033C9.29199 5.00033 8.64977 5.20866 8.15699 5.62533C7.66366 6.04199 7.31977 6.54199 7.12533 7.12533L8.50033 7.66699C8.56977 7.41699 8.72616 7.14616 8.96949 6.85449C9.21227 6.56283 9.58366 6.41699 10.0837 6.41699C10.5281 6.41699 10.8614 6.53838 11.0837 6.78116C11.3059 7.02449 11.417 7.29199 11.417 7.58366C11.417 7.86144 11.3337 8.12171 11.167 8.36449C11.0003 8.60783 10.792 8.83366 10.542 9.04199C9.93088 9.58366 9.55588 9.99338 9.41699 10.2712C9.2781 10.5489 9.20866 11.0559 9.20866 11.792ZM10.0003 18.3337C8.84755 18.3337 7.76421 18.1148 6.75033 17.677C5.73644 17.2398 4.85449 16.6462 4.10449 15.8962C3.35449 15.1462 2.76088 14.2642 2.32366 13.2503C1.88588 12.2364 1.66699 11.1531 1.66699 10.0003C1.66699 8.84755 1.88588 7.76421 2.32366 6.75033C2.76088 5.73644 3.35449 4.85449 4.10449 4.10449C4.85449 3.35449 5.73644 2.7606 6.75033 2.32283C7.76421 1.8856 8.84755 1.66699 10.0003 1.66699C11.1531 1.66699 12.2364 1.8856 13.2503 2.32283C14.2642 2.7606 15.1462 3.35449 15.8962 4.10449C16.6462 4.85449 17.2398 5.73644 17.677 6.75033C18.1148 7.76421 18.3337 8.84755 18.3337 10.0003C18.3337 11.1531 18.1148 12.2364 17.677 13.2503C17.2398 14.2642 16.6462 15.1462 15.8962 15.8962C15.1462 16.6462 14.2642 17.2398 13.2503 17.677C12.2364 18.1148 11.1531 18.3337 10.0003 18.3337ZM10.0003 16.667C11.8614 16.667 13.4378 16.0212 14.7295 14.7295C16.0212 13.4378 16.667 11.8614 16.667 10.0003C16.667 8.13921 16.0212 6.56283 14.7295 5.27116C13.4378 3.97949 11.8614 3.33366 10.0003 3.33366C8.13921 3.33366 6.56283 3.97949 5.27116 5.27116C3.97949 6.56283 3.33366 8.13921 3.33366 10.0003C3.33366 11.8614 3.97949 13.4378 5.27116 14.7295C6.56283 16.0212 8.13921 16.667 10.0003 16.667Z"
                          fill="#562EC4"
                        />
                      </svg>
                      Help
                    </Accordion.Header>
                    <Accordion.Body className={styles["accord-body"]}>
                      <ul className={styles.links}>
                        <li onClick={changePageHandler.bind(null, "aboutUs")}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.667 2.66602H3.33366C2.41699 2.66602 1.66699 3.41602 1.66699 4.33268V19.3327L5.00033 15.9993H16.667C17.5837 15.9993 18.3337 15.2493 18.3337 14.3327V4.33268C18.3337 3.41602 17.5837 2.66602 16.667 2.66602ZM16.667 14.3327H4.33366L3.33366 15.3327V4.33268H16.667V14.3327ZM10.167 5.58268C9.41699 5.58268 8.83366 5.74935 8.41699 5.99935C7.91699 6.33268 7.66699 6.83268 7.75033 7.41602H9.41699C9.41699 7.16602 9.50033 6.99935 9.66699 6.91602C9.83366 6.83268 10.0003 6.74935 10.2503 6.74935C10.5003 6.74935 10.7503 6.83268 10.917 6.99935C11.0837 7.16602 11.167 7.33268 11.167 7.58268C11.167 7.83268 11.0837 7.99935 11.0003 8.16602C10.8337 8.33268 10.667 8.49935 10.5003 8.58268C10.0837 8.83268 9.75033 9.08268 9.58366 9.24935C9.25033 9.49935 9.16699 9.74935 9.16699 10.166H10.8337C10.8337 9.91602 10.917 9.74935 10.917 9.58268C11.0003 9.41602 11.167 9.33268 11.3337 9.16602C11.7503 8.99935 12.0003 8.74935 12.2503 8.41602C12.5003 8.08268 12.5837 7.74935 12.5837 7.41602C12.5837 6.83268 12.3337 6.33268 11.917 5.99935C11.5837 5.74935 10.917 5.58268 10.167 5.58268ZM9.16699 10.9993V12.666H10.8337V10.9993H9.16699Z"
                              fill="#562EC4"
                            />
                          </svg>
                          About Us
                        </li>
                        {/* <li
                          onClick={changePageHandler.bind(
                            null,
                            "termsAndConditions"
                          )}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.667 2.66602H3.33366C2.41699 2.66602 1.66699 3.41602 1.66699 4.33268V19.3327L5.00033 15.9993H16.667C17.5837 15.9993 18.3337 15.2493 18.3337 14.3327V4.33268C18.3337 3.41602 17.5837 2.66602 16.667 2.66602ZM16.667 14.3327H4.33366L3.33366 15.3327V4.33268H16.667V14.3327ZM10.167 5.58268C9.41699 5.58268 8.83366 5.74935 8.41699 5.99935C7.91699 6.33268 7.66699 6.83268 7.75033 7.41602H9.41699C9.41699 7.16602 9.50033 6.99935 9.66699 6.91602C9.83366 6.83268 10.0003 6.74935 10.2503 6.74935C10.5003 6.74935 10.7503 6.83268 10.917 6.99935C11.0837 7.16602 11.167 7.33268 11.167 7.58268C11.167 7.83268 11.0837 7.99935 11.0003 8.16602C10.8337 8.33268 10.667 8.49935 10.5003 8.58268C10.0837 8.83268 9.75033 9.08268 9.58366 9.24935C9.25033 9.49935 9.16699 9.74935 9.16699 10.166H10.8337C10.8337 9.91602 10.917 9.74935 10.917 9.58268C11.0003 9.41602 11.167 9.33268 11.3337 9.16602C11.7503 8.99935 12.0003 8.74935 12.2503 8.41602C12.5003 8.08268 12.5837 7.74935 12.5837 7.41602C12.5837 6.83268 12.3337 6.33268 11.917 5.99935C11.5837 5.74935 10.917 5.58268 10.167 5.58268ZM9.16699 10.9993V12.666H10.8337V10.9993H9.16699Z"
                              fill="#562EC4"
                            />
                          </svg>
                          Terms And Conditions
                        </li> */}
                        {/* <li>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.49967 5.83333V12.5L13.333 9.16667L7.49967 5.83333ZM17.4997 2.5H2.49967C1.58301 2.5 0.833008 3.25 0.833008 4.16667V14.1667C0.833008 15.0833 1.58301 15.8333 2.49967 15.8333H6.66634V17.5H13.333V15.8333H17.4997C18.4163 15.8333 19.1663 15.0833 19.1663 14.1667V4.16667C19.1663 3.25 18.4163 2.5 17.4997 2.5ZM17.4997 14.1667H2.49967V4.16667H17.4997V14.1667Z"
                        fill="#562EC4"
                      />
                    </svg>
                    App Tour
                  </li> */}
                        <li onClick={changePageHandler.bind(null, "faqs")}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.667 2.66602H3.33366C2.41699 2.66602 1.66699 3.41602 1.66699 4.33268V19.3327L5.00033 15.9993H16.667C17.5837 15.9993 18.3337 15.2493 18.3337 14.3327V4.33268C18.3337 3.41602 17.5837 2.66602 16.667 2.66602ZM16.667 14.3327H4.33366L3.33366 15.3327V4.33268H16.667V14.3327ZM10.167 5.58268C9.41699 5.58268 8.83366 5.74935 8.41699 5.99935C7.91699 6.33268 7.66699 6.83268 7.75033 7.41602H9.41699C9.41699 7.16602 9.50033 6.99935 9.66699 6.91602C9.83366 6.83268 10.0003 6.74935 10.2503 6.74935C10.5003 6.74935 10.7503 6.83268 10.917 6.99935C11.0837 7.16602 11.167 7.33268 11.167 7.58268C11.167 7.83268 11.0837 7.99935 11.0003 8.16602C10.8337 8.33268 10.667 8.49935 10.5003 8.58268C10.0837 8.83268 9.75033 9.08268 9.58366 9.24935C9.25033 9.49935 9.16699 9.74935 9.16699 10.166H10.8337C10.8337 9.91602 10.917 9.74935 10.917 9.58268C11.0003 9.41602 11.167 9.33268 11.3337 9.16602C11.7503 8.99935 12.0003 8.74935 12.2503 8.41602C12.5003 8.08268 12.5837 7.74935 12.5837 7.41602C12.5837 6.83268 12.3337 6.33268 11.917 5.99935C11.5837 5.74935 10.917 5.58268 10.167 5.58268ZM9.16699 10.9993V12.666H10.8337V10.9993H9.16699Z"
                              fill="#562EC4"
                            />
                          </svg>
                          FAQs
                        </li>
                        <li
                          onClick={changePageHandler.bind(null, "sendFeedback")}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.50033 18.3337C7.00033 18.3337 6.66699 18.0003 6.66699 17.5003V15.0003H3.33366C2.41699 15.0003 1.66699 14.2503 1.66699 13.3337V3.33366C1.66699 2.41699 2.41699 1.66699 3.33366 1.66699H16.667C17.5837 1.66699 18.3337 2.41699 18.3337 3.33366V13.3337C18.3337 14.2503 17.5837 15.0003 16.667 15.0003H11.5837L8.50033 18.0837C8.33366 18.2503 8.16699 18.3337 7.91699 18.3337H7.50033ZM8.33366 13.3337V15.917L10.917 13.3337H16.667V3.33366H3.33366V13.3337H8.33366ZM13.5837 5.00033L12.417 7.50033H14.167V10.8337H10.8337V7.33366L11.917 5.00033H13.5837ZM8.58366 5.00033L7.41699 7.50033H9.16699V10.8337H5.83366V7.33366L6.91699 5.00033H8.58366Z"
                              fill="#562EC4"
                            />
                          </svg>
                          Send Feedback
                        </li>
                        {/* <li>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.16699 17.5V15.8333H15.8337V9.91667C15.8337 9.11111 15.6809 8.35417 15.3753 7.64583C15.0698 6.9375 14.6531 6.31944 14.1253 5.79167C13.5975 5.26389 12.9795 4.84722 12.2712 4.54167C11.5628 4.23611 10.8059 4.08333 10.0003 4.08333C9.19477 4.08333 8.43783 4.23611 7.72949 4.54167C7.02116 4.84722 6.4031 5.26389 5.87533 5.79167C5.34755 6.31944 4.93088 6.9375 4.62533 7.64583C4.31977 8.35417 4.16699 9.11111 4.16699 9.91667V14.8125H1.66699V10.1875H2.50033L2.56283 9.125C2.68783 8.11111 2.97616 7.19444 3.42783 6.375C3.87894 5.55556 4.44144 4.86111 5.11533 4.29167C5.78866 3.72222 6.5456 3.28111 7.38616 2.96833C8.22616 2.65611 9.09755 2.5 10.0003 2.5C10.917 2.5 11.7956 2.65611 12.6362 2.96833C13.4762 3.28111 14.2295 3.72556 14.8962 4.30167C15.5628 4.87833 16.122 5.57278 16.5737 6.385C17.0248 7.19778 17.3128 8.10417 17.4378 9.10417L17.5003 10.1875H18.3337V14.8125H17.5003V17.5H9.16699Z"
                        fill="#562EC4"
                      />
                    </svg>
                    Contact Support
                  </li> */}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <button
                  className={styles["menu-link"]}
                  onClick={changePageHandler.bind(null, "paymentInfo")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles["header-icon"]}
                  >
                    <path
                      d="M16.667 3.33301H3.33366C2.40866 3.33301 1.67533 4.07467 1.67533 4.99967L1.66699 14.9997C1.66699 15.9247 2.40866 16.6663 3.33366 16.6663H16.667C17.592 16.6663 18.3337 15.9247 18.3337 14.9997V4.99967C18.3337 4.07467 17.592 3.33301 16.667 3.33301ZM16.667 14.9997H3.33366V9.99967H16.667V14.9997ZM16.667 6.66634H3.33366V4.99967H16.667V6.66634Z"
                      fill="#562EC4"
                    />
                  </svg>
                  Payment Info
                </button>
              </div>
            </div>
            <div className="col-sm-12 col-md-10 col-lg-6 p-0 px-0">
              <div className={`wrapper ${styles["page-container"]}`}>
                {pages.accountInfo && <AccountInfo user={userProfile} />}
                {pages.notificationHistory && <NotificationHistory />}
                {pages.aboutUs && <AboutUs />}
                {pages.termsAndConditions && <TermsAndConditions />}
                {pages.faqs && <FAQS />}
                {pages.sendFeedback && <SendFeedback />}
                {pages.paymentInfo && (
                  <PaymentInfo subscription={user.subscription} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col col-lg-11 col-xl-10 col-xxl-9 mx-auto">
          <div
            className="d-flex flex-column align-items-center"
            style={{
              gap: 8,
            }}
          >
            <div className={styles.terms}>
              <button
                onClick={changePageHandler.bind(null, "termsAndConditions")}
              >
                Terms of Service
              </button>
              <svg
                width="2"
                height="12"
                viewBox="0 0 2 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.236 11.448V0.599999H1.052V11.448H0.236Z"
                  fill="#9B9AB9"
                />
              </svg>
              <button>Privacy Policy</button>
            </div>
            <div className={styles.copyright}>Copyright © 2023 Dhaaga LLC.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
