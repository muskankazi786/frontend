import { ChangeEvent, FocusEvent, useReducer } from "react";

type State = {
  value?: string;
  isTouched?: boolean;
  wordCount?: number;
};

type Action = { type: string; value?: string; count?: number };

const inputStateReducer = (state: State, action: Action) => {
  if (action.type === "INPUT") {
    return {
      value: action.value,
      isTouched: state.isTouched,
      wordCount: action.count,
    };
  }
  if (action.type === "BLUR") {
    return { isTouched: true, value: action.value, wordCount: action.count };
  }
  if (action.type === "TOUCH") {
    return { isTouched: true, value: state.value, wordCount: state.wordCount };
  }
  if (action.type === "RESET") {
    return { isTouched: false, value: "", wordCount: 0 };
  }
  return state;
};

const useTextArea = (
  validateValue: (inputValue: string | undefined) => {
    errorText?: string;
    valid?: boolean;
  },
  defaultValueWhileEditing?: string,
  defaultValueWordCountWhileEditing?: number
) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, {
    value: defaultValueWhileEditing || "",
    isTouched: false,
    wordCount: defaultValueWordCountWhileEditing || 0,
  });

  const result = validateValue(inputState.value);
  const valueIsValid = result.valid ? true : false;
  const hasError = !valueIsValid && inputState.isTouched;
  const errorText = !result.valid ? result.errorText : "";

  const valueChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "INPUT",
      value: e.target.value,
      count: e.target.value.length,
    });
  };

  const inputBlurHandler = (e: FocusEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "BLUR",
      value: e.target.value.trim(),
      count: e.target.value.trim().length,
    });
  };

  const inputTouchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const inputResetHandler = () => {
    dispatch({
      type: "RESET",
    });
  };
  return {
    value: inputState.value,
    wordCount: inputState.wordCount,
    isValid: valueIsValid,
    hasError,
    errorText,
    valueChangeHandler,
    inputBlurHandler,
    inputTouchHandler,
    inputResetHandler,
    // reset,
  };
};

export default useTextArea;
