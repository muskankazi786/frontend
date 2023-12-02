import styles from "../../styles/FAQS.module.css";

const FAQS = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ gap: 16, position: "relative" }}
    >
      <div className={styles.label}>FAQs</div>
    </div>
  );
};

export default FAQS;
