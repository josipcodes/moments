import NoResults from ".././assets/no-results.png";
import styles from ".././styles/NotFound.module.css";
import React from "react";
import Asset from "./Asset";

// rafce
const NotFound = () => {
  return (
    <div className={styles.NotFound}>
      <Asset
        src={NoResults}
        message={"Sorry, the page you're looking for doesn't exist"}
      />
    </div>
  );
};

export default NotFound;
