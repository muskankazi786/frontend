import styles from "../../styles/CreateAnAccount.module.css";
import SignInWithApple from "./SignInProvider/SignInWithApple";
import SignInWithFacebook from "./SignInProvider/SignInWithFacebook";
import SignInWithGoogle from "./SignInProvider/SignInWithGoogle";

const CreateAnAccount = (props: { onClick: () => void }) => {
  const { onClick } = props;

  return (
    <div className="d-flex flex-column" style={{ gap: 23 }}>
      <div className={styles["continue-wth-email"]}>
        <button onClick={onClick}>Continue with Email</button>
      </div>
      <div className={styles.or}>or</div>
      <div className="d-flex flex-column" style={{ gap: 8 }}>
        <SignInWithApple />
        <SignInWithGoogle />
        <SignInWithFacebook />
      </div>
    </div>
  );
};

export default CreateAnAccount;
