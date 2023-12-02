import { useEffect, useRef, useState } from "react";

import styles from "../../styles/ResultsList.module.css";

import { ListData } from "@/Models/ListData";
import ResultItem from "./ResultItem";
import SortButton from "../SortButton/SortButton";

const ResultsList = (props: {
  isForFavoritePage: boolean;
  items: ListData[];
  setUlHeight?: (height: number) => void;
  notFoundText: string;
}) => {
  const [viewList, setViewList] = useState(false);

  const ulRef = useRef<HTMLUListElement>(null);

  const { items, isForFavoritePage, setUlHeight, notFoundText } = props;

  useEffect(() => {
    if (setUlHeight && items.length) {
      setUlHeight(
        (ulRef.current as HTMLUListElement).getBoundingClientRect().height
      );
    }
  });

  const viewListClickHandler = () => {
    setViewList(true);
  };

  const backButtonClickHandler = () => {
    setViewList(false);
  };

  if (items.length === 0) {
    return (
      <div
        className="d-none d-md-flex justify-content-center align-items-center"
        style={{ height: "20%" }}
      >
        {notFoundText}
      </div>
    );
  }

  return (
    <>
      {/* {items.length === 0 && (
        <div className={`${styles["no-records"]} d-block d-md-none`}></div>
      )} */}
      {!viewList && items.length > 0 && !isForFavoritePage && (
        <button
          className={`${styles["view-list"]} d-flex d-md-none`}
          onClick={viewListClickHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            fill="var(--primary)"
          >
            <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
          </svg>
          View list
        </button>
      )}
      {viewList && !isForFavoritePage && (
        <div
          className={`${styles["view-list-container"]} d-flex d-md-none`}
          style={{ padding: "8px 25px 0 25px" }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={backButtonClickHandler}
          >
            <rect width="36" height="36" rx="18" fill="white" />
            <path
              d="M26 17H13.83L19.42 11.41L18 10L10 18L18 26L19.41 24.59L13.83 19H26V17Z"
              fill="#1C1E36"
            />
          </svg>
          <div className="d-flex flex-column gap-2 flex-grow-1">
            <SortButton className="align-self-end" items={items} />
            <ul ref={ulRef} className={`${styles["results"]} flex-grow-1`}>
              {items.map((item, index) => (
                <ResultItem
                  key={item._id}
                  isForFavoritePage={isForFavoritePage}
                  item={item}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      <ul
        ref={ulRef}
        className={`${styles["results"]} ${
          !isForFavoritePage ? "d-none d-md-block" : ""
        }`}
      >
        {items.map((item, index) => (
          <ResultItem
            key={item._id}
            isForFavoritePage={isForFavoritePage}
            item={item}
          />
        ))}
      </ul>
    </>
  );
};

export default ResultsList;
