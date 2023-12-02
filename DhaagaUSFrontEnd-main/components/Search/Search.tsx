import { ChangeEvent } from "react";
import styles from "../../styles/Search.module.css";

const Search = (props: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { value, onChange } = props;

  // const searchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   props.onChange(e.target.value);
  // };

  return (
    <form className={styles.search}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7001 17.4001C14.8481 17.4001 17.4001 14.8481 17.4001 11.7001C17.4001 8.552 14.8481 6 11.7001 6C8.55201 6 6 8.552 6 11.7001C6 14.8481 8.55201 17.4001 11.7001 17.4001Z"
          stroke="#9B9AB9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.0001 19.0004L15.825 15.8252"
          stroke="#9B9AB9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        name="search"
        placeholder="Search for desi stuff..."
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default Search;
