import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dropdown, DropdownButton } from "react-bootstrap";

import styles from "../../styles/Sort.module.css";
import { ListData } from "@/Models/ListData";

const initialSortByState = {
  recommended: false,
  distance: false,
  ratings: false,
  mostReviewed: false,
};

const SortButton = (props: { className?: string; items: ListData[] }) => {
  const [isActiveSortBy, setIsActiveSortBy] = useState<{
    [key: string]: boolean;
  }>(initialSortByState);
  const [isAnySortMethodSelected, setIsAnySortMethodSelected] = useState(false);

  const router = useRouter();

  const { className, items } = props;

  useEffect(() => {
    const is_Any_Sort_Method_Selected =
      Object.values(isActiveSortBy).includes(true);
    setIsAnySortMethodSelected(is_Any_Sort_Method_Selected);
  }, [isActiveSortBy]);

  useEffect(() => {
    const sort = router.query.sort?.toString();

    if (sort) {
      if (isActiveSortBy[sort] === false) {
        setIsActiveSortBy((prevState) => {
          return { ...prevState, [sort]: true };
        });
      }
    }
  }, []);

  const sortDropDownClickHandler = (e: React.MouseEvent) => {
    const sortOption = (e.target as HTMLButtonElement).id;
    setIsActiveSortBy((prevState) => {
      const sortState = { ...prevState };

      for (let key in sortState) {
        if (sortState[key] === true) {
          sortState[key] = false;
        }
      }
      sortState[sortOption] = true;
      return sortState;
    });
    const url = {
      pathname: router.pathname,
      query: {
        ...router.query,
        sort: (e.target as HTMLButtonElement).id,
      },
    };
    router.push(url);
  };

  return (
    <DropdownButton
      bsPrefix={`${styles["drp-dwn-button"]} ${
        items.length === 0 ? styles["isDisabled"] : ""
      }`}
      className={className}
      disabled={items.length === 0}
      title={
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.49998 15V13.3333H7.49998V15H2.49998ZM2.49998 10.8333V9.16667H12.5V10.8333H2.49998ZM2.49998 6.66667V5H17.5V6.66667H2.49998Z"
              fill={items.length === 0 ? "#adb5bd" : "#3E3F59"}
            />
          </svg>
          <span
            className={`${styles["ellipse-container"]} ${
              isAnySortMethodSelected ? styles["show-ellipse-container"] : ""
            }`}
          >
            <span className={styles.ellipse}></span>
          </span>
          Sort
        </>
      }
    >
      <Dropdown.Item
        as="button"
        id="recommended"
        onClick={sortDropDownClickHandler}
        className={styles.recommended}
      >
        Recommended
        {isActiveSortBy.recommended && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5501 17.9996L3.8501 12.2996L5.2751 10.8746L9.5501 15.1496L18.7251 5.97461L20.1501 7.39961L9.5501 17.9996Z"
              fill="#6033CA"
            />
          </svg>
        )}
      </Dropdown.Item>
      <Dropdown.Item
        as="button"
        id="distance"
        onClick={sortDropDownClickHandler}
      >
        Distance
        {isActiveSortBy.distance && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5501 17.9996L3.8501 12.2996L5.2751 10.8746L9.5501 15.1496L18.7251 5.97461L20.1501 7.39961L9.5501 17.9996Z"
              fill="#6033CA"
            />
          </svg>
        )}
      </Dropdown.Item>
      <Dropdown.Item
        as="button"
        id="ratings"
        onClick={sortDropDownClickHandler}
      >
        Ratings
        {isActiveSortBy.ratings && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5501 17.9996L3.8501 12.2996L5.2751 10.8746L9.5501 15.1496L18.7251 5.97461L20.1501 7.39961L9.5501 17.9996Z"
              fill="#6033CA"
            />
          </svg>
        )}
      </Dropdown.Item>
      <Dropdown.Item
        as="button"
        id="mostReviewed"
        onClick={sortDropDownClickHandler}
      >
        Most Reviewed
        {isActiveSortBy.mostReviewed && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5501 17.9996L3.8501 12.2996L5.2751 10.8746L9.5501 15.1496L18.7251 5.97461L20.1501 7.39961L9.5501 17.9996Z"
              fill="#6033CA"
            />
          </svg>
        )}
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default SortButton;
