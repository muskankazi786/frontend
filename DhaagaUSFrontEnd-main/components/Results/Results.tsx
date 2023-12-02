import React from "react";

import styles from "../../styles/Results.module.css";

import { ListData } from "@/Models/ListData";
import SortButton from "../SortButton/SortButton";
import ResultsList from "./ResultsList";

const Results = (props: {
  isForFavoritePage: boolean;
  items: ListData[];
  setUlHeight?: (height: number) => void;
  notFoundText: string;
}) => {
  const { items, isForFavoritePage, setUlHeight, notFoundText } = props;

  return (
    <>
      <div className={styles.heading}>
        <div className={styles.head}>Businesses</div>
        {!isForFavoritePage && <SortButton items={items} />}
      </div>
      <ResultsList
        setUlHeight={setUlHeight}
        isForFavoritePage={isForFavoritePage}
        items={items}
        notFoundText={notFoundText}
      />
    </>
  );
};

export default Results;
