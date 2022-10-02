// React

import { useState, useContext } from "react";

// Context

import { TimerContext } from "../../context/TimerContext";

// Components

import Button from "../../components/Button/Button";

// Styles

import classes from "./styles.module.css";

const ProjectTimerForm = (): JSX.Element => {
  const { startTimerSession } = useContext(TimerContext);

  const [activeMinutes, setActiveMinutes] = useState<number>(20);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(1);

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const result: string = event.target.value;
    setState(+result);
  };

  return (
    <>
      <div className={classes.header}>{"Set Timer (Minutes)"}</div>
      <div className={classes.settings}>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Active</div>
          <input
            type="number"
            className={classes.input}
            value={activeMinutes || ""}
            onChange={(event) => inputHandler(event, setActiveMinutes)}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Break</div>
          <input
            type="number"
            className={classes.input}
            value={breakMinutes || ""}
            onChange={(event) => inputHandler(event, setBreakMinutes)}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Cycles</div>
          <input
            type="number"
            className={classes.input}
            value={cycles || ""}
            onChange={(event) => inputHandler(event, setCycles)}
          />
        </div>
      </div>
      <Button
        text={"Start Timer"}
        onClick={() => startTimerSession(activeMinutes, breakMinutes, cycles)}
        style={{ backgroundColor: "lightgreen" }}
        disabled={!activeMinutes || !cycles}
      />
    </>
  );
};

const ProjectTimer = (): JSX.Element => {
  const { isActive, timer, currentStage, stopTimerSession } =
    useContext(TimerContext);

  if (!isActive) {
    return (
      <div className={classes.projectTimer}>
        <ProjectTimerForm />
      </div>
    );
  } else {
    return (
      <div className={classes.projectTimer}>
        <div className={classes.stage}>{currentStage}</div>
        <div className={classes.timer}>{timer}</div>
        <Button
          text={"Reset Timer"}
          onClick={stopTimerSession}
          style={{ backgroundColor: "lightgreen" }}
        ></Button>
      </div>
    );
  }
};

export default ProjectTimer;
