import { useState } from "react";
import { Modal } from "react-bootstrap";

import styles from "../../styles/AuthFormModal.module.css";

import AuthorizationForm from "../AuthForm/AuthorizationForm";
import JoinAs from "../AuthForm/JoinAs";
import CreateAnAccount from "../AuthForm/CreateAnAccount";
import VerifyAccount from "../AuthForm/VerifyAccount";

const AuthFormModal = ({
  mode,
  onHide,
  changeMode,
  ...otherProps
}: {
  show: boolean;
  mode: { login: boolean; signUp: boolean };
  onHide: () => void;
  changeMode: (login: boolean) => void;
}) => {
  const [signUpOverlays, setSignUpOverlays] = useState<{
    JoinAs: boolean;
    createAnAccount: boolean;
    signUpEmail: boolean;
    verifyAccount: boolean;
  }>({
    JoinAs: true,
    createAnAccount: false,
    signUpEmail: false,
    verifyAccount: false,
  });

  const [joinPreference, setJoinPreference] = useState({
    JoinAsBusiness: true,
  });

  const backButtonHandler = () => {
    if (signUpOverlays.createAnAccount) {
      setSignUpOverlays({
        JoinAs: true,
        createAnAccount: false,
        signUpEmail: false,
        verifyAccount: false,
      });
    } else if (signUpOverlays.signUpEmail) {
      setSignUpOverlays({
        JoinAs: false,
        createAnAccount: true,
        signUpEmail: false,
        verifyAccount: false,
      });
    } else if (signUpOverlays.verifyAccount) {
      setSignUpOverlays({
        JoinAs: false,
        createAnAccount: false,
        signUpEmail: true,
        verifyAccount: false,
      });
    }
  };

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={styles["modal-custom-width"]}
      centered
      onHide={() => {
        onHide();
        setSignUpOverlays({
          JoinAs: true,
          createAnAccount: false,
          signUpEmail: false,
          verifyAccount: false,
        });
        setJoinPreference({ JoinAsBusiness: true });
      }}
    >
      <Modal.Header
        closeButton
        style={{
          padding: "40px 48px 16px 48px",
          position: "relative",
          borderBottom: "1px solid #ebeaff",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          className={styles["modal-title-cstm"]}
        >
          {`${
            mode.login
              ? "Log in"
              : mode.signUp && signUpOverlays.JoinAs
              ? "Welcome to Dhaaga!"
              : mode.signUp && signUpOverlays.createAnAccount
              ? "Create an account"
              : mode.signUp && signUpOverlays.signUpEmail
              ? "Sign Up"
              : mode.signUp && signUpOverlays.verifyAccount
              ? "Verify Account"
              : ""
          }`}
        </Modal.Title>
        {mode.login || signUpOverlays.JoinAs || (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 40,
              left: 24,
              cursor: "pointer",
            }}
            onClick={backButtonHandler}
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="#1C1E36"
            />
          </svg>
        )}
      </Modal.Header>
      <Modal.Body style={{ padding: "32px 24px" }}>
        {mode.login && (
          <AuthorizationForm mode={mode} changeMode={changeMode} />
        )}
        {mode.signUp && signUpOverlays.JoinAs && (
          <JoinAs
            onBusinessClick={() => {
              // setJoinPreference({
              //   JoinAsBusiness: true,
              //   JoinAsCustomer: false,
              // });
              setJoinPreference({ JoinAsBusiness: true });
              setSignUpOverlays({
                JoinAs: false,
                createAnAccount: true,
                signUpEmail: false,
                verifyAccount: false,
              });
            }}
            onCustomerClick={() => {
              setJoinPreference({
                JoinAsBusiness: false,
              });
              setSignUpOverlays({
                JoinAs: false,
                createAnAccount: true,
                signUpEmail: false,
                verifyAccount: false,
              });
            }}
            changeMode={changeMode}
          />
        )}
        {mode.signUp && signUpOverlays.createAnAccount && (
          <CreateAnAccount
            onClick={() =>
              setSignUpOverlays({
                JoinAs: false,
                createAnAccount: false,
                signUpEmail: true,
                verifyAccount: false,
              })
            }
          />
        )}
        {mode.signUp && signUpOverlays.signUpEmail && (
          <AuthorizationForm
            joinAsBusiness={joinPreference.JoinAsBusiness}
            mode={mode}
          />
          // <SignUp
          //   onClick={() =>
          //     setSignUpOverlays({
          //       JoinAs: false,
          //       createAnAccount: false,
          //       signUpEmail: false,
          //       verifyAccount: true,
          //     })
          //   }
          // />
        )}
        {mode.signUp && signUpOverlays.verifyAccount && <VerifyAccount />}
      </Modal.Body>
    </Modal>
  );
};

export default AuthFormModal;
