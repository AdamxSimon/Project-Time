// React

import { useState, useContext, useMemo, useEffect, useRef } from "react";

// Context

import { TimerContext } from "../../context/TimerContext";
import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";

// Components

import Button from "../../components/Button/Button";

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
      onClick={() => setShouldShowList((shouldShowList) => !shouldShowList)}
    >
      <div className={classes.projectName}>{selectedProject?.name ?? ""}</div>
      <div className={classes.arrow}>▼</div>

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

  const [activeMinutes, setActiveMinutes] = useState<number>(20);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [cycles, setCycles] = useState<number>(1);

  const timedProjectRef = useRef<Project | null>(null);

  const selectProjectHandler = (project: Project) => {
    timedProjectRef.current = project;
  };

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const result: string = event.target.value;
    setState(+result);
  };

  return (
    <>
      <div className={classes.header}>{"Choose A Project"}</div>
      <ProjectSelector selectProject={selectProjectHandler} />
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
  const { isActive, timer, currentStage, stopTimerSession } =
    useContext(TimerContext);
  const { projects } = useContext(ProjectContext);

  const activeProjects = useMemo(() => {
    return projects.filter((project) => {
      return project.status === ProjectStatus.Active;
    });
  }, [projects]);

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
          text={"Reset Timer"}
          onClick={stopTimerSession}
          style={{ backgroundColor: "lightgreen" }}
        ></Button>
      </div>
    );
  }
};

export default ProjectTimer;
