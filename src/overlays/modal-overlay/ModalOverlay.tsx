// React

import { useContext } from "react";

// Context

import { ModalContext } from "../../context/ModalContext";

// Styles

import classes from "./styles.module.css";

const ModalOverlay = (): JSX.Element | null => {
  const { isPresenting, modalComponent } = useContext(ModalContext);

  if (isPresenting) {
    return (
      <div className={classes.modalOverlay}>
        <div className={classes.modalBackdrop}></div>
        <div className={classes.modalContainer}>{modalComponent}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default ModalOverlay;
