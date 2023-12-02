import styles from "../../../styles/SignInProvider.module.css";

const SignInWithApple = () => {
  return (
    <div className={styles["sign-in-ctnr"]}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.0499 20.28C16.0699 21.23 14.9999 21.08 13.9699 20.63C12.8799 20.17 11.8799 20.15 10.7299 20.63C9.28992 21.25 8.52992 21.07 7.66992 20.28C2.78992 15.25 3.50992 7.59 9.04992 7.31C10.3999 7.38 11.3399 8.05 12.1299 8.11C13.3099 7.87 14.4399 7.18 15.6999 7.27C17.2099 7.39 18.3499 7.99 19.0999 9.07C15.9799 10.94 16.7199 15.05 19.5799 16.2C19.0099 17.7 18.2699 19.19 17.0399 20.29L17.0499 20.28V20.28ZM12.0299 7.25C11.8799 5.02 13.6899 3.18 15.7699 3C16.0599 5.58 13.4299 7.5 12.0299 7.25Z"
          fill="black"
        />
      </svg>

      <button>Continue with Apple</button>
    </div>
  );
};

export default SignInWithApple;
