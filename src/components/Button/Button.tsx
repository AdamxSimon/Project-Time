// React

import { useState } from "react";

// Types

import { StylesObject } from "../../types";

// Utils

import { combineClassNames } from "../../utils";

// Styles

import classes from "./styles.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  classOverride?: string;
  style?: React.CSSProperties;
}

const Button = (props: ButtonProps): JSX.Element => {
  const { text, onClick, disabled, classOverride, style } = props;

  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div
      className={combineClassNames(classes.button, classOverride ?? "")}
      style={
        disabled
          ? styles.disabled
          : isActive
          ? { ...style, ...styles.active }
          : style
      }
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseOut={() => setIsActive(false)}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

const styles: StylesObject = {
  disabled: {
    backgroundColor: "lightgray",
    pointerEvents: "none",
  },
  active: {
    backgroundColor: "black",
    color: "white",
  },
};

export default Button;
