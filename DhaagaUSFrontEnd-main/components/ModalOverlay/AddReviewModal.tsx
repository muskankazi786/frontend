import { ChangeEvent, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";

import styles from "../../styles/AddReviewModal.module.css";

import useTextArea from "@/hooks/useTextArea";
import {
  isNotEmpty,
  isNotMoreThanSaidLimit,
} from "@/utils/validation/conditions";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

const AddReviewModal = ({
  onHide,
  onResult,
  ...otherProps
}: {
  show: boolean;
  onHide: () => void;
  onResult: (result: { success?: string; error?: string }) => void;
}) => {
  // Review text field's useTextAreaHook

  const {
    value: enteredReviewText,
    wordCount: reviewTextWordCount,
    isValid: reviewTextIsValid,
    hasError: reviewTextInputHasError,
    errorText: reviewTextInputErrorText,
    valueChangeHandler: reviewTextInputChangeHandler,
    inputBlurHandler: reviewTextInputBlurHandler,
    inputTouchHandler: reviewTextInputTouchHandler,
    inputResetHandler: reviewTextInputResetHandler,
  } = useTextArea((value: string | undefined) => {
    if (!isNotEmpty(value)) {
      return { valid: true };
    } else if (!isNotMoreThanSaidLimit(value, 200)) {
      return {
        valid: false,
        errorText: "Must be at most 200 characters",
      };
    } else {
      return { valid: true };
    }
  });

  const [rating, setRating] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { showBoundary } = useErrorBoundary();

  const reviewTextInputRef = useRef<HTMLTextAreaElement>(null);

  const ratingInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRating(e.target.value);
  };

  const submitHandler = async () => {
    reviewTextInputTouchHandler();

    if (!reviewTextIsValid) {
      setTimeout(() => {
        reviewTextInputRef.current?.focus();
      }, 0);
      return;
    }

    setIsLoading(true);
    const reviewObj = {
      rating,
      reviewText: enteredReviewText,
    };
    const productId = router.query.productId;

    const res = await catchAsyncFetch(
      `/api/createReview/${productId}`,
      showBoundary,
      {
        method: "POST",
        body: JSON.stringify(reviewObj),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res) {
      return;
    }

    const postReviewData = await res.json();

    if (res.ok) {
      const result = { success: postReviewData.message };
      onResult(result);
      onHide();
    } else {
      const result = { error: postReviewData.message };
      onResult(result);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      {...otherProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={styles["modal-custom-width"]}
      centered
      onHide={() => {
        setRating("1");
        reviewTextInputResetHandler();
        onHide();
      }}
    >
      <Modal.Header closeButton style={{ padding: "20px 20px 0 20px" }}>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className={styles["modal-title-cstm"]}
        >
          Review Business
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 20 }}>
        <form>
          <div className="d-flex flex-column" style={{ gap: 18 }}>
            <div className={styles["star-rating-container"]}>
              <fieldset className="custom-starability-basic">
                <input
                  type="radio"
                  id="no-rate"
                  className="input-no-rate"
                  name="rating"
                  defaultChecked
                  value="0"
                  aria-label="No rating."
                />
                <input
                  type="radio"
                  id="first-rate1"
                  name="rating"
                  value="1"
                  onChange={ratingInputHandler}
                />
                <label htmlFor="first-rate1" title="Terrible">
                  1 star
                </label>
                <input
                  type="radio"
                  id="first-rate2"
                  name="rating"
                  value="2"
                  onChange={ratingInputHandler}
                />
                <label htmlFor="first-rate2" title="Not good">
                  2 stars
                </label>
                <input
                  type="radio"
                  id="first-rate3"
                  name="rating"
                  value="3"
                  onChange={ratingInputHandler}
                />
                <label htmlFor="first-rate3" title="Average">
                  3 stars
                </label>
                <input
                  type="radio"
                  id="first-rate4"
                  name="rating"
                  value="4"
                  onChange={ratingInputHandler}
                />
                <label htmlFor="first-rate4" title="Very good">
                  4 stars
                </label>
                <input
                  type="radio"
                  id="first-rate5"
                  name="rating"
                  value="5"
                  onChange={ratingInputHandler}
                />
                <label htmlFor="first-rate5" title="Amazing">
                  5 stars
                </label>
              </fieldset>{" "}
            </div>
            <div
              className={`d-flex flex-column ${styles.controls}  ${
                reviewTextInputHasError ? styles["invalid"] : ""
              }`}
              style={{ gap: 8 }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <label className={styles.label} htmlFor="review-text">
                  Write your review
                </label>
                <div className={styles["word-count"]}>
                  {reviewTextWordCount}/200
                </div>
              </div>
              <textarea
                name="review-text"
                id="review-text"
                rows={4}
                maxLength={200}
                placeholder="What you want to say..."
                ref={reviewTextInputRef}
                value={enteredReviewText}
                onChange={reviewTextInputChangeHandler}
                onBlur={reviewTextInputBlurHandler}
              ></textarea>
              {reviewTextInputHasError && (
                <p className={styles["error-text"]}>
                  {reviewTextInputErrorText}
                </p>
              )}
            </div>
          </div>
          <div
            className={`${styles["actions"]} ${
              isLoading ? styles["loading"] : ""
            }`}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                if (e.button === 0) {
                  submitHandler();
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Review"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddReviewModal;
