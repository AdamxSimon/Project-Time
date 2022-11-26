// React

import { useContext, useState } from "react";

// Context

import { ToastContext } from "../../context/ToastContext";

// Utils

import { combineClassNames } from "../../utils";

// Styles

import classes from "./styles.module.css";

const ToastOverlay = (): JSX.Element | null => {
  const { toastMessage, toastDisplayTime, resetToast } =
    useContext(ToastContext);

  const [isRising, setIsRising] = useState<boolean>(false);

  const onAnimationEnd = (): void => {
    if (!isRising) {
      setTimeout(() => {
        setIsRising(true);
      }, toastDisplayTime);
    } else {
      resetToast();
      setIsRising(false);
    }
  };

  if (toastMessage) {
    return (
      <div
        className={combineClassNames(
          classes.toastOverlay,
          isRising ? classes.rise : classes.drop
        )}
        onAnimationEnd={onAnimationEnd}
      >
        {toastMessage}
      </div>
    );
  }

  return null;
};

export default ToastOverlay;
