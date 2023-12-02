import styles from "@/styles/LandingPage.module.css";
import Image from "next/image";

const ProductsAndServicesSetion = () => {
  return (
    <div className="position-relative">
      <section
        className={`site-container ${styles["products-and-services-section"]} ${styles["custom-padding-class"]} d-flex flex-column flex-lg-row`}
      >
        <div
          className={`${styles["products-services-column"]} ${styles["custom-padding-class-product-service-column"]} order-2 order-lg-1`}
        >
          <div className={styles["title-label"]}>Products & Services</div>
          <div className={styles["section-title"]}>
            Missing all{" "}
            <span className={styles["purple-text"]}>Desi Stuff</span> <br />
            Staying in US?
          </div>

          <div
            className={styles["section-description"]}
            style={{ maxWidth: "480px" }}
          >
            First time in the US or stayed here for a lifetime, missing all the
            desi stuff is normal.
          </div>
          <div
            className={`${styles["section-description"]} mb-0`}
            style={{ maxWidth: "480px" }}
          >
            Dhaaga is a platform that will make you feel at home. Henna,
            clothing, jewelry, homemade food, and many more options are just
            around the corner.
          </div>

          <div className={styles["get-app-title"]}>Download the FREE app!</div>

          <div
            className={`${styles["app-link-container"]} d-flex flex-sm-row flex-column`}
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

        <div
          className={`${styles["products-services-column"]} d-flex justify-content-center order-1 order-lg-2`}
        >
          <Image
            src="/static/images/product-and-services-image.png"
            alt=""
            width={516}
            height={429}
            className={styles["products-services-column-image"]}
          />
          <Image
            src="/static/images/products-services-side.png"
            alt=""
            width={172}
            height={392}
            className={styles["side-image"]}
          />
        </div>
      </section>
    </div>
  );
};

export default ProductsAndServicesSetion;
