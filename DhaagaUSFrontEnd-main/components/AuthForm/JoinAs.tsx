import styles from "../../styles/JoinAs.module.css";

const JoinAs = (props: {
  onBusinessClick: () => void;
  onCustomerClick: () => void;
  changeMode: (login: boolean) => void;
}) => {
  const { onBusinessClick, onCustomerClick, changeMode } = props;

  return (
    <div className="d-flex flex-column" style={{ gap: 12 }}>
      <button className={styles["join-as-business"]} onClick={onBusinessClick}>
        Join as a Business
      </button>
      <button className={styles["join-as-customer"]} onClick={onCustomerClick}>
        Join as a Customer
      </button>
      <button
        className={styles["already-have-acc"]}
        onClick={changeMode.bind(null, true)}
      >
        Already have an account? Log In
      </button>
    </div>
  );
};

export default JoinAs;
