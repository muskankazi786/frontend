import { useReducer } from "react";
import { isAsSaidLength, isNotEmpty } from "@/utils/validation/conditions";

type State = {
  value?: string;
  isTouched: boolean;
};

type Action = { type: string; value?: string };

const inputStateReducer = (state: State, action: Action) => {
  if (action.type === "INPUT") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "BLUR") {
    return { isTouched: true, value: state.value!.trim() };
  }
  if (action.type === "TOUCH") {
    return { isTouched: true, value: state.value };
  }
  //   if (action.type === "RESET") {
  //     return { isTouched: false, value: "" };
  //   }
  return state;
};

const usePhoneInput = (defaultValueWhileEditing?: string) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    value: defaultValueWhileEditing || "",
    isTouched: false,
  });

  const validateValue = (value: string | undefined) => {
    if (!isNotEmpty(value)) {
      return { valid: true };
    } else if (!isAsSaidLength(value, 10)) {
      return {
        valid: false,
        errorText: "Phone number must be of 10 digits",
      };
    } else {
      return { valid: true };
    }
  };

  const result = validateValue(inputState.value);
  const phoneNumberIsValid = result.valid ? true : false;
  const phoneNumberInputHasError = !phoneNumberIsValid && inputState.isTouched;
  const phoneNumberInputErrorText = !result.valid ? result.errorText : "";

  const phoneNumberInputChangeHandler = (value: string) => {
    dispatch({ type: "INPUT", value: value });
  };

  const phoneNumberInputBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };

  const phoneNumberInputTouchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  return {
    enteredPhoneNumber: inputState.value,
    phoneNumberIsValid,
    phoneNumberInputHasError,
    phoneNumberInputErrorText,
    phoneNumberInputChangeHandler,
    phoneNumberInputBlurHandler,
    phoneNumberInputTouchHandler,
    // reset,
  };
};

export default usePhoneInput;
