import React from "react";
import styles from "../styles/Avatar.modules.css";

// one version of passing down the props:
// const Avatar = (props) => {
//     const { src, height=45, text } = props;
const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;
