// React

import { useState, useContext, useMemo, useEffect, useRef } from "react";

// Context

import { ReasonTimerStopped, TimerContext } from "../../context/TimerContext";
import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";

// Components

import Button from "../../components/Button/Button";
import CurrencyContainer from "../../components/CurrencyContainer/CurrencyContainer";

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
      <div
        className={classes.arrow}
        style={{
          transform: shouldShowList ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        ⮟
      </div>

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
    const result: string = event.target.value;
    const trimmedResult: number = parseInt(result, 10);
    setState(trimmedResult || 1);
    if (!trimmedResult) event.target.select();
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.select();
  };

  const totalTimeInMinutes: number =
    (activeMinutes + breakMinutes) * cycles - breakMinutes;

  const startTimerButton: JSX.Element = (
    <div className={classes.startProjectTimerButton}>
      <div>Start Timer</div>
      <CurrencyContainer amount={totalTimeInMinutes} />
    </div>
  );

  useEffect(() => {
    if (cycles === 1) {
      setBreakMinutes(0);
    } else if (cycles > 1 && breakMinutes === 0) {
      setBreakMinutes(5);
    }
  }, [breakMinutes, cycles]);

  return (
    <>
      <div className={classes.header}>{"Choose A Project"}</div>
      <ProjectSelector selectProject={selectProjectHandler} />
      <div className={classes.header}>{"Set Timer"}</div>
      <div className={classes.settings}>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Active Minutes</div>
          <input
            type="number"
            className={classes.input}
            value={activeMinutes}
            onChange={(event) => inputHandler(event, setActiveMinutes)}
            onFocus={handleFocus}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Break Minutes</div>
          <input
            type="number"
            className={classes.input}
            value={breakMinutes}
            onChange={
              cycles > 1
                ? (event) => inputHandler(event, setBreakMinutes)
                : undefined
            }
            onFocus={handleFocus}
          />
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.label}>Number of Cycles</div>
          <input
            type="number"
            className={classes.input}
            value={cycles}
            onChange={(event) => inputHandler(event, setCycles)}
            onFocus={handleFocus}
          />
        </div>
        <div className={classes.totalTimeGroup}>
          <div className={classes.label}>Total Minutes</div>
          <div className={classes.totalTime}>{totalTimeInMinutes}</div>
        </div>
      </div>
      <Button
        text={startTimerButton}
        onClick={() =>
          startTimerSession(
            activeMinutes,
            breakMinutes,
            cycles,
            timedProjectRef.current as Project
          )
        }
        style={{ backgroundColor: "lightgreen" }}
        disabled={!activeMinutes || !cycles}
      />
    </>
  );
};

const ProjectTimer = (): JSX.Element => {
  const { isActive, timer, currentStage, stopTimerSession, timerMinutes } =
    useContext(TimerContext);
  const { projects } = useContext(ProjectContext);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });
  }, [projects]);

  const resetTimerButton: JSX.Element = (
    <div className={classes.resetTimerButton}>
      <div>Give Up</div>
      <CurrencyContainer amount={timerMinutes || 0} />
    </div>
  );

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
          text={resetTimerButton}
          onClick={() => stopTimerSession(ReasonTimerStopped.Canceled)}
          style={{ backgroundColor: "lightcoral" }}
        ></Button>
      </div>
    );
  }
};

export default ProjectTimer;
