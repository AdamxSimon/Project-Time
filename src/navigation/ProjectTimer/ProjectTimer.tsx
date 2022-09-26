// React

import { useState, useEffect } from "react";

// Components

import Button from "../../components/Button/Button";

// Styles

import classes from "./styles.module.css";

const ProjectTimer = (): JSX.Element => {
  const [timerMinutes, setTimerMinutes] = useState<string>("00");
  const [timerSeconds, setTimerSeconds] = useState<string>("00");

  const [activeMinutes, setActiveMinutes] = useState<number>(20);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(1);

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    let result: string = event.target.value;
    setState(+result);
  };

  return (
    <div className={classes.projectTimer}>
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
        onClick={() => {}}
        style={{ backgroundColor: "lightgreen" }}
        disabled={!activeMinutes || !cycles}
      />

      <div>{`${timerMinutes} : ${timerSeconds}`}</div>
    </div>
  );
};

export default ProjectTimer;
