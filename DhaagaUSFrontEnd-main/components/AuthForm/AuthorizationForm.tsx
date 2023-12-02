import { ChangeEvent, useContext, useRef, useState } from "react";
import Link from "next/link";
import { PatternFormat } from "react-number-format";

import { AuthContext } from "@/context/auth-context";
import useInput from "@/hooks/useInput";
import usePhoneInput from "@/hooks/usePhoneInput";

import styles from "../../styles/AuthorizationForm.module.css";

import {
  isEmailValid,
  isNotEmpty,
  isNotMoreThanSaidLimit,
  isPasswordValid,
} from "@/utils/validation/conditions";

const AuthorizationForm = (props: {
  mode: { login: boolean; signUp: boolean };
  joinAsBusiness?: boolean;
  changeMode?: (login: boolean) => void;
}) => {
  // First Name Input's useInput hook

  const {
    value: enteredFirstname,
    isValid: firstnameIsValid,
    hasError: firstnameInputHasError,
    errorText: firstnameInputErrorText,
    valueChangeHandler: firstnameInputChangeHandler,
    inputBlurHandler: firstnameInputBlurHandler,
    inputTouchHandler: firstnameInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 35)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "First name must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "First name must be at most 35 characters",
      };
    }
  });

  // Last Name Input's useInput hook

  const {
    value: enteredLastname,
    isValid: lastnameIsValid,
    hasError: lastnameInputHasError,
    errorText: lastnameInputErrorText,
    valueChangeHandler: lastnameInputChangeHandler,
    inputBlurHandler: lastnameInputBlurHandler,
    inputTouchHandler: lastnameInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 35)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Last name must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "Last name must be at most 35 characters",
      };
    }
  });

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

  // Phone number Input's usePhoneInput hook

  const {
    enteredPhoneNumber,
    phoneNumberIsValid,
    phoneNumberInputHasError,
    phoneNumberInputErrorText,
    phoneNumberInputChangeHandler,
    phoneNumberInputBlurHandler,
    phoneNumberInputTouchHandler,
  } = usePhoneInput();

  // Password Input's useInputHook

  const {
    value: enteredPassword,
    isValid: passwordIsValid,
    hasError: passwordInputHasError,
    errorText: passwordInputErrorText,
    valueChangeHandler: passwordInputChangeHandler,
    inputBlurHandler: passwordInputBlurHandler,
    inputTouchHandler: passwordInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isPasswordValid(value, 6)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Please enter the password" };
    } else {
      return {
        valid: false,
        errorText: "Password length must be at least 6 characters",
      };
    }
  });

  const [enteredPhoneCode, setEnteredPhoneCode] = useState("+1");
  const [phoneNumberWithCode, setPhoneNumberWithCode] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);

  const firstnameInputRef = useRef<HTMLInputElement>(null);
  const lastnameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);

  const { isSubmitting, signIn, signUp } = useContext(AuthContext);

  const { mode, joinAsBusiness, changeMode } = props;

  const passwordVisibilityToggleHandler = () => {
    if (!passwordShow) {
      setPasswordShow(!passwordShow);
      passwordInputRef.current!.type = "text";
    } else {
      setPasswordShow(!passwordShow);
      passwordInputRef.current!.type = "password";
    }
  };

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

  const submitHandler = async () => {
    if (mode.signUp) {
      firstnameInputTouchHandler();
      lastnameInputTouchHandler();
    }
    emailInputTouchHandler();
    passwordInputTouchHandler();
    if (!firstnameIsValid && mode.signUp) {
      setTimeout(() => {
        firstnameInputRef.current!.focus();
      }, 0);
      return;
    } else if (!lastnameIsValid && mode.signUp) {
      setTimeout(() => {
        lastnameInputRef.current!.focus();
      }, 0);
      return;
    }
    if (!emailIsValid) {
      setTimeout(() => {
        emailInputRef.current!.focus();
      }, 0);
      return;
    } else if (!phoneNumberIsValid && mode.signUp) {
      setTimeout(() => {
        phoneNumberInputRef.current!.focus();
      }, 0);
      return;
    } else if (!passwordIsValid) {
      setTimeout(() => {
        passwordInputRef.current!.focus();
      }, 0);
      return;
    }

    if (mode.login) {
      const cred = {
        email: enteredEmail!,
        password: enteredPassword!,
      };
      signIn(cred);
    } else if (mode.signUp) {
      const cred = {
        firstname: enteredFirstname,
        lastname: enteredLastname,
        email: enteredEmail!,
        password: enteredPassword!,
        phone: phoneNumberWithCode,
      };
      signUp(cred, joinAsBusiness!);
    }
  };

  return (
    <form
      className="d-flex flex-column"
      style={{ gap: 16 }}
      onSubmit={submitHandler}
      noValidate
    >
      <div className={styles["form-controls"]}>
        {mode.signUp && (
          <>
            <div
              className={`${styles.controls}  ${
                firstnameInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Enter your firstname"
                ref={firstnameInputRef}
                value={enteredFirstname}
                onChange={firstnameInputChangeHandler}
                onBlur={firstnameInputBlurHandler}
              />
              {firstnameInputHasError && (
                <p className={styles["error-text"]}>
                  {firstnameInputErrorText}
                </p>
              )}
            </div>
            <div
              className={`${styles.controls}  ${
                lastnameInputHasError ? styles["invalid"] : ""
              }`}
            >
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Enter your lastname"
                ref={lastnameInputRef}
                value={enteredLastname}
                onChange={lastnameInputChangeHandler}
                onBlur={lastnameInputBlurHandler}
              />
              {lastnameInputHasError && (
                <p className={styles["error-text"]}>{lastnameInputErrorText}</p>
              )}
            </div>
          </>
        )}

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
        {mode.signUp && (
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
                onValueChange={(values, sourceInfo) => {
                  if (sourceInfo.source === "event") {
                    phoneNumberInputHandler(undefined, values.value);
                  }
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
        )}
        <div
          className={`${styles.controls}  ${
            passwordInputHasError ? styles["invalid"] : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            style={{ paddingRight: 48 }}
            placeholder="Enter your password"
            ref={passwordInputRef}
            value={enteredPassword}
            onChange={passwordInputChangeHandler}
            onBlur={passwordInputBlurHandler}
          />
          <span
            className={styles["visibility-toggle"]}
            onClick={passwordVisibilityToggleHandler}
          >
            {!passwordShow ? "Show" : "Hide"}
          </span>
          {passwordInputHasError && (
            <p className={styles["error-text"]}>{passwordInputErrorText}</p>
          )}
        </div>
      </div>

      {mode.login && (
        <div className={styles["links-container"]}>
          <Link href="forgot-password">Forgot password?</Link>
          <button onClick={changeMode?.bind(null, false)} type="button">
            Sign Up
          </button>
        </div>
      )}

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
          {!isSubmitting
            ? mode.signUp
              ? "Sign Up"
              : "Log In"
            : "Processing..."}
        </button>
      </div>
    </form>
  );
};

export default AuthorizationForm;
