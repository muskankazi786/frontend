import { ChangeEvent, useContext, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";

import usePhoneInput from "@/hooks/usePhoneInput";
import useInput from "@/hooks/useInput";

import styles from "../../styles/EditUserInfoForm.module.css";

import {
  isNotEmpty,
  isNotMoreThanSaidLimit,
} from "@/utils/validation/conditions";
import { editUserContext } from "@/context/edit-user-context";

const EditUserInfoForm = (props: {
  fromAccountInfoTab: boolean;
  user: any;
  onCancel: () => void;
}) => {
  const { fromAccountInfoTab, onCancel, user } = props;

  let phoneNumberWithoutCode;
  let phoneCode;
  if (user?.phone) {
    phoneNumberWithoutCode = user?.phone?.substring(2);
    phoneCode = user?.phone?.substring(0, 2);
  }

  // Username Input's useInput hook

  const {
    value: enteredUsernameName,
    isValid: usernameIsValid,
    hasError: usernameInputHasError,
    errorText: usernameInputErrorText,
    valueChangeHandler: usernameInputChangeHandler,
    inputBlurHandler: usernameInputBlurHandler,
    inputTouchHandler: usernameInputTouchHandler,
  } = useInput((value: string | undefined) => {
    if (isNotEmpty(value) && isNotMoreThanSaidLimit(value, 35)) {
      return { valid: true };
    } else if (!isNotEmpty(value)) {
      return { valid: false, errorText: "Username must not be empty" };
    } else {
      return {
        valid: false,
        errorText: "Username must be at most 35 characters",
      };
    }
  }, user?.username || user?.email);

  // Phone Number Input's usePhoneInputHook

  const {
    enteredPhoneNumber,
    phoneNumberIsValid,
    phoneNumberInputHasError,
    phoneNumberInputErrorText,
    phoneNumberInputChangeHandler,
    phoneNumberInputBlurHandler,
    phoneNumberInputTouchHandler,
  } = usePhoneInput(phoneNumberWithoutCode);

  // const [enteredPhoneNumber, setEnteredPhoneNumber] = useState(
  //   phoneNumberWithoutCode  || ""
  // );
  const [enteredPhoneCode, setEnteredPhoneCode] = useState(phoneCode || "+1");
  const [phoneNumberWithCode, setPhoneNumberWithCode] = useState(
    user?.phone || ""
  );
  // const [usernameInputValue, setUsernameInputValue] = useState<string>(
  //   user.username || user.email
  // );

  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, sendEditRequest } = useContext(editUserContext);

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

  const submitHandler = () => {
    if (fromAccountInfoTab) {
      phoneNumberInputTouchHandler();
      if (!phoneNumberIsValid) {
        setTimeout(() => {
          phoneNumberInputRef.current?.focus();
        }, 0);
        return;
      } else {
        sendEditRequest(undefined, phoneNumberWithCode);
      }
    } else {
      usernameInputTouchHandler();
      if (!usernameIsValid) {
        setTimeout(() => {
          usernameInputRef.current?.focus();
        }, 0);
        return;
      } else {
        sendEditRequest(enteredUsernameName?.trim(), undefined);
      }
    }
  };

  return (
    <>
      <form className={styles.form}>
        {fromAccountInfoTab && (
          <div
            className={`${styles.controls} ${styles["phone-nmbr"]} ${
              phoneNumberInputHasError ? styles["invalid"] : ""
            }`}
          >
            <PatternFormat
              format="(###) ###-####"
              getInputRef={phoneNumberInputRef}
              value={phoneNumberWithoutCode}
              onValueChange={(values, sourceInfo) => {
                if (sourceInfo.source === "event") {
                  phoneNumberInputHandler(undefined, values.value);
                }
              }}
              onBlur={() => phoneNumberInputBlurHandler()}
              autoFocus
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
        )}

        {!fromAccountInfoTab && (
          <div
            className={`${styles.controls} ${styles["svg-control"]} ${
              usernameInputHasError ? styles["invalid"] : ""
            }`}
          >
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              ref={usernameInputRef}
              value={enteredUsernameName}
              onChange={usernameInputChangeHandler}
              onBlur={usernameInputBlurHandler}
              autoFocus
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99967 3.33301C10.8837 3.33301 11.7316 3.6842 12.3567 4.30932C12.9818 4.93444 13.333 5.78229 13.333 6.66634C13.333 7.5504 12.9818 8.39824 12.3567 9.02336C11.7316 9.64849 10.8837 9.99967 9.99967 9.99967C9.11562 9.99967 8.26777 9.64849 7.64265 9.02336C7.01753 8.39824 6.66634 7.5504 6.66634 6.66634C6.66634 5.78229 7.01753 4.93444 7.64265 4.30932C8.26777 3.6842 9.11562 3.33301 9.99967 3.33301ZM9.99967 4.99967C9.55765 4.99967 9.13372 5.17527 8.82116 5.48783C8.5086 5.80039 8.33301 6.22431 8.33301 6.66634C8.33301 7.10837 8.5086 7.53229 8.82116 7.84485C9.13372 8.15741 9.55765 8.33301 9.99967 8.33301C10.4417 8.33301 10.8656 8.15741 11.1782 7.84485C11.4907 7.53229 11.6663 7.10837 11.6663 6.66634C11.6663 6.22431 11.4907 5.80039 11.1782 5.48783C10.8656 5.17527 10.4417 4.99967 9.99967 4.99967ZM9.99967 10.833C12.2247 10.833 16.6663 11.9413 16.6663 14.1663V16.6663H3.33301V14.1663C3.33301 11.9413 7.77467 10.833 9.99967 10.833ZM9.99967 12.4163C7.52467 12.4163 4.91634 13.633 4.91634 14.1663V15.083H15.083V14.1663C15.083 13.633 12.4747 12.4163 9.99967 12.4163Z"
                fill="#7A52D3"
              />
            </svg>
            {usernameInputHasError && (
              <p className={styles["error-text"]}>{usernameInputErrorText}</p>
            )}
          </div>
        )}

        <div
          className={`${styles.actions} justify-content-end ${
            !fromAccountInfoTab ? styles["small-btn"] : ""
          } ${isLoading ? styles["loading"] : ""}`}
        >
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            onMouseDown={() => submitHandler()}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditUserInfoForm;
