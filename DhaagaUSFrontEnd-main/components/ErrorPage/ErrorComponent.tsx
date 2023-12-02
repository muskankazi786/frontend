import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/ErrorPage.module.css";

import useNavigatorOnLine from "@/hooks/useNavigatorOnline";

const ErrorComponent = (props: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  const [firstRender, setFirstRender] = useState(false);

  const router = useRouter();

  const status = useNavigatorOnLine();

  const { error, resetErrorBoundary } = props;

  useEffect(() => {
    setFirstRender(true);
  }, []);

  useEffect(() => {
    if (!firstRender) {
      return;
    }
    if (status) {
      resetErrorBoundary();
    }
  }, [status]);

  const pathname = router.pathname;
  return (
    <div className={styles["error"]}>
      <div>
        <div className={styles.oops}>
          <div>O</div>
          <div>O</div>
          <div>P</div>
          <div>S</div>
          <div>!</div>
        </div>
        <h3>There was a problem</h3>
        <h1>{error.message}</h1>
        <div className={styles.actions}>
          <button
            onClick={() => {
              resetErrorBoundary();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
