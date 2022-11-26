// React

import { useContext, useRef } from "react";

// Context

import { CurrencyContext } from "../context/CurrencyContext";
import { ProjectContext, ProjectStatus } from "../context/ProjectContext";
import { TimerContext } from "../context/TimerContext";
import { ScreenSizeContext } from "../context/ScreenSizeContext";

// Assets

import CoinPNG from "../assets/currency/coin.png";
import ProjectPNG from "../assets/projects/projects-sheet.png";
import TimerPNG from "../assets/timer/timer.png";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const { projects, projectsDataRef, uploadProjectData, maxProjects } =
    useContext(ProjectContext);
  const { timerAsDuration } = useContext(TimerContext);
  const { isSmallScreen } = useContext(ScreenSizeContext);

  const uploadProjectsRef = useRef<HTMLInputElement | null>(null);

  const activeProjects = projects.filter((project) => {
    return project.status === ProjectStatus.Active;
  });

  const handleUpload = (): void => {
    if (uploadProjectsRef.current) {
      uploadProjectsRef.current.click();
    }
  };

  return (
    <div
      className={classes.toolbar}
      style={{ justifyContent: isSmallScreen ? "center" : "space-between" }}
    >
      <div className={classes.infoContainers}>
        <div className={classes.infoContainer}>
          <img
            src={ProjectPNG}
            alt={"ProjectPNG"}
            height={isSmallScreen ? 12 : 16}
          />
          <div
            style={{ fontSize: isSmallScreen ? 12 : 16 }}
          >{`${activeProjects.length} / ${maxProjects}`}</div>
        </div>
        <div className={classes.infoContainer}>
          <img src={CoinPNG} alt={"CoinPNG"} height={isSmallScreen ? 12 : 16} />
          <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>{currency}</div>
        </div>
        <div className={classes.infoContainer}>
          <img
            src={TimerPNG}
            alt={"TimerPNG"}
            height={isSmallScreen ? 12 : 16}
          />
          <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>
            {timerAsDuration}
          </div>
        </div>
      </div>

      {!isSmallScreen && (
        <div className={classes.settingsContainer}>
          <a
            className={classes.settingsButton}
            href={projectsDataRef}
            download={"projects.json"}
          >
            {"Save"}
          </a>

          <div className={classes.settingsButton} onClick={handleUpload}>
            {"Upload"}
          </div>

          <input
            ref={uploadProjectsRef}
            style={{ display: "none" }}
            type={"file"}
            accept={".json"}
            onChange={async () => {
              if (uploadProjectsRef?.current?.files) {
                const file: File = uploadProjectsRef.current.files[0];
                const fileText: string = await file.text();
                const projectData = JSON.parse(fileText);
                uploadProjectData(projectData);
                uploadProjectsRef.current.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toolbar;
