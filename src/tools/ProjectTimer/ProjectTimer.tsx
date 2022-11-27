// React

import { useContext, useMemo } from "react";

// Context

import { ReasonTimerStopped, TimerContext } from "../../context/TimerContext";
import { ProjectContext } from "../../context/ProjectContext";
import { ScreenSizeContext } from "../../context/ScreenSizeContext";
import { ThemesContext } from "../../context/ThemesContext";

// Components

import CurrencyButton from "../../components/currency-button/CurrencyButton";
import ProjectTimerForm from "./project-timer-form/ProjectTimerForm";

// Assets

import EmptyTimerPNG from "../../assets/timer/empty-timer.png";
import TimerTickerPNG from "../../assets/timer/timer-ticker.png";

// Utils

import { extractFromDuration } from "../../utils";

// Styles

import classes from "./styles.module.css";

const ProjectTimer = (): JSX.Element => {
  const { fonts } = useContext(ThemesContext);
  const {
    isTimerActive,
    timerAsDuration,
    timerStatus,
    totalTimerCycles,
    currentTimerCycle,
    stopTimerSession,
    timerReward,
  } = useContext(TimerContext);
  const { activeProjects } = useContext(ProjectContext);
  const { isSmallScreen } = useContext(ScreenSizeContext);

  const rotation: string = useMemo(() => {
    if (!timerAsDuration) {
      return `rotate(0deg)`;
    }

    const seconds: number = Number(
      extractFromDuration(timerAsDuration, "seconds")
    );
    const secondsElapsed: number = 60 - seconds;
    const proportion: number = secondsElapsed / 60;
    const rotationDegrees: number = proportion
      ? Math.floor(proportion * 360)
      : 360;
    return `rotate(${rotationDegrees}deg)`;
  }, [timerAsDuration]);

  if (activeProjects.length === 0) {
    return (
      <div className={classes.projectTimer}>
        <div className={classes.message} style={fonts.standard}>
          {"The Timer Requires That You Have At Least One Active Project!"}
        </div>
      </div>
    );
  }

  if (!isTimerActive) {
    return <ProjectTimerForm />;
  } else {
    return (
      <div className={classes.projectTimer}>
        <div
          className={classes.timerContainer}
          style={{ height: isSmallScreen ? 200 : 300 }}
        >
          <img
            className={classes.timerImage}
            src={EmptyTimerPNG}
            alt={"Empty Timer"}
          />
          <img
            className={classes.ticker}
            style={{ height: isSmallScreen ? 200 : 300, transform: rotation }}
            src={TimerTickerPNG}
            alt={"Ticker"}
          />
          <div
            className={classes.timerInfoContainer}
            style={{
              border: isSmallScreen ? "2px solid black" : "3px solid black",
            }}
          >
            <div className={classes.cycles} style={fonts.standard}>
              {currentTimerCycle + " / " + totalTimerCycles}
            </div>
            <div style={fonts.header}>{timerAsDuration}</div>
            <div className={classes.status} style={fonts.standard}>
              {timerStatus}
            </div>
          </div>
        </div>
        <CurrencyButton
          text={"Give Up"}
          currencyAmount={timerReward}
          onClick={() => stopTimerSession(ReasonTimerStopped.Canceled)}
          isCostly
        />
      </div>
    );
  }
};

export default ProjectTimer;
