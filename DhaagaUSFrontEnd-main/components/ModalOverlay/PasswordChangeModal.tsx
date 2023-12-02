import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import styles from "../../styles/PasswordChangeModal.module.css";

import ForgotPasswordForm from "../PasswordChangeForms/ForgotPasswordForm";
import ResetPasswordForm from "../PasswordChangeForms/ResetPassword";

const PasswordChangeModal = (props: {
  header: "Forgot Password" | "Reset Password";
}) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { header } = props;

  useEffect(() => {
    setShow(true);
  }, []);

  const backButtonHandler = () => {
    router.push("/?mode=login");
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={styles["modal-custom-width"]}
      centered
    >
      <Modal.Header
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
          {`${header === "Forgot Password" ? header : "Reset Password"}`}
        </Modal.Title>
        {header === "Forgot Password" && (
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
        {header === "Forgot Password" && <ForgotPasswordForm />}
        {header === "Reset Password" && <ResetPasswordForm />}
      </Modal.Body>
    </Modal>
  );
};

export default PasswordChangeModal;
