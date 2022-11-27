// React

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Context

import { ThemesContext } from "../../../context/ThemesContext";
import { TimerContext } from "../../../context/TimerContext";
import { ToastContext } from "../../../context/ToastContext";

// Components

import CurrencyButton from "../../../components/currency-button/CurrencyButton";
import ProjectSelector from "../project-selector/ProjectSelector";

// Types

import { Project } from "../../../types";

// Styles

import classes from "./styles.module.css";

const ProjectTimerForm = (): JSX.Element => {
  const { fonts } = useContext(ThemesContext);
  const { startTimerSession } = useContext(TimerContext);
  const { showToast } = useContext(ToastContext);

  const [activeMinutes, setActiveMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(2);

  const timedProjectRef = useRef<Project | null>(null);

  const selectProjectHandler = useCallback((project: Project): void => {
    timedProjectRef.current = project;
  }, []);

  const handleInput = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      setState: React.Dispatch<React.SetStateAction<number>>
    ): void => {
      const result: number = parseInt(event.target.value, 10);
      if (result < 1000 || Number.isNaN(result)) {
        setState(result);
      } else if (result >= 1000) {
        showToast("Three Digits Max!");
      }
    },
    [showToast]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      event.target.select();
    },
    []
  );

  const handleBlur = useCallback(
    (
      event: React.FocusEvent<HTMLInputElement>,
      setState: React.Dispatch<React.SetStateAction<number>>,
      shouldRevertToOne?: boolean
    ): void => {
      if (event.target.value === "" || event.target.value === "0")
        setState(shouldRevertToOne ? 1 : 0);
    },
    []
  );

  const totalTimeInMinutes: number = useMemo((): number => {
    const calculation: number =
      ((activeMinutes || 0) + (breakMinutes || 0)) * (cycles || 0) -
      (breakMinutes || 0);
    return calculation < 0 ? 0 : calculation;
  }, [activeMinutes, breakMinutes, cycles]);

  useEffect((): void => {
    if (cycles === 1) {
      setBreakMinutes(0);
    }
  }, [cycles]);

  return (
    <div className={classes.projectTimerForm}>
      <div className={classes.header} style={fonts.header}>
        {"Choose A Project"}
      </div>

      <ProjectSelector selectProject={selectProjectHandler} />

      <div className={classes.header} style={fonts.header}>
        {"Set Timer"}
      </div>

      <div className={classes.settings}>
        <div className={classes.inputGroup}>
          <div className={classes.label} style={fonts.standard}>
            {"Active Minutes"}
          </div>
          <input
            type={"number"}
            className={classes.input}
            style={fonts.standard}
            value={Number(activeMinutes).toString()}
            onChange={(event) => handleInput(event, setActiveMinutes)}
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setActiveMinutes, true)}
          />
        </div>

        <div className={classes.inputGroup}>
          <div className={classes.label} style={fonts.standard}>
            {"Break Minutes"}
          </div>
          <input
            type={"number"}
            className={classes.input}
            style={fonts.standard}
            value={Number(breakMinutes).toString()}
            onChange={
              cycles > 1
                ? (event) => handleInput(event, setBreakMinutes)
                : () => showToast("You Need Multiple Cycles For Breaks!")
            }
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setBreakMinutes)}
          />
        </div>

        <div className={classes.inputGroup}>
          <div className={classes.label} style={fonts.standard}>
            {"Number of Cycles"}
          </div>
          <input
            type={"number"}
            className={classes.input}
            style={fonts.standard}
            value={Number(cycles).toString()}
            onChange={(event) => handleInput(event, setCycles)}
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setCycles, true)}
          />
        </div>

        <div className={classes.totalTimeGroup}>
          <div className={classes.label} style={fonts.standard}>
            {"Total Minutes"}
          </div>
          <div className={classes.totalTime} style={fonts.standard}>
            {totalTimeInMinutes}
          </div>
        </div>
      </div>

      <CurrencyButton
        text={"Start Timer"}
        currencyAmount={(activeMinutes || 0) * (cycles || 0)}
        onClick={() => {
          if (timedProjectRef.current) {
            startTimerSession(
              activeMinutes,
              breakMinutes,
              cycles,
              timedProjectRef.current
            );
          }
        }}
        disabled={!activeMinutes || !cycles}
      />
    </div>
  );
};

export default ProjectTimerForm;
