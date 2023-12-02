import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../../styles/MainNavigation.module.css";

import NavbarModal from "../ModalOverlay/NavbarModal";

const MainNavigation = () => {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const isActive = (route: String) => {
    return router.pathname === route;
  };

  const isRouteActive = () => {
    return router.pathname === "/products/[productId]";
  };

  const showNavbarHandler = () => {
    setShow(true);
  };

  return (
    <>
      <NavbarModal show={show} onHide={() => setShow(false)} />
      <header className={styles.header}>
        <div className={`${styles["cntnr"]} site-container h-100`}>
          <div className={styles["header-row"]}>
            <div className="h-100 d-flex align-items-center">
              <Link
                href={router.pathname === "/home" ? "/" : "/home"}
                className={styles["brand-logo"]}
              >
                <Image
                  src="/static/images/logo.svg"
                  width={148}
                  height={58}
                  alt="Brand Image"
                />
              </Link>
            </div>
            <div className={styles["nav-links-cntnr"]}>
              <Link
                href={`${
                  router.pathname === "/home" ? router.asPath : "/home"
                }`}
                className={
                  `${styles["header-link-container"]} ${
                    isActive("/home")
                      ? styles["header-link-container-active"]
                      : isRouteActive()
                      ? styles["header-link-container-active"]
                      : ""
                  } d-flex align-items-center `
                  // `${
                  //   isActive("/home")
                  //     ? `${styles["header-link-container-active-home"]} ${styles["header-link-container-active"]}`
                  //     : isRouteActive()
                  //     ? `${styles["header-link-container-active-home"]} ${styles["header-link-container-active"]}`
                  //     : `${styles["header-link-container"]} ${styles["header-link-container-home"]}`
                  // } d-flex align-items-center `
                }
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles["header-link-icon"]}
                >
                  {isActive("/home") ? (
                    <path
                      d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z"
                      fill="#562EC4"
                    />
                  ) : isRouteActive() ? (
                    <path
                      d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z"
                      fill="#562EC4"
                    />
                  ) : (
                    <path
                      d="M18.775 9.6125V19.775H14.225V15V13.775H13H11H9.775V15V19.775H5.225V9.6125L12 4.53125L18.775 9.6125Z"
                      stroke="#9371DB"
                      strokeWidth="2.45"
                    />
                  )}
                  {/* <path
                    d="M18.775 9.6125V19.775H14.225V15V13.775H13H11H9.775V15V19.775H5.225V9.6125L12 4.53125L18.775 9.6125Z"
                    stroke="#9371DB"
                    strokeWidth="2.45"
                  /> */}
                </svg>
                Home
              </Link>

              <Link
                href="/favorite"
                className={`${styles["header-link-container"]} ${
                  isActive("/favorite")
                    ? styles["header-link-container-active"]
                    : ""
                } d-flex align-items-center `}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles["header-link-icon"]}
                >
                  {isActive("/favorite") ? (
                    <path
                      d="M12.0002 21.1748L10.5778 19.88C5.52607 15.2991 2.19092 12.268 2.19092 8.5699C2.19092 5.53884 4.56476 3.1748 7.58602 3.1748C9.29283 3.1748 10.931 3.96935 12.0002 5.21513C13.0694 3.96935 14.7075 3.1748 16.4144 3.1748C19.4356 3.1748 21.8095 5.53884 21.8095 8.5699C21.8095 12.268 18.4743 15.2991 13.4225 19.88L12.0002 21.1748Z"
                      fill="#562EC4"
                    />
                  ) : (
                    <path
                      d="M11.4032 18.9733L11.4014 18.9717C8.85139 16.6593 6.83372 14.824 5.43921 13.1179C4.05819 11.4283 3.41696 10.0158 3.41696 8.5699C3.41696 6.21749 5.24037 4.40096 7.5859 4.40096C8.92204 4.40096 10.2247 5.02932 11.0696 6.01371L12.0001 7.09781L12.9305 6.01371C13.7754 5.02932 15.0781 4.40096 16.4142 4.40096C18.7598 4.40096 20.5832 6.21749 20.5832 8.5699C20.5832 10.0158 19.9419 11.4283 18.5609 13.1179C17.1664 14.824 15.1487 16.6593 12.5987 18.9717L12.597 18.9733L12.0001 19.5167L11.4032 18.9733Z"
                      stroke="#9371DB"
                      strokeWidth="2.45232"
                    />
                  )}
                  {/* <path
                    d="M11.4032 18.9733L11.4014 18.9717C8.85139 16.6593 6.83372 14.824 5.43921 13.1179C4.05819 11.4283 3.41696 10.0158 3.41696 8.5699C3.41696 6.21749 5.24037 4.40096 7.5859 4.40096C8.92204 4.40096 10.2247 5.02932 11.0696 6.01371L12.0001 7.09781L12.9305 6.01371C13.7754 5.02932 15.0781 4.40096 16.4142 4.40096C18.7598 4.40096 20.5832 6.21749 20.5832 8.5699C20.5832 10.0158 19.9419 11.4283 18.5609 13.1179C17.1664 14.824 15.1487 16.6593 12.5987 18.9717L12.597 18.9733L12.0001 19.5167L11.4032 18.9733Z"
                    stroke="#9371DB"
                    strokeWidth="2.45232"
                  /> */}
                </svg>
                Favorite
              </Link>

              <Link
                href="/account"
                className={`${styles["header-link-container"]} ${
                  isActive("/account")
                    ? styles["header-link-container-active"]
                    : ""
                } d-flex align-items-center `}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles["header-link-icon"]}
                >
                  {isActive("/account") ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5 7.5C7.5 5.01375 9.51375 3 12 3C14.4862 3 16.5 5.01375 16.5 7.5C16.5 9.98625 14.4862 12 12 12C9.51375 12 7.5 9.98625 7.5 7.5ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                      fill="#562EC4"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3ZM14.25 7.5C14.25 6.2625 13.2375 5.25 12 5.25C10.7625 5.25 9.75 6.2625 9.75 7.5C9.75 8.7375 10.7625 9.75 12 9.75C13.2375 9.75 14.25 8.7375 14.25 7.5ZM18.75 17.625C18.525 16.8263 15.0375 15.375 12 15.375C8.9625 15.375 5.475 16.8263 5.25 17.6362V18.75H18.75V17.625ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                      fill="#9371DB"
                    />
                  )}
                  {/* <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3ZM14.25 7.5C14.25 6.2625 13.2375 5.25 12 5.25C10.7625 5.25 9.75 6.2625 9.75 7.5C9.75 8.7375 10.7625 9.75 12 9.75C13.2375 9.75 14.25 8.7375 14.25 7.5ZM18.75 17.625C18.525 16.8263 15.0375 15.375 12 15.375C8.9625 15.375 5.475 16.8263 5.25 17.6362V18.75H18.75V17.625ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                    fill="#9371DB"
                  /> */}
                </svg>
                Account
              </Link>
            </div>
            <div className="d-flex d-md-none justify-content-end align-items-center">
              <button
                className={styles["hamburger-menu"]}
                onClick={showNavbarHandler}
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* <Navbar expand="md" className={styles.header}>
        <div className={`${styles["cntnr"]} site-container h-100 flex-grow-1`}>
          <div className={styles["header-row"]}>
            <Navbar.Brand
              className="h-100 d-flex align-items-center"
              style={{ padding: 0, margin: 0 }}
            >
              <Link href={router.pathname === "/home" ? "/" : "/home"}>
                <Image
                  src="/static/images/logo.svg"
                  width={148}
                  height={58}
                  alt="Brand Image"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav
                className="me-auto m-md-0 flex-md-grow-1 justify-content-md-center h-100"
                style={{ gap: "24px" }}
              >
                <Link
                  href="/home"
                  className={`${styles["header-link-container"]} ${
                    isActive("/home")
                      ? styles["header-link-container-active"]
                      : isRouteActive()
                      ? styles["header-link-container-active"]
                      : ""
                  } d-flex align-items-center `}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles["header-link-icon"]}
                  >
                    {isActive("/home") ? (
                      <path
                        d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z"
                        fill="#562EC4"
                      />
                    ) : isRouteActive() ? (
                      <path
                        d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z"
                        fill="#562EC4"
                      />
                    ) : (
                      <path
                        d="M18.775 9.6125V19.775H14.225V15V13.775H13H11H9.775V15V19.775H5.225V9.6125L12 4.53125L18.775 9.6125Z"
                        stroke="#9371DB"
                        strokeWidth="2.45"
                      />
                    )}
                  </svg>
                  Home
                </Link>

                <Link
                  href="/favorite"
                  className={`${styles["header-link-container"]} ${
                    isActive("/favorite")
                      ? styles["header-link-container-active"]
                      : ""
                  } d-flex align-items-center `}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles["header-link-icon"]}
                  >
                    {isActive("/favorite") ? (
                      <path
                        d="M12.0002 21.1748L10.5778 19.88C5.52607 15.2991 2.19092 12.268 2.19092 8.5699C2.19092 5.53884 4.56476 3.1748 7.58602 3.1748C9.29283 3.1748 10.931 3.96935 12.0002 5.21513C13.0694 3.96935 14.7075 3.1748 16.4144 3.1748C19.4356 3.1748 21.8095 5.53884 21.8095 8.5699C21.8095 12.268 18.4743 15.2991 13.4225 19.88L12.0002 21.1748Z"
                        fill="#562EC4"
                      />
                    ) : (
                      <path
                        d="M11.4032 18.9733L11.4014 18.9717C8.85139 16.6593 6.83372 14.824 5.43921 13.1179C4.05819 11.4283 3.41696 10.0158 3.41696 8.5699C3.41696 6.21749 5.24037 4.40096 7.5859 4.40096C8.92204 4.40096 10.2247 5.02932 11.0696 6.01371L12.0001 7.09781L12.9305 6.01371C13.7754 5.02932 15.0781 4.40096 16.4142 4.40096C18.7598 4.40096 20.5832 6.21749 20.5832 8.5699C20.5832 10.0158 19.9419 11.4283 18.5609 13.1179C17.1664 14.824 15.1487 16.6593 12.5987 18.9717L12.597 18.9733L12.0001 19.5167L11.4032 18.9733Z"
                        stroke="#9371DB"
                        strokeWidth="2.45232"
                      />
                    )}
                  </svg>
                  Favorite
                </Link>

                <Link
                  href="/account"
                  className={`${styles["header-link-container"]} ${
                    isActive("/account")
                      ? styles["header-link-container-active"]
                      : ""
                  } d-flex align-items-center `}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles["header-link-icon"]}
                  >
                    {isActive("/account") ? (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5 7.5C7.5 5.01375 9.51375 3 12 3C14.4862 3 16.5 5.01375 16.5 7.5C16.5 9.98625 14.4862 12 12 12C9.51375 12 7.5 9.98625 7.5 7.5ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                        fill="#562EC4"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 3C9.51375 3 7.5 5.01375 7.5 7.5C7.5 9.98625 9.51375 12 12 12C14.4862 12 16.5 9.98625 16.5 7.5C16.5 5.01375 14.4862 3 12 3ZM14.25 7.5C14.25 6.2625 13.2375 5.25 12 5.25C10.7625 5.25 9.75 6.2625 9.75 7.5C9.75 8.7375 10.7625 9.75 12 9.75C13.2375 9.75 14.25 8.7375 14.25 7.5ZM18.75 17.625C18.525 16.8263 15.0375 15.375 12 15.375C8.9625 15.375 5.475 16.8263 5.25 17.6362V18.75H18.75V17.625ZM3 17.625C3 14.6325 8.99625 13.125 12 13.125C15.0037 13.125 21 14.6325 21 17.625V21H3V17.625Z"
                        fill="#9371DB"
                      />
                    )}
                  </svg>
                  Account
                </Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar> */}
    </>
  );
};

export default MainNavigation;
