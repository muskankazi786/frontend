import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { FavoriteContext } from "@/context/favorite-context";

import styles from "../../styles/ResultItem.module.css";

import { ListData } from "@/Models/ListData";
import Reviews from "../Reviews/ReviewsCountBadge";
import ReviewsCountBadge from "../Reviews/ReviewsCountBadge";

const ResultItem = (props: { isForFavoritePage: Boolean; item: ListData }) => {
  const { removeAsFavorite } = useContext(FavoriteContext);

  const router = useRouter();

  const { item, isForFavoritePage } = props;

  const removeFromFavProductsHandler = async () => {
    removeAsFavorite(item._id, false);
  };

  const queryParams = { ...router.query };
  delete queryParams.previousPath;
  const searchParamsForProductPage = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) =>
    searchParamsForProductPage.append(key, `${value}`)
  );
  const routerQueryParam = searchParamsForProductPage.toString();

  return (
    <li className={styles.item}>
      <div className={styles["heading-container"]}>
        <Link
          href={`/products/${item._id}${
            item.distance
              ? `?distance=${item.distance}&${routerQueryParam}`
              : `?${routerQueryParam}`
          }`}
        >
          {item.name}
        </Link>
        {isForFavoritePage && (
          <button onClick={removeFromFavProductsHandler}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19.5149L10.84 18.4589C6.72 14.7229 4 12.251 4 9.23495C4 6.76296 5.936 4.83496 8.4 4.83496C9.792 4.83496 11.128 5.48296 12 6.49896C12.872 5.48296 14.208 4.83496 15.6 4.83496C18.064 4.83496 20 6.76296 20 9.23495C20 12.251 17.28 14.7229 13.16 18.4589L12 19.5149Z"
                fill="#562EC4"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={styles["product-desc"]}>
        Lorem ipsum dolor sit amet consectetur. Lobortis venenatis <br />{" "}
        dictum. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
        amet consectetur. Lobortis venenatis <br /> dictum. Lorem ipsum dolor
        sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Lobortis
        venenatis <br /> dictum. Lorem ipsum dolor sit amet consectetur. Lorem
        ipsum dolor sit amet consectetur. Lobortis venenatis <br /> dictum.
        Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
        consectetur. Lobortis venenatis <br /> dictum. Lorem ipsum dolor sit
        amet consectetur.
      </div>
      <div style={{ marginTop: 16 }}>
        <ReviewsCountBadge
          avgRating={item.avgRating}
          totalReviews={item.reviewCount}
          distanceOfProduct={item.distance}
        />
      </div>
    </li>
  );
};

export default ResultItem;
