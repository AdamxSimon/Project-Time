// React

import { useContext, useState } from "react";

// Context

import { ToastContext } from "../../context/ToastContext";

// Utils

import { combineClassNames } from "../../utils";

// Styles

import classes from "./styles.module.css";

const ToastOverlay = (): JSX.Element | null => {
  const { message, displayTime, resetToast } = useContext(ToastContext);

  const [isRising, setIsRising] = useState<boolean>(false);

  const onAnimationEnd = (): void => {
    if (!isRising) {
      setTimeout(() => {
        setIsRising(true);
      }, displayTime);
    } else {
      resetToast();
      setIsRising(false);
    }
  };

  if (message) {
    return (
      <div
        className={combineClassNames(
          classes.toast,
          isRising ? classes.rise : classes.drop
        )}
        onAnimationEnd={onAnimationEnd}
      >
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default ToastOverlay;
