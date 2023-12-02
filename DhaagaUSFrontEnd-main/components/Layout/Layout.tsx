import { useContext } from "react";

import styles from "../../styles/Layout.module.css";

import MainNavigation from "./MainNavigation";
import { UserLocationPermissionContext } from "@/context/user-location-permission-context";

const Layout: React.FC<{ children: JSX.Element | JSX.Element[] }> = (props) => {
  const { hasUserGrantedPermission, isLoading } = useContext(
    UserLocationPermissionContext
  );

  if (!hasUserGrantedPermission && !isLoading) {
    return (
      <div className={styles["backdrop"]}>
        <div className={styles["info-text"]}>
          <h2>Location Permission Required</h2>
          <p>This app needs your location to function properly</p>
        </div>
      </div>
    );
  }
  if (!hasUserGrantedPermission && isLoading) {
    return <div></div>;
  }

  return (
    <>
      <MainNavigation />
      <main className={`${styles.main} site-container position-relative`}>
        {props.children}
      </main>
    </>
  );
};

export default Layout;
