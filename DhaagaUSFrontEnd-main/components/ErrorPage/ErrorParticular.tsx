import styles from "../../styles/ErrorParticular.module.css";

const ErrorParticular = (props: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const { error, resetErrorBoundary } = props;

  return (
    <div className={styles["error-container"]}>
      <h3>{error.message}</h3>
      <div className={styles.actions}>
        <button onClick={() => resetErrorBoundary()}>Retry</button>
      </div>
    </div>
  );
};

export default ErrorParticular;
