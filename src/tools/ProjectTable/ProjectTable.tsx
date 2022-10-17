// React

import { useContext, useRef, useState, useMemo, useEffect } from "react";

// Context

import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";
import { CurrencyContext } from "../../context/CurrencyContext";
import { TimerContext } from "../../context/TimerContext";

// Components

import Button from "../../components/Button/Button";
import CurrencyContainer from "../../components/CurrencyContainer/CurrencyContainer";

// Assets

import sigma from "../../assets/sigma.png";
import stopwatch from "../../assets/stopwatch.png";
import pencil from "../../assets/pencil.png";

// Utils

import {
  convertDurationToSeconds,
  convertSecondsToDuration,
} from "../../utils";

// Types

import { Project, StylesObject } from "../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectItemProps {
  project: Project;
}

const ProjectInputForm = (): JSX.Element => {
  const { projects, addProject } = useContext(ProjectContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const buttonText: JSX.Element = (
    <div className={classes.addProjectFormButton}>
      <div>Add Project</div>
      <CurrencyContainer amount={10} />
    </div>
  );

  return (
    <div className={classes.inputForm}>
      <div className={classes.inputHeader}>What Would You Like To Work On?</div>
      <input
        ref={inputRef}
        className={classes.input}
        type="text"
        placeholder="Project Name"
      />
      <Button
        text={buttonText}
        style={{ backgroundColor: "lightgreen" }}
        onClick={() => {
          addProject({
            id: projects.length + 1,
            name: inputRef.current?.value || `Project #${projects.length + 1}`,
            status: ProjectStatus.Active,
            totalSecondsSpent: 0,
          });
        }}
      />
    </div>
  );
};

const ProjectItem = (props: ProjectItemProps): JSX.Element => {
  const { project } = props;

  const [isEditingTime, setIsEditingTime] = useState<boolean>(false);

  const editedHoursRef = useRef<HTMLInputElement>(null);
  const editedMinutesRef = useRef<HTMLInputElement>(null);
  const editedSecondsRef = useRef<HTMLInputElement>(null);

  const { removeCurrency, addCurrency } = useContext(CurrencyContext);
  const { completeProject, abandonProject, updateProjectSeconds } =
    useContext(ProjectContext);
  const { timedProject, timer } = useContext(TimerContext);

  const completionReward: number = Math.floor(
    project.totalSecondsSpent / 60 / 2
  );

  const giveUp = (): void => {
    abandonProject(project.id);
    removeCurrency(10);
  };

  const markComplete = (): void => {
    completeProject(project.id);
    addCurrency(completionReward);
  };

  const isProjectActivelyTimed = useMemo(() => {
    return timedProject?.id === project.id;
  }, [project.id, timedProject?.id]);

  const totalTime: string = convertSecondsToDuration(project.totalSecondsSpent);

  const giveUpButton: JSX.Element = (
    <div className={classes.projectItemButton}>
      <div>Give Up</div>
      <CurrencyContainer amount={10} />
    </div>
  );

  const markCompleteButton: JSX.Element = (
    <div className={classes.projectItemButton}>
      <div>Mark Complete</div>
      <CurrencyContainer amount={completionReward} />
    </div>
  );

  useEffect(() => {
    if (
      isEditingTime &&
      editedHoursRef.current &&
      editedMinutesRef.current &&
      editedSecondsRef.current
    ) {
      editedHoursRef.current.value = totalTime.substring(0, 2);
      editedMinutesRef.current.value = totalTime.substring(3, 5);
      editedSecondsRef.current.value = totalTime.substring(6, 8);
    }
  }, [isEditingTime, totalTime]);

  return (
    <div className={classes.projectItem}>
      <div className={classes.infoContainer}>
        <div className={classes.projectName}>{project.name}</div>
        <div className={classes.timeInfo}>
          <div className={classes.totalTime}>
            <img
              height={"100%"}
              className={classes.icon}
              src={sigma}
              alt={"Sigma"}
            />
            {isEditingTime ? (
              <div className={classes.timeEditor}>
                <input
                  ref={editedHoursRef}
                  className={classes.timeInput}
                  type="number"
                />
                :
                <input
                  ref={editedMinutesRef}
                  className={classes.timeInput}
                  type="number"
                />
                :
                <input
                  ref={editedSecondsRef}
                  className={classes.timeInput}
                  type="number"
                />
              </div>
            ) : (
              <div>{totalTime}</div>
            )}
          </div>
          {isProjectActivelyTimed ? (
            <div className={classes.timer}>
              <img
                height={"100%"}
                className={classes.icon}
                src={stopwatch}
                alt={"Stopwatch"}
              />
              <div>{timer}</div>
            </div>
          ) : (
            <>
              <img
                height={"100%"}
                className={classes.pencil}
                src={pencil}
                alt="Pencil"
                onClick={() => {
                  setIsEditingTime(!isEditingTime);
                  if (
                    isEditingTime &&
                    editedHoursRef.current &&
                    editedMinutesRef.current &&
                    editedSecondsRef.current
                  ) {
                    updateProjectSeconds(
                      project,
                      convertDurationToSeconds(
                        +editedHoursRef.current.value,
                        +editedMinutesRef.current.value,
                        +editedSecondsRef.current.value
                      )
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          text={giveUpButton}
          style={{ ...styles.projectItemButton, backgroundColor: "lightcoral" }}
          onClick={giveUp}
        />
        <Button
          text={markCompleteButton}
          style={styles.projectItemButton}
          onClick={markComplete}
        />
      </div>
    </div>
  );
};

const ProjectTable = (): JSX.Element => {
  const {
    projects,
    projectSlotUpgradeCost,
    maxProjects,
    upgradeProjectSlots,
    isAddingProject,
    setIsAddingProject,
  } = useContext(ProjectContext);
  const { currency } = useContext(CurrencyContext);

  const [activeFilters, setActiveFilters] = useState<ProjectStatus[]>([
    ProjectStatus.Active,
  ]);

  const renderedProjects = useMemo(() => {
    return projects.filter((project) => {
      return activeFilters.includes(project.status);
    });
  }, [projects, activeFilters]);

  if (isAddingProject) {
    return (
      <div className={classes.projectTable}>
        <ProjectInputForm />
      </div>
    );
  } else {
    return (
      <>
        <div className={classes.projectTable}>
          {renderedProjects.map((project) => {
            return <ProjectItem key={project.id} project={project} />;
          })}
        </div>
        <div
          onClick={
            currency > projectSlotUpgradeCost
              ? () => {
                  setIsAddingProject(true);
                }
              : undefined
          }
          className={classes.addProjectButton}
        >
          +
        </div>
      </>
    );
  }
};

const styles: StylesObject = {
  projectItemButton: {
    backgroundColor: "lightgreen",
  },
};

export default ProjectTable;
