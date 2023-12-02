import { useContext, useRef } from "react";

import useInput from "@/hooks/useInput";

import styles from "../../styles/PasswordChangeForms.module.css";

import { AuthContext } from "@/context/auth-context";
import ToastModal from "../ToastModal/ToastModal";
import { isEmailValid, isNotEmpty } from "@/utils/validation/conditions";

const ForgotPasswordForm = () => {
  // Email Input's useInput hook

  const {
    value: enteredEmail,
    isValid: emailIsValid,
    hasError: emailInputHasError,
    errorText: emailInputErrorText,
    valueChangeHandler: emailInputChangeHandler,
    inputBlurHandler: emailInputBlurHandler,
    inputTouchHandler: emailInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isEmailValid(value)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Please enter an email" };
    } else {
      return {
        valid: false,
        errorText: "Please enter an valid email",
      };
    }
  });

  const {
    isSubmitting,
    requestResponse,
    show,
    sendPasswordResetEmail,
    hideToast,
  } = useContext(AuthContext);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = async () => {
    emailInputTouchHandler();
    if (!emailIsValid) {
      setTimeout(() => {
        emailInputRef.current!.focus();
      }, 0);
      return;
    }
    sendPasswordResetEmail(enteredEmail!);
  };

  return (
    <>
      {requestResponse && requestResponse.success && show && (
        <ToastModal
          variant="success"
          show={show}
          body={requestResponse.success}
          onClose={() => hideToast()}
        />
      )}
      {requestResponse && requestResponse.error && show && (
        <ToastModal
          variant="danger"
          show={show}
          body={requestResponse.error}
          onClose={() => hideToast()}
        />
      )}
      <form
        className="d-flex flex-column"
        style={{ gap: 16 }}
        onSubmit={submitHandler}
        noValidate
      >
        <div className={styles["form-controls"]}>
          <div
            className={`${styles.controls} ${
              emailInputHasError ? styles["invalid"] : ""
            }`}
          >
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              ref={emailInputRef}
              value={enteredEmail}
              onChange={emailInputChangeHandler}
              onBlur={emailInputBlurHandler}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["mail-icon"]}
            >
              <path
                d="M18.3333 4.99967C18.3333 4.08301 17.5833 3.33301 16.6666 3.33301H3.33329C2.41663 3.33301 1.66663 4.08301 1.66663 4.99967V14.9997C1.66663 15.9163 2.41663 16.6663 3.33329 16.6663H16.6666C17.5833 16.6663 18.3333 15.9163 18.3333 14.9997V4.99967ZM16.6666 4.99967L9.99996 9.16634L3.33329 4.99967H16.6666ZM16.6666 14.9997H3.33329V6.66634L9.99996 10.833L16.6666 6.66634V14.9997Z"
                fill="#7A52D3"
              />
            </svg>
            {emailInputHasError && (
              <p className={styles["error-text"]}>{emailInputErrorText}</p>
            )}
          </div>
        </div>
        <div
          className={`${styles["form-actions"]} ${
            isSubmitting ? styles.submitting : ""
          }`}
        >
          <button
            type="button"
            onMouseDown={(e) => {
              if (e.button === 0) {
                submitHandler();
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
