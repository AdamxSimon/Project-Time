// React

import { useContext } from "react";

// Context

import { ThemesContext } from "../../context/ThemesContext";

// Styles

import classes from "./styles.module.css";

export interface InfoContainerProps {
  icon: string;
  altText: string;
  info: string;
}

const InfoContainer = (props: InfoContainerProps): JSX.Element => {
  const { icon, altText, info } = props;

  const { fonts } = useContext(ThemesContext);

  return (
    <div className={classes.infoContainer}>
      <img src={icon} alt={altText} height={fonts.standard.fontSize} />
      <div style={fonts.standard}>{info}</div>
    </div>
  );
};

export default InfoContainer;
