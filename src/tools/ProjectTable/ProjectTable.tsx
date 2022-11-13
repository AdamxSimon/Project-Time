// React

import { useContext, useRef, useState, useMemo, useEffect } from "react";

// Context

import { ProjectContext, ProjectStatus } from "../../context/ProjectContext";
import { CurrencyContext } from "../../context/CurrencyContext";
import { TimerContext } from "../../context/TimerContext";
import { ToastContext } from "../../context/ToastContext";
import { ScreenSizeContext } from "../../context/ScreenSizeContext";

// Components

import Button from "../../components/Button/Button";
import CurrencyContainer from "../../components/CurrencyContainer/CurrencyContainer";

// Assets

import SigmaPNG from "../../assets/sigma.png";
import TimerPNG from "../../assets/timer.png";
import PencilPNG from "../../assets/pencil.png";
import checkmark from "../../assets/checkmark.png";
import close from "../../assets/close.png";

// Utils

import {
  convertDurationToSeconds,
  convertSecondsToDuration,
  extractFromDuration,
} from "../../utils";

// Types

import { Project, StylesObject } from "../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectItemProps {
  project: Project;
}

const ProjectInputForm = (): JSX.Element => {
  const { projects, addProject, setIsAddingProject } =
    useContext(ProjectContext);

  const activeProjects: Project[] = projects.filter(
    (project) => project.status === ProjectStatus.Active
  );

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
            id: Date.now(),
            name: inputRef.current?.value || `Project #${projects.length + 1}`,
            status: ProjectStatus.Active,
            totalSecondsSpent: 0,
          });
        }}
      />
      {activeProjects.length !== 0 && (
        <img
          className={classes.closeButton}
          src={close}
          alt={"Close"}
          height={20}
          onClick={() => setIsAddingProject(false)}
        />
      )}
    </div>
  );
};

const ProjectItem = (props: ProjectItemProps): JSX.Element => {
  const { project } = props;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [editedName, setEditedName] = useState<string>("");

  const [editedHours, setEditedHours] = useState<string>("");
  const [editedMinutes, setEditedMinutes] = useState<string>("");
  const [editedSeconds, setEditedSeconds] = useState<string>("");

  const { removeCurrency, addCurrency } = useContext(CurrencyContext);
  const {
    completeProject,
    abandonProject,
    updateProjectName,
    updateProjectSeconds,
  } = useContext(ProjectContext);
  const { timedProject, timer } = useContext(TimerContext);
  const { showToast } = useContext(ToastContext);
  const { isSmallScreen } = useContext(ScreenSizeContext);

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
      <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>{"Abandon"}</div>
      <CurrencyContainer amount={10} />
    </div>
  );

  const markCompleteButton: JSX.Element = (
    <div className={classes.projectItemButton}>
      <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>{"Complete"}</div>
      <CurrencyContainer amount={completionReward} />
    </div>
  );

  const inputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    const result: number = parseInt(event.target.value, 10);
    if (result < 1000 || Number.isNaN(result)) {
      setState(result.toString());
    } else if (result >= 1000) {
      showToast("Three Digits Max!");
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.select();
  };

  useEffect(() => {
    if (isEditing) {
      setEditedName(project.name);
      setEditedHours(extractFromDuration(totalTime, "hours"));
      setEditedMinutes(extractFromDuration(totalTime, "minutes"));
      setEditedSeconds(extractFromDuration(totalTime, "seconds"));
    }
  }, [isEditing, project.name, totalTime]);

  return (
    <div className={classes.projectItem}>
      <div className={classes.infoContainer}>
        <div className={classes.projectName}>
          {isEditing ? (
            <input
              className={classes.nameInput}
              style={{ fontSize: isSmallScreen ? 14 : 20 }}
              type="text"
              value={editedName}
              onChange={(event) => {
                setEditedName(event.target.value);
              }}
              onFocus={handleFocus}
            />
          ) : (
            <div style={{ fontSize: isSmallScreen ? 14 : 20 }}>
              {project.name}
            </div>
          )}

          {!isProjectActivelyTimed && (
            <img
              height={isSmallScreen ? 12 : 20}
              className={classes.pencil}
              style={{ marginLeft: 8 }}
              src={isEditing ? checkmark : PencilPNG}
              alt="Edit"
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  updateProjectName(project, editedName);
                  updateProjectSeconds(
                    project,
                    convertDurationToSeconds(
                      +editedHours || 0,
                      +editedMinutes || 0,
                      +editedSeconds || 0
                    )
                  );
                }
              }}
            />
          )}
        </div>
        <div className={classes.timeInfo}>
          <div className={classes.totalTime}>
            <img
              height={isSmallScreen ? 12 : 20}
              className={classes.icon}
              src={SigmaPNG}
              alt={"Sigma"}
            />
            {isEditing ? (
              <div className={classes.timeEditor}>
                <input
                  className={classes.timeInput}
                  style={{ fontSize: isSmallScreen ? 12 : 16 }}
                  type="number"
                  value={editedHours}
                  onChange={(event) => inputHandler(event, setEditedHours)}
                  onFocus={handleFocus}
                />
                :
                <input
                  className={classes.timeInput}
                  style={{ fontSize: isSmallScreen ? 12 : 16 }}
                  type="number"
                  value={editedMinutes}
                  onChange={(event) => inputHandler(event, setEditedMinutes)}
                  onFocus={handleFocus}
                />
                :
                <input
                  className={classes.timeInput}
                  style={{ fontSize: isSmallScreen ? 12 : 16 }}
                  type="number"
                  value={editedSeconds}
                  onChange={(event) => inputHandler(event, setEditedSeconds)}
                  onFocus={handleFocus}
                />
              </div>
            ) : (
              <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>
                {totalTime}
              </div>
            )}
          </div>
          {isProjectActivelyTimed && (
            <div className={classes.timer}>
              <img
                height={isSmallScreen ? 12 : 20}
                className={classes.icon}
                src={TimerPNG}
                alt={"Timer"}
              />
              <div style={isSmallScreen ? { fontSize: 12 } : undefined}>
                {timer}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className={classes.buttonContainer}>
          <Button
            text={giveUpButton}
            style={{
              ...styles.projectItemButton,
              backgroundColor: "lightcoral",
            }}
            onClick={giveUp}
          />
          <Button
            text={markCompleteButton}
            style={styles.projectItemButton}
            onClick={markComplete}
          />
        </div>
      )}
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
  const { showToast } = useContext(ToastContext);

  const [activeFilters, setActiveFilters] = useState<ProjectStatus[]>([
    ProjectStatus.Active,
  ]);

  const activeProjects: Project[] = projects.filter(
    (project) => project.status === ProjectStatus.Active
  );

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
          className={classes.addProjectButton}
          onClick={() => {
            if (activeProjects.length !== maxProjects) {
              setIsAddingProject(true);
            } else if (currency > projectSlotUpgradeCost) {
              upgradeProjectSlots();
            } else {
              showToast("Not Enough Coins!");
            }
          }}
          style={{
            backgroundColor:
              activeProjects.length === maxProjects ? "lightcoral" : "white",
          }}
        >
          <div>
            {activeProjects.length === maxProjects
              ? "Upgrade Project Slots"
              : "Add Project"}
          </div>
          {activeProjects.length === maxProjects && (
            <CurrencyContainer amount={projectSlotUpgradeCost} />
          )}
        </div>
      </>
    );
  }
};

const styles: StylesObject = {
  projectItemButton: {
    backgroundColor: "lightgreen",
    flex: 1,
  },
};

export default ProjectTable;
