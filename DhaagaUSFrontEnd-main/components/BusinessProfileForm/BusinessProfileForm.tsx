import BackButton from "@/components/Ui/BackButton/BackButton";
import { ListData } from "@/Models/ListData";
import NewForm from "./NewBusinessProfileForm/NewForm";
import EditForm from "./EditBusinessProfileForm/EditForm";

import styles from "../../styles/BusinessProfileForm.module.css";
import Header from "../Header/Header";

const BusinessProfileForm = (props: {
  action: string;
  product?: ListData | undefined;
}) => {
  const { action, product } = props;
  return (
    <div className={styles["grid-row-container"]}>
      <div className="d-none d-md-block position-relative">
        <BackButton />
      </div>
      <div className="d-flex flex-column" style={{ gap: 8 }}>
        {/* <div className={`wrapper ${styles.head}`}>
          {action === "new" ? "Create" : "Edit"} Business Profile
        </div> */}
        <Header
          showEditButton={false}
          headerText={`${
            action === "new" ? "Create" : "Edit"
          } Business Profile`}
        />
        {action === "new" && <NewForm />}
        {action === "edit" && <EditForm product={product} />}
      </div>
      <div></div>
    </div>
  );
};

export default BusinessProfileForm;
