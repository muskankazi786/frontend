import styles from "../../styles/AboutUs.module.css";

const AboutUs = () => {
  return (
    <div
      className="d-flex flex-column"
      style={{ gap: 16, position: "relative" }}
    >
      <div className={styles.label}>About Us</div>
    </div>
  );
};

export default AboutUs;
