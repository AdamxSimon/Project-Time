// Assets

import { useContext } from "react";
import fireworks from "../../assets/fireworks.png";

// Components

import Button from "../../components/Button/Button";
import { ModalContext } from "../../context/ModalContext";

// Styles

import classes from "./styles.module.css";

interface TimerCompleteModalProps {
  coins: number;
}

const TimerCompleteModal = (props: TimerCompleteModalProps): JSX.Element => {
  const { coins } = props;

  const { dismissModal } = useContext(ModalContext);

  return (
    <div className={classes.modalContainer}>
      <img
        className={classes.image}
        src={fireworks}
        alt="Fireworks"
        height={100}
      />
      <div className={classes.header}>Keep It Up!</div>
      <div className={classes.body}>
        You've just completed a timer session and earned{" "}
        <strong>
          {coins} gold coin{coins > 1 ? "s" : ""}
        </strong>
        . Remember that completing your project becomes more valuable with the
        time that you spend on it.
      </div>
      <Button
        text={"Close"}
        onClick={dismissModal}
        style={{ backgroundColor: "lightgreen" }}
      />
    </div>
  );
};

export default TimerCompleteModal;
