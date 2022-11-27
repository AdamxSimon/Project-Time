// React

import { useCallback, useContext, useEffect, useMemo, useState } from "react";

// Components

import CurrencyButton from "../../../components/currency-button/CurrencyButton";

// Context

import { CurrencyContext } from "../../../context/CurrencyContext";
import { ProjectContext } from "../../../context/ProjectContext";
import { ThemesContext } from "../../../context/ThemesContext";
import { TimerContext } from "../../../context/TimerContext";
import { ToastContext } from "../../../context/ToastContext";

// Assets

import CheckmarkPNG from "../../../assets/general/checkmark.png";
import PencilPNG from "../../../assets/general/pencil.png";
import SigmaPNG from "../../../assets/timer/sigma.png";
import TimerPNG from "../../../assets/timer/timer.png";

// Utils

import {
  convertDurationToSeconds,
  convertSecondsToDuration,
  extractFromDuration,
} from "../../../utils";

// Types

import { Project } from "../../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectItemProps {
  project: Project;
}

const ProjectItem = (props: ProjectItemProps): JSX.Element => {
  const { project } = props;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [editedName, setEditedName] = useState<string>("");

  const [editedHours, setEditedHours] = useState<string>("");
  const [editedMinutes, setEditedMinutes] = useState<string>("");
  const [editedSeconds, setEditedSeconds] = useState<string>("");

  const { addCurrency } = useContext(CurrencyContext);
  const {
    completeProject,
    abandonProject,
    updateProjectName,
    updateProjectSeconds,
  } = useContext(ProjectContext);
  const { fonts } = useContext(ThemesContext);
  const { timedProject, timerAsDuration } = useContext(TimerContext);
  const { showToast } = useContext(ToastContext);

  const completionReward: number = useMemo(() => {
    return Math.floor(project.totalSecondsSpent / 60 / 2);
  }, [project]);

  const markComplete = useCallback((): void => {
    completeProject(project.id);
    addCurrency(completionReward);
  }, [addCurrency, completeProject, completionReward, project]);

  const isProjectActivelyTimed = useMemo(() => {
    return timedProject?.id === project.id;
  }, [project, timedProject]);

  const totalTime: string = useMemo(() => {
    return convertSecondsToDuration(project.totalSecondsSpent);
  }, [project]);

  const handleInput = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      setState: React.Dispatch<React.SetStateAction<string>>
    ): void => {
      const result: number = parseInt(event.target.value, 10);
      if (result < 1000 || Number.isNaN(result)) {
        setState(result.toString());
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

  useEffect((): void => {
    if (isEditing) {
      setEditedName(project.name);
      setEditedHours(extractFromDuration(totalTime, "hours"));
      setEditedMinutes(extractFromDuration(totalTime, "minutes"));
      setEditedSeconds(extractFromDuration(totalTime, "seconds"));
    }
  }, [isEditing, project, totalTime]);

  return (
    <div className={classes.projectItem}>
      <div className={classes.infoContainer}>
        <div className={classes.projectName}>
          {isEditing ? (
            <input
              className={classes.nameInput}
              style={fonts.header}
              type="text"
              value={editedName}
              onChange={(event) => {
                setEditedName(event.target.value);
              }}
              onFocus={handleFocus}
            />
          ) : (
            <div style={fonts.header}>{project.name}</div>
          )}

          {!isProjectActivelyTimed && (
            <img
              height={fonts.standard.fontSize}
              style={{ cursor: "pointer" }}
              src={isEditing ? CheckmarkPNG : PencilPNG}
              alt={isEditing ? "Confirm" : "Edit"}
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
              height={fonts.standard.fontSize}
              className={classes.icon}
              src={SigmaPNG}
              alt={"Sigma"}
            />
            {isEditing ? (
              <div className={classes.timeEditor}>
                <input
                  className={classes.timeInput}
                  style={fonts.standard}
                  type={"number"}
                  value={editedHours}
                  onChange={(event) => handleInput(event, setEditedHours)}
                  onFocus={handleFocus}
                />
                <div>{":"}</div>
                <input
                  className={classes.timeInput}
                  style={fonts.standard}
                  type={"number"}
                  value={editedMinutes}
                  onChange={(event) => handleInput(event, setEditedMinutes)}
                  onFocus={handleFocus}
                />
                <div>{":"}</div>
                <input
                  className={classes.timeInput}
                  style={fonts.standard}
                  type={"number"}
                  value={editedSeconds}
                  onChange={(event) => handleInput(event, setEditedSeconds)}
                  onFocus={handleFocus}
                />
              </div>
            ) : (
              <div style={fonts.standard}>{totalTime}</div>
            )}
          </div>

          {isProjectActivelyTimed && (
            <div className={classes.timer}>
              <img
                height={fonts.standard.fontSize}
                src={TimerPNG}
                alt={"Timer"}
              />
              <div style={fonts.standard}>{timerAsDuration}</div>
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className={classes.buttonContainer}>
          <CurrencyButton
            text={"Abandon"}
            currencyAmount={10}
            onClick={() => {
              abandonProject(project.id);
            }}
            isCostly
          />
          <CurrencyButton
            text={"Complete"}
            currencyAmount={completionReward}
            onClick={markComplete}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
