import { useRouter } from "next/router";

import styles from "../../styles/ErrorPage.module.css";

const ErrorPage = (props: { message: string }) => {
  const router = useRouter();
  const { message } = props;

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
        <h1>{message}</h1>
        <div className={styles.actions}>
          <button
            onClick={() => {
              router.push(router.asPath);
            }}
          >
            Retry
          </button>
          {pathname !== "/home" && (
            <button
              onClick={() => {
                router.push("/home");
              }}
            >
              Go back home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
