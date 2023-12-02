import { useRef } from "react";

import { ReviewObject } from "@/Models/ListData";
import ReviewItem from "./ReviewItem";

const ReviewsList = (props: {
  dhaagaReviews?: ReviewObject[];
  googleReviews?: [[string], [string]][];
  seeMoreGoogleReviews?: boolean;
}) => {
  const { dhaagaReviews, googleReviews, seeMoreGoogleReviews } = props;

  const ulRef = useRef<HTMLUListElement>(null);

  const threeOrLessGoogleReviewsArray = [];
  if (googleReviews) {
    const googleReviewsLength = googleReviews.length;
    let loopLength = 0;
    if (!seeMoreGoogleReviews) {
      const idealLength = 3;
      if (googleReviewsLength >= idealLength) {
        loopLength = idealLength;
      } else {
        loopLength = googleReviewsLength;
      }
    } else if (seeMoreGoogleReviews) {
      loopLength = googleReviewsLength;
    }

    for (let i = 0; i < loopLength; i++) {
      threeOrLessGoogleReviewsArray.push(
        <ReviewItem googleReview={googleReviews[i]} key={i} />
      );
    }
  }

  return (
    <ul className="d-flex flex-column" style={{ gap: 8 }} ref={ulRef}>
      {dhaagaReviews &&
        dhaagaReviews?.map((review: ReviewObject) => (
          <ReviewItem dhaagaReview={review} key={review._id.toString()} />
        ))}
      {/* {googleReviews &&
        googleReviews?.map((review: [[string], [string]], index) => (
          <ReviewItem googleReview={review} key={index} />
        ))} */}
      {googleReviews && threeOrLessGoogleReviewsArray}
    </ul>
  );
};

export default ReviewsList;
