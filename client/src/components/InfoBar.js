// InfoBar.js: React component for displaying stats about who's turn it is and who wins/loses
import React from "react";

const InfoBar = ({ message }) => {
  let style = { backgroundColor: "yellow", padding: "5px" };
  return <p style={style}>{message}</p>;
};

export default InfoBar;
