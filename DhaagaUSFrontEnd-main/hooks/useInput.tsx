import { ChangeEvent, FocusEvent, useReducer } from "react";

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
    return {
      isTouched: true,
      value: action.value,
    };
  }
  if (action.type === "UPDATE") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "TOUCH") {
    return { isTouched: true, value: state.value };
  } //   if (action.type === "RESET") {
  //     return { isTouched: false, value: "" };
  //   }
  return state;
};

const useInput = (
  validateValue: (inputValue: string | undefined) => {
    errorText?: string;
    valid?: boolean;
  },
  defaultValueWhileEditing?: string
) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    value: defaultValueWhileEditing || "",
    isTouched: false,
  });

  const result = validateValue(inputState.value);
  const valueIsValid = result.valid ? true : false;
  const hasError = !valueIsValid && inputState.isTouched;
  const errorText = !result.valid ? result.errorText : "";

  const valueChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT", value: e.target.value });
  };

  const inputBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const type = e.target.type;
    let value;
    if (type === "email") {
      const trimmedValue = e.target.value;
      e.target.value = "";
      value = trimmedValue;
    } else if (type === "password") {
      value = e.target.value;
    } else {
      value = e.target.value.trim();
    }
    dispatch({
      type: "BLUR",
      value: value,
    });
  };

  const updateValueHandler = (value: string) => {
    dispatch({ type: "UPDATE", value });
  };

  const inputTouchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    errorText,
    valueChangeHandler,
    inputBlurHandler,
    updateValueHandler,
    inputTouchHandler,
    // reset,
  };
};

export default useInput;
