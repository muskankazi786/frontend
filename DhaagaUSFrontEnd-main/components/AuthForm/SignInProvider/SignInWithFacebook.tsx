import styles from "../../../styles/SignInProvider.module.css";

const SignInWithFacebook = () => {
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
          d="M21 12C21 7.02947 16.9705 3 12 3C7.02947 3 3 7.0294 3 12C3 16.4921 6.29119 20.2155 10.5938 20.8907V14.6016H8.30859V12H10.5938V10.0172C10.5938 7.76156 11.9374 6.51562 13.9931 6.51562C14.9779 6.51562 16.0078 6.69141 16.0078 6.69141V8.90625H14.873C13.7549 8.90625 13.4062 9.60002 13.4062 10.3118V12H15.9023L15.5033 14.6016H13.4062V20.8907C17.7088 20.2155 21 16.4922 21 12Z"
          fill="#1877F2"
        />
        <path
          d="M15.5033 14.6016L15.9023 12H13.4062V10.3118C13.4062 9.59995 13.7549 8.90625 14.873 8.90625H16.0078V6.69141C16.0078 6.69141 14.9779 6.51562 13.9931 6.51562C11.9374 6.51562 10.5938 7.76156 10.5938 10.0172V12H8.30859V14.6016H10.5938V20.8907C11.0589 20.9636 11.5291 21.0001 12 21C12.4709 21.0001 12.9411 20.9636 13.4062 20.8907V14.6016H15.5033Z"
          fill="white"
        />
      </svg>

      <button>Continue with Facebook</button>
    </div>
  );
};

export default SignInWithFacebook;