import styles from "@/styles/LandingPage.module.css";
import Image from "next/image";

const UsersFeaturesSection = (props: { onShow: () => void }) => {
  const { onShow } = props;

  return (
    <section className={`site-container ${styles["users-features-section"]}`}>
      <div className="row">
        <div className="col-12 col-xl-6">
          <div
            className={`${styles["users-features-column"]} ${styles["users-features-mockup-column"]} position-relative`}
          >
            <Image
              src="/static/images/users-features-mockup.png"
              alt=""
              width={616}
              height={570}
            />
            <div className={styles["users-features-mockup-bg"]}></div>
          </div>
        </div>
        <div className="col">
          <div
            className={`${styles["users-features-column"]} ${styles["users-features-detail-column"]}`}
          >
            <div className={styles["title-label"]}>Features</div>
            <div className={styles["section-title"]}>
              For <span className={styles["purple-text"]}>Desi Users</span>
            </div>

            <ul>
              <li>
                {" "}
                Get the best desi experience at Dhaaga, your one place for all
                desi needs.{" "}
              </li>
              <li> One stop App for all desi needs. </li>
              <li>
                {" "}
                Restaurant, henna, desi salon, roommates, homemade food and many
                more.{" "}
              </li>
              <li>
                {" "}
                Ratings and reviews from fellow Desis to help find best among
                available options.{" "}
              </li>
            </ul>

            <div className={styles["get-app-title"]}>
              Get the App & Join Dhaaga.
            </div>

            <div
              className={`d-flex flex-sm-row flex-column`}
              style={{ gap: "12px" }}
            >
              <button className={styles["join-btn"]} onClick={onShow}>
                Join Dhaaga
              </button>
              {/* <a href="#">
                <Image
                  src="/static/images/app-store.svg"
                  alt=""
                  width={166}
                  height={48}
                />
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div className={`${styles['users-features-column']} ${styles['users-features-mockup-column']} position-relative`}>
        <Image
          src="/static/images/users-features-mockup.png"
          alt=""
          width={616}
          height={570}
        />
        <div className={styles['users-features-mockup-bg']}></div>
      </div> */}
      {/* <div
        className={`${styles["users-features-column"]} ${styles["users-features-detail-column"]}`}
      >
        <div className={styles["title-label"]}>Features</div>
        <div className={styles["section-title"]}>
          For <span className={styles["purple-text"]}>Desi Users</span>
        </div>

        <ul>
          <li>
            {" "}
            Get the best desi experience at Dhaaga, your one place for all desi
            needs.{" "}
          </li>
          <li> One stop App for all desi needs. </li>
          <li>
            {" "}
            Restaurant, henna, desi salon, roommates, homemade food and many
            more.{" "}
          </li>
          <li>
            {" "}
            Ratings and reviews from fellow Desis to help find best among
            available options.{" "}
          </li>
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
      </div> */}
    </section>
  );
};

export default UsersFeaturesSection;
