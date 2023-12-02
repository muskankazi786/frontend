import styles from "@/styles/LandingPage.module.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterSection = () => {


  return (
    <section className={styles["footer-section"]}>
      <section className={`site-container ${styles["footer-row"]}`}>
        <div className="row gap-5 gap-xl-0">
          <div className="col-12 col-xl-6 p-0">
            <div
              className="d-flex justify-content-around justify-content-md-center justify-content-xl-start align-items-center"
              style={{ gap: "24px" }}
            >
              <Image
                src="/static/images/logo-circle.svg"
                alt=""
                height={150}
                width={150}
              />
              <div>
                <div className={styles["footer-description"]}>
                  Our mission is to help connect Desis in overseas with avail
                  all the Desi stuff easily on fingertips.
                </div>
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
            </div>
          </div>
          <div className="col p-0">
            <div
              className={`${styles["footer-links-row"]} d-flex flex-wrap flex-sm-nowrap justify-content-around justify-content-xxl-start`}
            >
              <div>
                <div className={styles["footer-link-title"]}>Company</div>
                <Link href="/Works">
                <div className={styles["footer-link-container"]}>
                  <a href="#" className={styles["footer-link"]}>
                    {" "}
                    How it works?{" "}
                  </a>
                </div>
                </Link>
                <Link href="/ForBusiness">
                <div className={styles["footer-link-container"]}>
                  <a href="#" className={styles["footer-link"]}>
                    {" "}
                    For Business{" "} 
                  </a>
                </div>
                </Link>
                <Link href="/ForUsers">
                <div className={styles["footer-link-container"]}>
                  <a href="#" className={styles["footer-link"]}>
                    {" "}
                    For Users{" "}
                  </a>
                </div>
                </Link>
              </div>

              <div>
                <div className={styles["footer-link-title"]}>Support</div>

                <Link href="/FAQS">
                  <div className={styles["footer-link-container"]}>
                    <a href="#" className={styles["footer-link"]}>
                      {" "}
                      FAQ{" "}
                    </a>
                  </div>
                </Link>
                <Link href="/ContactUS">
                <div className={styles["footer-link-container"]}>
                  <a href="#" className={styles["footer-link"]}>
                    {" "}
                    Contact US{" "} 
                  </a>
                </div>
                </Link>
                <Link href="/PrivacyPolicy">
                <div className={styles["footer-link-container"]}>
                  <a href="#" className={styles["footer-link"]}>
                    {" "}
                    Privacy Policy{" "}
                  </a>
                </div>
                </Link>
              </div>
            
              <div>
                <div className={styles["footer-link-title"]}>Follow Us</div>
                
                <div
                  className={`${styles["footer-social-link-container"]} d-flex`}
                >
                  <a
                    href="#"
                    className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
                  >
                    <Image
                      src="/static/icon/facebook-icon.svg"
                      alt=""
                      height={28}
                      width={28}
                    />
                  </a>
                  <a
                    href="#"
                    className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
                  >
                    <Image
                      src="/static/icon/twitter-icon.svg"
                      alt=""
                      height={28}
                      width={28}
                    />
                  </a>
                  <a
                    href="#"
                    className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
                  >
                    <Image
                      src="/static/icon/instagram-icon.svg"
                      alt=""
                      height={28}
                      width={28}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div
          className="d-flex flex-column flex-md-row align-items-center"
          style={{ gap: "24px" }}
        >
          <Image
            src="/static/images/logo-circle.svg"
            alt=""
            height={150}
            width={150}
          />
          <div>
            <div className={styles["footer-description"]}>
              Our mission is to help connect Desis in overseas with avail all
              the Desi stuff easily on fingertips.
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

        <div
          className={`${styles["footer-links-row"]} d-flex flex-column flex-md-row`}
        >
          <div>
            <div className={styles["footer-link-title"]}>Company</div>

            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                How it works?{" "}
              </a>
            </div>
            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                For Business{" "}
              </a>
            </div>
            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                For Users{" "}
              </a>
            </div>
          </div>

          <div>
            <div className={styles["footer-link-title"]}>Support</div>

            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                FAQ{" "}
              </a>
            </div>
            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                Contact US{" "}
              </a>
            </div>
            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                Privacy Policy{" "}
              </a>
            </div>
            <div className={styles["footer-link-container"]}>
              <a href="#" className={styles["footer-link"]}>
                {" "}
                Feedback{" "}
              </a>
            </div>
          </div>

          <div>
            <div className={styles["footer-link-title"]}>Follow Us</div>

            <div className={`${styles["footer-social-link-container"]} d-flex`}>
              <a
                href="#"
                className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
              >
                <Image
                  src="/static/icon/facebook-icon.svg"
                  alt=""
                  height={28}
                  width={28}
                />
              </a>
              <a
                href="#"
                className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
              >
                <Image
                  src="/static/icon/twitter-icon.svg"
                  alt=""
                  height={28}
                  width={28}
                />
              </a>
              <a
                href="#"
                className={`${styles["footer-social-link"]} d-flex align-items-center justify-content-center`}
              >
                <Image
                  src="/static/icon/instagram-icon.svg"
                  alt=""
                  height={28}
                  width={28}
                />
              </a>
            </div>
          </div>
        </div> */}
      </section>

      <section className={styles["footer-copyright-section"]}>
        Copyright © 2022 Dhaaga LLC. All rights reserved
      </section>
    </section>
  );
};

export default FooterSection;
