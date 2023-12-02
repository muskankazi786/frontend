import { ChangeEvent, FocusEvent, useReducer } from "react";

type State = {
  value?: string;
  isTouched: boolean;
};

type Action = { type: string; value?: string };

const inputStateReducer = (state: State, action: Action) => {
  if (action.type === "SELECT") {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === "BLUR") {
    return { isTouched: true };
  }
  //   if (action.type === "RESET") {
  //     return { isTouched: false, value: "" };
  //   }
  return state;
};
const useSelect = (
  validateValue: (inputValue: string | undefined) => {
    errorText?: string;
    valid?: boolean;
  },
  defaultValue: string
) => {
  const [selectState, dispatch] = useReducer(inputStateReducer, {
    value: defaultValue,
    isTouched: false,
  });

  const result = validateValue(selectState.value);
  const valueIsValid = result.valid ? true : false;
  const hasError = !valueIsValid && selectState.isTouched;
  const errorText = !result.valid ? result.errorText : "";

  const valueChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "INPUT", value: e.target.value });
  };

  const inputBlurHandler = (e: FocusEvent<HTMLSelectElement>) => {
    dispatch({ type: "BLUR" });
  };

  return {
    value: selectState.value,
    // isValid: valueIsValid,
    hasError,
    errorText,
    valueChangeHandler,
    inputBlurHandler,
  };
};

export default useSelect;
