import Image from "next/image";
import styles from "../../styles/LandingPage.module.css";

const TargetAudienceSection = () => {
  return (
    <section
      className={`site-container ${styles["target-audience-section"]} ${styles["custom-padding-class"]}`}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-12 p-0 d-flex align-items-center">
            <div
              className={`${styles["custom-gap"]} d-flex flex-column flex-sm-row flex-grow-1 offset-0 offset-sm-1 offset-md-2 offset-lg-0`}
            >
              <div
                className={`${styles["P-0"]} d-flex flex-column align-items-start align-items-sm-end`}
                style={{ gap: "10px", paddingTop: "64px" }}
              >
                <div className={`${styles["target-audience-image-container"]}`}>
                  <div
                    className={`${styles["target-audience-image"]}`}
                    style={{
                      backgroundImage: "url(/static/images/homemade-food.png)",
                    }}
                  ></div>
                  <div
                    className={`${styles["target-audience-image-label"]} d-flex align-items-center justify-content-center`}
                  >
                    Homemade Food
                  </div>
                </div>

                <div
                  className="d-flex align-self-end align-self-sm-start"
                  style={{ gap: "10px" }}
                >
                  <div
                    style={{
                      height: "100px",
                      width: "70px",
                      borderRadius: "20px",
                      backgroundColor: "var(--primary)",
                    }}
                  ></div>
                  <div
                    className={`${styles["target-audience-image-container"]} ${styles["small"]}`}
                  >
                    <div
                      className={`${styles["target-audience-image"]}`}
                      style={{
                        backgroundImage: "url(/static/images/roommates.png)",
                      }}
                    ></div>
                    <div
                      className={`${styles["target-audience-image-label"]} d-flex align-items-center justify-content-center`}
                    >
                      Roommates
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column" style={{ gap: "10px" }}>
                <div className="d-flex align-items-end" style={{ gap: "10px" }}>
                  <div
                    className={`${styles["target-audience-image-container"]} ${styles["small"]}`}
                  >
                    <div
                      className={`${styles["target-audience-image"]}`}
                      style={{
                        backgroundImage: "url(/static/images/grocery.png)",
                      }}
                    ></div>
                    <div
                      className={`${styles["target-audience-image-label"]} d-flex align-items-center justify-content-center`}
                    >
                      Grocery
                    </div>
                  </div>
                  <div
                    style={{
                      height: "45px",
                      width: "45px",
                      borderRadius: "12px",
                      backgroundColor: "var(--yellow)",
                    }}
                  ></div>
                </div>

                <div
                  className={`${styles["target-audience-image-container"]} align-self-end align-self-sm-start`}
                >
                  <div
                    className={`${styles["target-audience-image"]}`}
                    style={{
                      backgroundImage: "url(/static/images/desi-clothing.png)",
                    }}
                  ></div>
                  <div
                    className={`${styles["target-audience-image-label"]} d-flex align-items-center justify-content-center`}
                  >
                    Desi Clothing
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`col-lg-6 col-12 p-0 ${styles["custom-padding-for-target-audience-details-sec"]}`}
          >
            <div className={styles["title-label"]}>Grow your Desi Business</div>
            <div className={styles["section-title"]}>
              <div>On Dhaaga Target The</div>
              <div className={styles["purple-text"]}>Perfect Audience</div>
            </div>
            <div className={styles["section-description"]}>
              Whether you own a big business or a business from home, your reach
              to your target customers is most important for the success of your
              business.
            </div>

            <div className={`${styles["section-description"]} mb-0`}>
              Dhaaga helps you to plan, start and grow your small business.
              Start with creating a business account profile on Dhaaga and get
              the attention of thousands of desis in your neighborhood.
            </div>

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
