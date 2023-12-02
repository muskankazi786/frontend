import styles from "../../styles/NotificationHistory.module.css";

const NotificationHistory = () => {
  return (
    <>
      <div className={styles.label}>Notification History</div>
      {/* <ul className={`wrapper ${styles["notification-cntnr"]}`}>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
        <li
          className="d-flex align-items-start"
          style={{
            gap: 12,
            padding: 16,
            border: "1px solid #F3F2FF",
            borderRadius: 12,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              fill="#FFF8E2"
            />
            <path
              d="M23.736 12.8965L18.777 12.1758L16.5602 7.68165C16.4996 7.5586 16.4 7.45899 16.277 7.39844C15.9684 7.2461 15.5934 7.37305 15.4391 7.68165L13.2223 12.1758L8.26325 12.8965C8.12653 12.916 8.00153 12.9805 7.90583 13.0782C7.79013 13.1971 7.72637 13.3571 7.72857 13.523C7.73077 13.6889 7.79874 13.8471 7.91755 13.9629L11.5055 17.461L10.6578 22.4005C10.6379 22.5154 10.6506 22.6335 10.6945 22.7416C10.7384 22.8496 10.8116 22.9432 10.906 23.0117C11.0003 23.0803 11.112 23.121 11.2283 23.1293C11.3446 23.1376 11.4609 23.1131 11.564 23.0587L15.9996 20.7266L20.4352 23.0587C20.5563 23.1231 20.6969 23.1446 20.8317 23.1212C21.1715 23.0626 21.4 22.7403 21.3414 22.4005L20.4938 17.461L24.0817 13.9629C24.1793 13.8672 24.2438 13.7422 24.2633 13.6055C24.3161 13.2637 24.0778 12.9473 23.736 12.8965Z"
              fill="url(#paint0_linear_457_9645)"
            />
            <rect
              x="0.388888"
              y="0.388888"
              width="31.2223"
              height="31.2223"
              rx="5.61111"
              stroke="#FFECB5"
              strokeWidth="0.777776"
            />
            <defs>
              <linearGradient
                id="paint0_linear_457_9645"
                x1="9.75001"
                y1="23.5001"
                x2="24.7501"
                y2="8.50006"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#FFA01C" />
                <stop offset="1" stop-color="#FFCA35" />
              </linearGradient>
            </defs>
          </svg>
          <div className="d-flex flex-column w-100" style={{ gap: 2 }}>
            <div className={styles.notification}>
              You just got reviewed!<span>26 Jan</span>
            </div>
            <div className={styles["rating-info"]}>
              Arjun Singh has left you 4.8 ratings.
            </div>
          </div>
        </li>
      </ul> */}
      <div
        className="d-none d-lg-flex flex-column align-items-center justify-content-center"
        style={{
          gap: 16,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="wrapper" style={{ padding: 16, background: "#EDE6F8" }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.3333 22.667V15.7337C24.6667 15.867 24 16.0003 23.3333 16.0003H22.6667V24.0003H9.33333V14.667C9.33333 10.9337 12.2667 8.00033 16 8.00033C16.1333 6.26699 16.9333 4.80033 18 3.60033C17.6 3.06699 16.8 2.66699 16 2.66699C14.5333 2.66699 13.3333 3.86699 13.3333 5.33366V5.73366C9.33333 6.93366 6.66667 10.5337 6.66667 14.667V22.667L4 25.3337V26.667H28V25.3337L25.3333 22.667ZM13.3333 28.0003C13.3333 29.467 14.5333 30.667 16 30.667C17.4667 30.667 18.6667 29.467 18.6667 28.0003H13.3333ZM28 8.66699C28 11.2003 25.8667 13.3337 23.3333 13.3337C20.8 13.3337 18.6667 11.2003 18.6667 8.66699C18.6667 6.13366 20.8 4.00033 23.3333 4.00033C25.8667 4.00033 28 6.13366 28 8.66699Z"
              fill="#7A52D3"
            />
          </svg>
        </div>
        <div className={styles["no-notif-text"]}>
          You have not received any notifications!
        </div>
      </div>
      <div
        className={`${styles["no-notif-text"]} d-block d-lg-none w-100 mt-3 text-center`}
      >
        You have not received any notifications!
      </div>
    </>
  );
};

export default NotificationHistory;
