export const isNotEmpty = (inputValue: string | undefined) => {
  return inputValue !== "";
};

export const isNotMoreThanSaidLimit = (
  inputValue: string | undefined,
  conditionValue: number
) => {
  return inputValue!.trim().length <= conditionValue;
};

export const isPasswordValid = (
  value: string | undefined,
  conditionValue: number
) => {
  return value!.length >= conditionValue;
};

export const isConfirmPasswordValid = (
  confirmPassword: string | undefined,
  password: string | undefined
) => {
  return confirmPassword === password;
};

export const isAsSaidLength = (
  value: string | undefined,
  conditionValue: number
) => {
  return value!.trim().length === conditionValue;
};

export const isValueWithinArray = (
  selectedValue: string | undefined,
  options: string[]
) => {
  return options.includes(selectedValue!);
};

export const isValidUrl = (url: string | undefined) => {
  return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
    url!
  );
};

export const isEmailValid = (email: string | undefined) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email!);
};

export const categories = [
  "restaurants",
  "henna",
  "roomMates",
  "homeFood",
  "clothing",
  "jewelry",
  "salon",
  "grocery",
];
