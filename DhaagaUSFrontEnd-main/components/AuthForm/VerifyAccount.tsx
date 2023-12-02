import styles from "../../styles/VerifyAccount.module.css";

const VerifyAccount = () => {
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={submitHandler}>
      <div className={styles["form-controls"]}>
        <label htmlFor="otp">Enter 4 digit OTP</label>
        <div className="d-flex" style={{ gap: 8 }}>
          <input type="text" name="otp" id="otp" maxLength={1} />
          <input type="text" name="otp-two" id="otp-two" maxLength={1} />
          <input type="text" name="otp-three" id="otp-three" maxLength={1} />
          <input type="text" name="otp-four" id="otp-four" maxLength={1} />
        </div>
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ gap: 8, marginTop: 16 }}
      >
        <div className={styles["dnt-rcv"]}>Didn’t receive the code?</div>
        <button className={styles["rsnd-code"]}>Resend Code</button>
      </div>
      <div className={styles["form-actions"]}>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default VerifyAccount;
