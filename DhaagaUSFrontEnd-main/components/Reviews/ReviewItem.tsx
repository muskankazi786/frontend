import { ReviewObject, UserProfileObject } from "@/Models/ListData";
import styles from "../../styles/ReviewItem.module.css";

const randomRating = Math.floor(Math.random() * 5) + 1;

const ReviewItem = (props: {
  dhaagaReview?: ReviewObject;
  googleReview?: [[string], [string]];
}) => {
  const { dhaagaReview, googleReview } = props;
  const user_id = dhaagaReview?.user_id as UserProfileObject;

  let day;
  let month;
  let year;
  if (dhaagaReview) {
    const date = new Date(dhaagaReview!.created_date);
    month = date.toLocaleString("en-US", { month: "short" });
    day = date.toLocaleString("en-US", { day: "2-digit" });
    year = date.getFullYear();
  }
  return (
    <li className={styles["item"]}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start" style={{ gap: 12 }}>
          <div className={styles["avatar"]}></div>
          <div className="d-flex flex-column" style={{ gap: 5.33 }}>
            <div className={styles["reviewer-name"]}>
              {dhaagaReview
                ? user_id.username
                  ? user_id.username
                  : user_id.email
                : ""}
              {googleReview && googleReview[0]}
            </div>
            {dhaagaReview && (
              <div
                className="custom-starability-result-purple"
                data-rating={dhaagaReview.rating}
              ></div>
            )}
            {googleReview && (
              <div
                className="custom-starability-result-yellow"
                data-rating={randomRating}
              ></div>
            )}
          </div>
        </div>
        {dhaagaReview && (
          <div className={styles["review-date"]}>
            {day} {month} {year}
          </div>
        )}
      </div>
      <div className={styles["review"]}>
        {dhaagaReview ? dhaagaReview.reviewText : googleReview![1]}
      </div>
    </li>
  );
};

export default ReviewItem;
