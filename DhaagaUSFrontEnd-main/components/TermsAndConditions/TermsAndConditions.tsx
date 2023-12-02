import styles from "../../styles/TermsAndConditions.module.css";

const TermsAndConditions = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ gap: 16, position: "relative" }}
    >
      <div className={styles.label}>Terms And Conditions</div>
    </div>
  );
};

export default TermsAndConditions;
