import ReactDOM from "react-dom";
import { Toast, ToastContainer } from "react-bootstrap";

import styles from "../../styles/ToastModal.module.css";

const FlashToast = (props: {
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  header?: string;
  body: string;
  show: boolean;
  onClose: () => void;
}) => {
  const { variant, header, body, show, onClose } = props;

  return (
    <ToastContainer
      position="bottom-start"
      className={styles["toast-container"]}
    >
      <Toast
        show={show}
        onClose={onClose}
        className="d-inline-block m-1"
        bg={variant}
        autohide
      >
        {header && (
          <Toast.Header className="justify-content-between">
            {header}
          </Toast.Header>
        )}
        <Toast.Body className="text-white">{body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

const ToastModal = (props: {
  variant:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  header?: string;
  body: string;
  show: boolean;
  onClose: () => void;
}) => {
  const { variant, header, body, show, onClose } = props;

  return ReactDOM.createPortal(
    <FlashToast
      variant={variant}
      header={header}
      body={body}
      show={show}
      onClose={onClose}
    />,
    document.getElementById("overlay-root") as HTMLElement
  );
};

export default ToastModal;
