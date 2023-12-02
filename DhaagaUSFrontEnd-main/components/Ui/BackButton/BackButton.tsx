import { useRouter } from "next/router";
import styles from "../../../styles/BackButton.module.css";

const BackButton = () => {
  const router = useRouter();

  const BackButtonHandler = () => {
    if (router.pathname === "/products/[productId]" && router.query.locations) {
      const queryParams = router.query;
      delete queryParams.distance;
      delete queryParams.productId;
      queryParams.previousPath = "/products/[productId]";

      const searchParamsForHomePage = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) =>
        searchParamsForHomePage.append(key, `${value}`)
      );
      router.push(`/home?${searchParamsForHomePage.toString()}`);
    } else {
      router.push("/home");
    }
  };

  return (
    <button className={styles.button} onClick={BackButtonHandler}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
          fill="#1C1E36"
        />
      </svg>
    </button>
  );
};

export default BackButton;
