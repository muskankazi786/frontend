import styles from "@/styles/LandingPage.module.css";
import Image from "next/image";

const CommunitySection = () => {
  return (
    <section
      className={`site-container ${styles["products-and-services-section"]} ${styles["custom-padding-class"]} d-flex flex-column flex-lg-row`}
    >
      <div
        className={`${styles["products-services-column"]} ${styles["review-image-column"]} d-flex justify-content-center`}
      >
        <div className="position-relative">
          <Image
            src="/static/images/review-section-image.png"
            alt=""
            width={516}
            height={429}
            className={styles["products-services-column-image"]}
          />
          <Image
            src="/static/images/ratings-box.svg"
            className={styles["ratings-image"]}
            alt=""
            width={224}
            height={56}
          />
        </div>
      </div>

      <div
        className={`${styles["products-services-column"]} ${styles["review-details-column"]} ${styles["custom-padding-class-product-service-column"]}`}
      >
        <div className={styles["title-label"]}>Review</div>
        <div className={styles["section-title"]}>
          Help Our <span className={styles["purple-text"]}>Community</span>{" "}
          <br /> To Grow
        </div>
        <div
          className={`${styles["section-description"]} mb-0`}
          style={{ maxWidth: "490px" }}
        >
          Your review matters a lot. Don’t forget to leave a review for any
          business that you use, so you can help your fellow desis and become a
          Dhaaga star. Together, we should and will help our community grow.
        </div>

        <div className={styles["get-app-title"]}>Download the FREE app!</div>

        <div
          className={`${styles["app-link-container"]} d-flex flex-md-row flex-column`}
          style={{ gap: "12px" }}
        >
          <a href="#">
            <Image
              src="/static/images/google-play-app.svg"
              alt=""
              width={166}
              height={48}
            />
          </a>
          <a href="#">
            <Image
              src="/static/images/app-store.svg"
              alt=""
              width={166}
              height={48}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
