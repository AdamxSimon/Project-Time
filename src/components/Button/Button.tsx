// React

import { useState } from "react";

// Types

import { StylesObject } from "../../types";

// Styles

import classes from "./styles.module.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button = (props: ButtonProps) => {
  const { text, onClick, disabled, style } = props;

  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div
      className={classes.button}
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
