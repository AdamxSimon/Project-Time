// React

import { useState } from "react";

// Types

import { StylesObject } from "../../types";

// Utils

import { combineClassNames } from "../../utils";

// Styles

import classes from "./styles.module.css";

export enum ButtonAnimations {
  FadeIn = "fadeIn",
}

interface ButtonProps {
  text: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  animation?: ButtonAnimations;
}

const Button = (props: ButtonProps) => {
  const { text, disabled, style, animation } = props;

  const [isActive, setIsActive] = useState<boolean>(false);

  const animations: { [animation: string]: string } = {
    fadeIn: classes.fadeIn,
  };

  return (
    <div
      className={combineClassNames(
        classes.button,
        animation ? animations[animation] : ""
      )}
      style={
        disabled
          ? styles.disabled
          : isActive
          ? { ...style, ...styles.active }
          : style
      }
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
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
