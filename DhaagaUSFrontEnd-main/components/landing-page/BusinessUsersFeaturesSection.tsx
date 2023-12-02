import styles from "@/styles/LandingPage.module.css";
import Image from "next/image";

const BusinessUsersFeaturesSection = (props: { onShow: () => void }) => {
  const { onShow } = props;

  return (
    <section
      className={`site-container ${styles["business-users-features-section"]}`}
    >
      <div
        className={`${styles["business-users-features-container"]} container-fluid`}
      >
        {/* <div className={styles["title-label"]}>Features</div>
        <div className={styles["section-title"]}>For Desi Business Owners</div>

        <ul>
          <li> Increase your reach among local desi community. </li>
          <li> Claim/verify your business. </li>
          <li>
            {" "}
            Manage your business information to ensure potential customers find
            you quicker.{" "}
          </li>
          <li> Respond to reviews </li>
          <li>
            {" "}
            Dhaaga helps you to plan, start, and grow your small business.{" "}
          </li>
          <li>
            {" "}
            Add photos to show your business features and attract the right
            customers.{" "}
          </li>
          <li> Bring your small business to life. </li>
        </ul>

        <div className={styles["get-app-title"]}>
          Get the App & Create a business account.
        </div>

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

        <div className={styles["business-features-right-box"]}></div>
        <Image
          src="/static/images/business-users-features-mockup.png"
          alt=""
          width={675}
          height={691}
          className={styles["business-features-mockup-image"]}
        /> */}
        <div className="row position-relative">
          <div className="col-12 col-xl-6 order-2 order-xl-1">
            <div className={styles["title-label"]}>Features</div>
            <div className={styles["section-title"]}>
              For Desi Business Owners
            </div>

            <ul>
              <li> Increase your reach among local desi community. </li>
              <li> Claim/verify your business. </li>
              <li>
                {" "}
                Manage your business information to ensure potential customers
                find you quicker.{" "}
              </li>
              <li> Respond to reviews </li>
              <li>
                {" "}
                Dhaaga helps you to plan, start, and grow your small business.{" "}
              </li>
              <li>
                {" "}
                Add photos to show your business features and attract the right
                customers.{" "}
              </li>
              <li> Bring your small business to life. </li>
            </ul>

            <div className={styles["get-app-title"]}>
              Create a business account.
            </div>

            <div
              className={`d-flex flex-sm-row flex-column`}
              style={{ gap: "12px" }}
            >
              <button
                className={styles["join-btn-business-users-feature"]}
                onClick={onShow}
              >
                Join Dhaaga
              </button>
            </div>
          </div>
          <div
            className={`${styles["business-features-box-img-container"]} col order-1 order-xl-2`}
          ></div>
        </div>
        <div className={`${styles["business-features-right-box"]}`}></div>
        <Image
          src="/static/images/business-users-features-mockup.png"
          alt=""
          width={675}
          height={691}
          className={`${styles["business-features-mockup-image"]}`}
        />
      </div>
    </section>
  );
};

export default BusinessUsersFeaturesSection;
