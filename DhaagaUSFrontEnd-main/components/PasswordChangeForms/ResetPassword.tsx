import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";

import useInput from "@/hooks/useInput";

import styles from "../../styles/PasswordChangeForms.module.css";

import { AuthContext } from "@/context/auth-context";
import {
  isConfirmPasswordValid,
  isNotEmpty,
  isPasswordValid,
} from "@/utils/validation/conditions";
import ToastModal from "../ToastModal/ToastModal";

const ResetPasswordForm = () => {
  // New password input's useInput hook

  const {
    value: enteredNewPassword,
    isValid: newPasswordIsValid,
    hasError: newPasswordInputHasError,
    errorText: newPasswordInputErrorText,
    valueChangeHandler: newPasswordInputChangeHandler,
    inputBlurHandler: newPasswordInputBlurHandler,
    inputTouchHandler: newPasswordInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isPasswordValid(value, 6)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Please enter your new password" };
    } else {
      return {
        valid: false,
        errorText: "Password length must be at least 6 characters",
      };
    }
  });

  // Confirm password input's useInput hook

  const {
    value: enteredConfirmNewPassword,
    isValid: confirmNewPasswordIsValid,
    hasError: confirmNewPasswordInputHasError,
    errorText: confirmNewPasswordInputErrorText,
    valueChangeHandler: confirmNewPasswordInputChangeHandler,
    inputBlurHandler: confirmNewPasswordInputBlurHandler,
    inputTouchHandler: confirmNewPasswordInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (
      isNotEmpty(value) &&
      isConfirmPasswordValid(value, enteredNewPassword)
    ) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Please enter your confirm password" };
    } else {
      return {
        valid: false,
        errorText: "New passwords don't match.",
      };
    }
  });

  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [confirmNewPasswordShow, setConfirmNewPasswordShow] = useState(false);

  const {
    isSubmitting,
    requestResponse,
    show,
    confirmPasswordReset,
    hideToast,
  } = useContext(AuthContext);

  const router = useRouter();

  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordInputRef = useRef<HTMLInputElement>(null);

  const passwordVisibilityToggleHandler = (
    id: "newPassword" | "confirmNewPassword"
  ) => {
    if (id === "newPassword") {
      if (!newPasswordShow) {
        setNewPasswordShow(!newPasswordShow);
        newPasswordInputRef.current!.type = "text";
      } else {
        setNewPasswordShow(!newPasswordShow);
        newPasswordInputRef.current!.type = "password";
      }
    } else {
      if (!confirmNewPasswordShow) {
        setConfirmNewPasswordShow(!confirmNewPasswordShow);
        confirmNewPasswordInputRef.current!.type = "text";
      } else {
        setConfirmNewPasswordShow(!confirmNewPasswordShow);
        confirmNewPasswordInputRef.current!.type = "password";
      }
    }
  };

  const submitHandler = async () => {
    newPasswordInputTouchHandler();
    confirmNewPasswordInputTouchHandler();
    if (!newPasswordIsValid) {
      setTimeout(() => {
        newPasswordInputRef.current!.focus();
      }, 0);
      return;
    }
    if (!confirmNewPasswordIsValid) {
      setTimeout(() => {
        confirmNewPasswordInputRef.current!.focus();
      }, 0);
      return;
    }
    const oobCode = router.query.oobCode;
    confirmPasswordReset(oobCode as string, enteredNewPassword!);
  };

  return (
    <>
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
            className={`${styles.controls}  ${
              newPasswordInputHasError ? styles["invalid"] : ""
            }`}
          >
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              style={{ paddingRight: 48 }}
              placeholder="New password"
              ref={newPasswordInputRef}
              value={enteredNewPassword}
              onChange={newPasswordInputChangeHandler}
              onBlur={newPasswordInputBlurHandler}
            />
            <span
              className={styles["visibility-toggle"]}
              onClick={passwordVisibilityToggleHandler.bind(
                null,
                "newPassword"
              )}
            >
              {!newPasswordShow ? "Show" : "Hide"}
            </span>
            {newPasswordInputHasError && (
              <p className={styles["error-text"]}>
                {newPasswordInputErrorText}
              </p>
            )}
          </div>
          <div
            className={`${styles.controls}  ${
              confirmNewPasswordInputHasError ? styles["invalid"] : ""
            }`}
          >
            <label htmlFor="confirmNewPassword">Confirm new password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              style={{ paddingRight: 48 }}
              placeholder="Confirm password"
              ref={confirmNewPasswordInputRef}
              value={enteredConfirmNewPassword}
              onChange={confirmNewPasswordInputChangeHandler}
              onBlur={confirmNewPasswordInputBlurHandler}
            />
            <span
              className={styles["visibility-toggle"]}
              onClick={passwordVisibilityToggleHandler.bind(
                null,
                "confirmNewPassword"
              )}
            >
              {!confirmNewPasswordShow ? "Show" : "Hide"}
            </span>
            {confirmNewPasswordInputHasError && (
              <p className={styles["error-text"]}>
                {confirmNewPasswordInputErrorText}
              </p>
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

export default ResetPasswordForm;
