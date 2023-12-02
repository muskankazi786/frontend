import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";

import styles from "../../styles/ErrorModal.module.css";

const ErrorModal = ({
  error,
  ...otherProps
}: {
  show: boolean;
  onHide: () => void;
  error: string;
}) => {
  const router = useRouter();

  return (
    <Modal
      {...otherProps}
      dialogClassName={styles["custom-modal"]}
      aria-labelledby="example-custom-modal-styling-title"
      backdrop="static"
    >
      <Modal.Header className={styles["custom-modal-header"]}>
        <h2>An error occured!</h2>
      </Modal.Header>
      <Modal.Body className={styles["custom-modal-body"]}>
        <p>Could not retrieve user subscription information</p>
        <div className={styles.actions}>
          <button onClick={() => router.push(router.pathname)}>Retry</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ErrorModal;
