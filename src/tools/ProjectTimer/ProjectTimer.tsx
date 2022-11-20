// React

import React, { useState, useContext, useMemo, useEffect, useRef } from "react";

// Context

import { ReasonTimerStopped, TimerContext } from "../../context/TimerContext";
import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";
import { ToastContext } from "../../context/ToastContext";
import { ScreenSizeContext } from "../../context/ScreenSizeContext";

// Components

import CurrencyButton from "../../components/currency-button/CurrencyButton";

// Assets

import DropdownArrowPNG from "../../assets/general/dropdown-arrow.png";
import EmptyTimerPNG from "../../assets/timer/empty-timer.png";
import TimerTickerPNG from "../../assets/timer/timer-ticker.png";

// Utils

import { extractFromDuration } from "../../utils";

// Types

import { Project } from "../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectSelectorProps {
  selectProject: (project: Project) => void;
}

const ProjectSelector = (props: ProjectSelectorProps): JSX.Element => {
  const { selectProject } = props;

  const { projects } = useContext(ProjectContext);

  const activeProjects: Project[] = useMemo(() => {
    return projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });
  }, [projects]);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    projects.find((project) => {
      return project.status === ProjectStatus.Active;
    })
  );

  const [shouldShowList, setShouldShowList] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProject) {
      selectProject(selectedProject);
    }
  }, [selectProject, selectedProject]);

  const filteredList: Project[] = activeProjects.filter((project) => {
    return project.id !== selectedProject?.id;
  });

  return (
    <div
      className={classes.projectSelector}
      style={{
        borderBottomLeftRadius: shouldShowList ? 0 : 8,
        borderBottomRightRadius: shouldShowList ? 0 : 8,
      }}
      onClick={() => setShouldShowList((shouldShowList) => !shouldShowList)}
    >
      <div className={classes.projectName}>{selectedProject?.name ?? ""}</div>
      <img
        src={DropdownArrowPNG}
        alt={"Dropdown Arrow"}
        height={16}
        className={classes.arrow}
        style={{
          transform: shouldShowList ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />

      {shouldShowList && (
        <div className={classes.projectList}>
          {filteredList.map((project) => {
            return (
              <div
                key={project.id}
                className={classes.projectItem}
                onClick={() => {
                  setSelectedProject(
                    activeProjects.find((activeProject) => {
                      return project.id === activeProject.id;
                    })
                  );
                }}
              >
                {project.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProjectTimerForm = (): JSX.Element => {
  const { startTimerSession } = useContext(TimerContext);
  const { showToast } = useContext(ToastContext);

  const [activeMinutes, setActiveMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(2);

  const timedProjectRef = useRef<Project | null>(null);

  const selectProjectHandler = (project: Project) => {
    timedProjectRef.current = project;
  };

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const result: number = parseInt(event.target.value, 10);
    if (result < 1000 || Number.isNaN(result)) {
      setState(result);
    } else if (result >= 1000) {
      showToast("Three Digits Max!");
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.select();
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>,
    shouldRevertToOne?: boolean
  ): void => {
    if (event.target.value === "" || event.target.value === "0")
      setState(shouldRevertToOne ? 1 : 0);
  };

  const totalTimeInMinutes: number = useMemo((): number => {
    const calculation: number =
      ((activeMinutes || 0) + (breakMinutes || 0)) * (cycles || 0) -
      (breakMinutes || 0);
    return calculation < 0 ? 0 : calculation;
  }, [activeMinutes, breakMinutes, cycles]);

  useEffect(() => {
    if (cycles === 1) {
      setBreakMinutes(0);
    }
  }, [cycles]);

  return (
    <div className={classes.projectTimerForm}>
      <div className={classes.header}>{"Choose A Project"}</div>
      <ProjectSelector selectProject={selectProjectHandler} />
      <div className={classes.header}>{"Set Timer"}</div>
      <div className={classes.settings}>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Active Minutes</div>
          <input
            type="number"
            className={classes.input}
            value={Number(activeMinutes).toString()}
            onChange={(event) => inputHandler(event, setActiveMinutes)}
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setActiveMinutes, true)}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Break Minutes</div>
          <input
            type="number"
            className={classes.input}
            value={Number(breakMinutes).toString()}
            onChange={
              cycles > 1
                ? (event) => inputHandler(event, setBreakMinutes)
                : () => showToast("You Need Multiple Cycles For Breaks!")
            }
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setBreakMinutes)}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Number of Cycles</div>
          <input
            type="number"
            className={classes.input}
            value={Number(cycles).toString()}
            onChange={(event) => inputHandler(event, setCycles)}
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, setCycles, true)}
          />
        </div>
        <div className={classes.totalTimeGroup}>
          <div className={classes.label}>Total Minutes</div>
          <div className={classes.totalTime}>{totalTimeInMinutes}</div>
        </div>
      </div>
      <CurrencyButton
        text={"Start Timer"}
        currencyAmount={(activeMinutes || 0) * (cycles || 0)}
        onClick={() =>
          startTimerSession(
            activeMinutes,
            breakMinutes,
            cycles,
            timedProjectRef.current as Project
          )
        }
        disabled={!activeMinutes || !cycles}
      />
    </div>
  );
};

const ProjectTimer = (): JSX.Element => {
  const { isActive, timer, status, stopTimerSession, timerMinutes } =
    useContext(TimerContext);
  const { projects } = useContext(ProjectContext);
  const { isSmallScreen } = useContext(ScreenSizeContext);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });
  }, [projects]);

  const getRotation = (): string => {
    if (!timer) {
      return `rotate(0deg)`;
    }

    const seconds: number = Number(extractFromDuration(timer, "seconds"));
    const secondsElapsed: number = 60 - seconds;
    const proportion: number = secondsElapsed / 60;
    const rotationDegrees: number = proportion
      ? Math.floor(proportion * 360)
      : 360;
    return `rotate(${rotationDegrees}deg)`;
  };

  const rotation: string = getRotation();

  if (activeProjects.length === 0) {
    return (
      <div className={classes.projectTimer}>
        <div className={classes.message}>
          The Timer Requires That You Have At Least One Active Project!
        </div>
      </div>
    );
  }

  if (!isActive) {
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
            <div className={classes.stage}></div>
            <div style={{ fontSize: isSmallScreen ? 16 : 24 }}>{timer}</div>
            <div
              className={classes.status}
              style={{ fontSize: isSmallScreen ? 12 : 16 }}
            >
              {status}
            </div>
          </div>
        </div>
        <CurrencyButton
          text={"Give Up"}
          currencyAmount={timerMinutes || 0}
          onClick={() => stopTimerSession(ReasonTimerStopped.Canceled)}
          isCostly
        />
      </div>
    );
  }
};

export default ProjectTimer;
