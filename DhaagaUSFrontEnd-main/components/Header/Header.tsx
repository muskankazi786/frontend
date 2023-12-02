import { useRouter } from "next/router";

import styles from "../../styles/Header.module.css";

interface ShowEditButton {
  showEditButton: false;
  headerText: string;
}

interface WithoutShowEditButton {
  showEditButton: true;
  isAuthorizedForEditButton: boolean;
  headerText: string;
}

const Header = (props: ShowEditButton | WithoutShowEditButton) => {
  const router = useRouter();

  const { showEditButton, headerText } = props;
  const isAuthorizedForEditButton = (props as WithoutShowEditButton)
    .isAuthorizedForEditButton;

  return (
    <header
      className={`${styles.header} wrapper d-flex justify-content-between align-items-center`}
    >
      <div className={styles.head}>{headerText}</div>

      {/* Edit Button */}
      {showEditButton && isAuthorizedForEditButton && (
        <button
          className={styles["edit-button"]}
          onClick={() => router.push("/edit-business-profile")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.096 20.5207 3 20.2833 3 20V17.175C3 17.0417 3.025 16.9127 3.075 16.788C3.125 16.6627 3.2 16.55 3.3 16.45L13.6 6.15L17.85 10.4L7.55 20.7C7.45 20.8 7.33767 20.875 7.213 20.925C7.08767 20.975 6.95833 21 6.825 21H4ZM14.325 9.675L13.625 8.975L15.025 10.375L14.325 9.675Z"
              fill="#1C1E36"
            />
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
