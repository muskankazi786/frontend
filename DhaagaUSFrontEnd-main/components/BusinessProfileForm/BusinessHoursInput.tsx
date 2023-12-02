import { ChangeEvent, useEffect, useState } from "react";

import styles from "../../styles/BusinessHoursInput.module.css";

import { BusinessDayObject } from "@/Models/BusinessHoursObject";

const BusinessHoursInput = (props: {
  day: string;
  onChangeFirstSpanFrom: (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => void;
  onChangeFirstSpanTo: (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => void;
  onChangeSecondSpanFrom: (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => void;
  onChangeSecondSpanTo: (
    e: ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => void;
  onStoreClose: (dayId: string) => void;
  secondSpanReset: (dayId: string) => void;
  storeIsClosed: boolean;
  businessHoursOfTheDay: BusinessDayObject[];
  showMoreTimeFieldFromTheForm?: boolean;
}) => {
  const [showMoreTimeField, setShowMoreTimeField] = useState(false);
  const [showMoreTimeFieldIsValid, setShowMoreTimeFieldIsValid] =
    useState(false);

  const {
    day,
    onChangeFirstSpanFrom,
    onChangeFirstSpanTo,
    onChangeSecondSpanFrom,
    onChangeSecondSpanTo,
    onStoreClose,
    secondSpanReset,
    storeIsClosed,
    businessHoursOfTheDay,
    showMoreTimeFieldFromTheForm,
  } = props;

  const firstSpan = businessHoursOfTheDay[0];
  const secondSpan = businessHoursOfTheDay[1];

  useEffect(() => {
    if (firstSpan.open !== "" && firstSpan.close !== "") {
      setShowMoreTimeFieldIsValid(true);
    } else {
      setShowMoreTimeFieldIsValid(false);
    }
  }, [businessHoursOfTheDay]);

  useEffect(() => {
    if (storeIsClosed) {
      setShowMoreTimeField(false);
    }
  }, [storeIsClosed]);

  useEffect(() => {
    if (showMoreTimeFieldFromTheForm) {
      setShowMoreTimeField(true);
    }
  }, [showMoreTimeFieldFromTheForm]);

  const firstSpanFromInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onChangeFirstSpanFrom(e, day);
  };

  const firstSpanToInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeFirstSpanTo(e, day);
  };

  const secondSpanFromInputChangeHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onChangeSecondSpanFrom(e, day);
  };

  const secondSpanToInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSecondSpanTo(e, day);
  };

  return (
    <div
      className="d-flex flex-column align-items-end flex-wrap"
      style={{ gap: 8 }}
    >
      <div className="d-flex flex-wrap" style={{ gap: 8 }}>
        <div className={styles["business-hours"]}>
          <label
            htmlFor="businessHoursFirstSpanFrom"
            className={`${styles.label} d-flex justify-content-center`}
          >
            From :
          </label>
          <input
            type="time"
            id="businessHoursFirstSpanFrom"
            onChange={firstSpanFromInputChangeHandler}
            value={firstSpan.open}
            disabled={storeIsClosed}
          />
        </div>
        <div className={styles["business-hours"]}>
          <label
            htmlFor="businessHoursFirstSpanTo"
            className={`${styles.label} d-flex justify-content-center`}
          >
            To :
          </label>
          <input
            type="time"
            id="businessHoursFirstSpanTo"
            onChange={firstSpanToInputChangeHandler}
            value={firstSpan.close}
            disabled={storeIsClosed}
          />
        </div>
        <button
          type="button"
          className={`${styles["store-closed"]} ${
            storeIsClosed ? styles.active : ""
          }`}
          onClick={() => onStoreClose(day)}
        >
          Closed
        </button>
        {!showMoreTimeField && (
          <button
            type="button"
            className={styles["add-time-field"]}
            onClick={() => setShowMoreTimeField(true)}
            disabled={!showMoreTimeFieldIsValid}
          >
            +
          </button>
        )}
      </div>

      {showMoreTimeField && (
        <div className="d-flex w-100 flex-wrap" style={{ gap: 4 }}>
          <div className={styles["business-hours"]}>
            <label
              htmlFor="businessHoursSecondSpanFrom"
              className={`${styles.label} d-flex justify-content-center`}
            >
              From :
            </label>
            <input
              type="time"
              id="businessHoursSecondSpanFrom"
              onChange={secondSpanFromInputChangeHandler}
              value={secondSpan.open}
              disabled={storeIsClosed}
            />
          </div>
          <div className={styles["business-hours"]}>
            <label
              htmlFor="businessHoursSecondSpanTo"
              className={`${styles.label} d-flex justify-content-center`}
            >
              To :
            </label>
            <input
              type="time"
              id="businessHoursSecondSpanTo"
              onChange={secondSpanToInputChangeHandler}
              value={secondSpan.close}
              disabled={storeIsClosed}
            />
          </div>
          {showMoreTimeField && (
            <button
              type="button"
              className={styles["add-time-field"]}
              onClick={() => {
                //   setBusinessHours((prevState) => {
                //     return {
                //       ...prevState,
                //       businessHoursSecondSpanFrom: "",
                //       businessHoursSecondSpanTo: "",
                //     };
                //   });
                setShowMoreTimeField(false);
                secondSpanReset(day);
              }}
            >
              -
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessHoursInput;
