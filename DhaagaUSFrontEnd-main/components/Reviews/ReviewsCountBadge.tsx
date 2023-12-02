import { useRouter } from "next/router";

import styles from "../../styles/ReviewsCountBadge.module.css";

const ReviewsCountBadge = (props: {
  avgRating: number | undefined;
  totalReviews: number | undefined;
  distanceOfProduct?: number;
}) => {
  const { avgRating, totalReviews, distanceOfProduct } = props;

  const router = useRouter();

  return (
    <div className={styles.ftr}>
      <div className={styles["review-badge"]}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.1887 5.51739L10.2215 4.94083L8.4481 1.34551C8.39966 1.24708 8.31998 1.16739 8.22154 1.11895C7.97466 0.997076 7.67466 1.09864 7.55123 1.34551L5.77779 4.94083L1.8106 5.51739C1.70123 5.53301 1.60123 5.58458 1.52466 5.6627C1.4321 5.75784 1.3811 5.88583 1.38286 6.01855C1.38461 6.15127 1.43899 6.27786 1.53404 6.37051L4.40435 9.16895L3.72623 13.1205C3.71032 13.2124 3.7205 13.307 3.75559 13.3934C3.79068 13.4798 3.84929 13.5547 3.92477 13.6095C4.00025 13.6644 4.08958 13.6969 4.18263 13.7036C4.27568 13.7102 4.36873 13.6906 4.45123 13.6471L7.99966 11.7815L11.5481 13.6471C11.645 13.6986 11.7575 13.7158 11.8653 13.6971C12.1372 13.6502 12.32 13.3924 12.2731 13.1205L11.595 9.16895L14.4653 6.37051C14.5434 6.29395 14.595 6.19395 14.6106 6.08458C14.6528 5.81114 14.4622 5.55801 14.1887 5.51739Z"
            fill="url(#paint0_linear_425_4453)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_425_4453"
              x1="3"
              y1="14.0002"
              x2="15"
              y2="2.00024"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFA01C" />
              <stop offset="1" stopColor="#FFCA35" />
            </linearGradient>
          </defs>
        </svg>
        <span>{avgRating || 0}</span>
        <span>{`(${totalReviews || 0})`}</span>
      </div>
      {distanceOfProduct !== undefined ||
      (router.pathname === "/products/[productId]" && router.query.distance) ? (
        <div className={styles.distance}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.46658 13.6003C6.0777 12.5225 5.0417 11.4725 4.35859 10.4503C3.67503 9.4281 3.33325 8.42255 3.33325 7.43366C3.33325 6.64477 3.47503 5.95299 3.75859 5.35833C4.0417 4.7641 4.40547 4.26699 4.84992 3.86699C5.29436 3.46699 5.79436 3.16699 6.34992 2.96699C6.90547 2.76699 7.45547 2.66699 7.99992 2.66699C8.54436 2.66699 9.09436 2.76699 9.64992 2.96699C10.2055 3.16699 10.7055 3.46699 11.1499 3.86699C11.5944 4.26699 11.9584 4.7641 12.2419 5.35833C12.525 5.95299 12.6666 6.64477 12.6666 7.43366C12.6666 8.42255 12.3248 9.4281 11.6413 10.4503C10.9581 11.4725 9.92214 12.5225 8.53325 13.6003L7.99992 14.0003L7.46658 13.6003ZM8.94192 8.27499C8.68058 8.53632 8.36659 8.66699 7.99992 8.66699C7.63325 8.66699 7.31947 8.53632 7.05859 8.27499C6.79725 8.0141 6.66658 7.70033 6.66658 7.33366C6.66658 6.96699 6.79725 6.65299 7.05859 6.39166C7.31947 6.13077 7.63325 6.00033 7.99992 6.00033C8.36659 6.00033 8.68058 6.13077 8.94192 6.39166C9.20281 6.65299 9.33325 6.96699 9.33325 7.33366C9.33325 7.70033 9.20281 8.0141 8.94192 8.27499Z"
              fill="#BAB9D9"
            />
          </svg>
          {`${
            router.pathname === "/products/[productId]" && router.query.distance
              ? `${router.query.distance} miles away`
              : distanceOfProduct
              ? `${distanceOfProduct} miles away`
              : ""
          }`}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ReviewsCountBadge;
