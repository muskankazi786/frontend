import styles from "../../styles/AuthorizationForm.module.css";

const SignUp = (props: { onClick: () => void }) => {
  const { onClick } = props;

  return (
    <form className="d-flex flex-column" style={{ gap: 16 }}>
      <div className={styles["form-controls"]}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles["input-icon"]}
        >
          <path
            d="M18.3333 4.99967C18.3333 4.08301 17.5833 3.33301 16.6666 3.33301H3.33329C2.41663 3.33301 1.66663 4.08301 1.66663 4.99967V14.9997C1.66663 15.9163 2.41663 16.6663 3.33329 16.6663H16.6666C17.5833 16.6663 18.3333 15.9163 18.3333 14.9997V4.99967ZM16.6666 4.99967L9.99996 9.16634L3.33329 4.99967H16.6666ZM16.6666 14.9997H3.33329V6.66634L9.99996 10.833L16.6666 6.66634V14.9997Z"
            fill="#7A52D3"
          />
        </svg>
      </div>

      <div className={styles["form-actions"]}>
        <button onClick={onClick}>Next</button>
      </div>
    </form>
  );
};

export default SignUp;
