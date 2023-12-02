import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";

import styles from "../../styles/Reviews.module.css";

import { ReviewObject } from "@/Models/ListData";
import ReviewsList from "./ReviewsList";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";
import { useRouter } from "next/router";

const Reviews = (props: {
  reviewsHeader: "Google Reviews" | "Dhaaga Reviews";
  googleReviews?: [[string], [string]][];
  product?: {
    Reviews: ReviewObject[] | [];
    dhaagaReviewCount: number | undefined;
    hasReviewedProduct: boolean;
  };
  googleReviewsCount?: number;
  isAddReviewRequestSucceed?: boolean;
  setAddReviewModalShow?: () => void;
}) => {
  const {
    reviewsHeader,
    googleReviewsCount,
    googleReviews,
    product,
    isAddReviewRequestSucceed,
    setAddReviewModalShow,
  } = props;

  const [reviewsData, setReviewsData] = useState({
    reviews_result: product?.Reviews,
    reviewsCount: product?.dhaagaReviewCount,
    hasReviewedProduct: product?.hasReviewedProduct,
  });

  const [seeMoreGoogleReviewsPressed, setSeeMoreGoogleReviewsPressed] =
    useState(false);
  const [seeMoreDhaagaReviewsPressed, setSeeMoreDhaagaReviewsPressed] =
    useState(false);
  const [getReviewIsLoading, setGetReviewIsLoading] = useState(false);
  const [seeMoreReviewIsLoading, setSeeMoreReviewIsLoading] = useState(false);

  const router = useRouter();
  const { showBoundary } = useErrorBoundary();

  const productId = router.query.productId;

  useEffect(() => {
    if (isAddReviewRequestSucceed) {
      const getReviews = async () => {
        const res = await catchAsyncFetch(
          `/api/getReviews/${productId}`,
          showBoundary
        );
        if (!res) {
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          const error = new Error(data.message);
          showBoundary(error);
        }
        return data;
      };
      setGetReviewIsLoading(true);
      getReviews().then(
        (data: {
          reviewsData: ReviewObject[];
          hasReviewedProduct: boolean;
          reviews: number;
        }) => {
          if (data) {
            setReviewsData({
              reviews_result: data.reviewsData,
              hasReviewedProduct: data.hasReviewedProduct,
              reviewsCount: data.reviews,
            });
          }
        }
      );
      setGetReviewIsLoading(false);
    }
  }, [isAddReviewRequestSucceed]);

  const seeMoreGoogleReviewsClickHandler = () => {
    setSeeMoreGoogleReviewsPressed(true);
  };

  const seeMoreDhaagaReviewsClickHandler = async () => {
    setSeeMoreReviewIsLoading(true);

    const res = await catchAsyncFetch(
      `/api/getReviews/${productId}?getAll=true`,
      showBoundary
    );

    if (!res) {
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message);
      showBoundary(error);
    }

    setReviewsData({
      reviews_result: data.reviewsData,
      hasReviewedProduct: data.hasReviewedProduct,
      reviewsCount: data.reviews,
    });
    setSeeMoreReviewIsLoading(false);
    setSeeMoreDhaagaReviewsPressed(true);
  };

  return (
    <>
      {reviewsHeader === "Google Reviews" &&
        googleReviews &&
        googleReviews.length > 0 && (
          <div
            className="d-flex flex-column"
            style={{
              paddingTop: 12,
              gap: 13,
              // height: reviewsContainerDivHeight,
              // overflowY:
              //   overFlow === true
              //     ? "scroll"
              //     : overFlow === null
              //     ? "hidden"
              //     : "unset",
            }}
          >
            <div className={styles["reviews-header"]}>
              Google Reviews {`(${googleReviewsCount})`}
            </div>
            <ReviewsList
              googleReviews={googleReviews}
              // setUlHeight={settingUlHeightHandler}
              seeMoreGoogleReviews={seeMoreGoogleReviewsPressed}
            />
            {!seeMoreGoogleReviewsPressed && googleReviews.length > 3 && (
              <div className={styles["see-more-reviews"]}>
                <button onClick={seeMoreGoogleReviewsClickHandler}>
                  See more reviews
                </button>
              </div>
            )}
          </div>
        )}
      {reviewsHeader === "Dhaaga Reviews" &&
        reviewsData.reviews_result!.length > 0 && (
          <div
            className="d-flex flex-column"
            style={{
              paddingTop: 12,
              gap: 13,
              // height: reviewsContainerDivHeight,
              // overflowY:
              //   overFlow === true
              //     ? "scroll"
              //     : overFlow === null
              //     ? "hidden"
              //     : "unset",
            }}
          >
            <div className={styles["reviews-header"]}>
              Dhaaga Reviews {`(${reviewsData.reviewsCount})`}
            </div>
            <ReviewsList
              dhaagaReviews={reviewsData.reviews_result}
              // setUlHeight={settingUlHeightHandler}
            />
            {!seeMoreDhaagaReviewsPressed &&
              reviewsData.reviewsCount &&
              reviewsData.reviewsCount > 3 && (
                <div
                  className={`${styles["see-more-reviews"]} ${
                    seeMoreReviewIsLoading ? styles["loading"] : ""
                  }`}
                >
                  <button
                    onClick={seeMoreDhaagaReviewsClickHandler}
                    disabled={seeMoreReviewIsLoading}
                  >
                    See more reviews
                  </button>
                </div>
              )}
          </div>
        )}

      {reviewsHeader === "Dhaaga Reviews" &&
        !reviewsData.hasReviewedProduct && (
          <div className={`wrapper d-flex flex-column ${styles.review}`}>
            <div>
              <div className={styles["review-head"]}>Your Opinion Matters!</div>
              <div className={styles["review-desc"]}>
                Help your Desi community and Desi Businesses by
                <br /> contributing your opinion. Please write a review.
              </div>
            </div>
            <div
              className={`${styles["review-business"]} ${
                getReviewIsLoading ? styles["loading"] : ""
              }`}
            >
              <button
                onClick={() => setAddReviewModalShow!()}
                disabled={getReviewIsLoading}
              >
                Review this Business
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default Reviews;
