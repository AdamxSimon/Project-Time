// React

import { useContext, useRef } from "react";

// Context

import { CurrencyContext } from "../context/CurrencyContext";
import { ProjectContext, ProjectStatus } from "../context/ProjectContext";
import { TimerContext } from "../context/TimerContext";

// Assets

import ProjectPNG from "../assets/projects.png";
import CoinPNG from "../assets/coin.png";
import TimerPNG from "../assets/timer.png";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const { projects, projectsDataRef, uploadProjectData, maxProjects } =
    useContext(ProjectContext);
  const { timer } = useContext(TimerContext);

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
    <div className={classes.toolbar}>
      <div className={classes.infoContainers}>
        <div className={classes.infoContainer}>
          <img src={ProjectPNG} alt={"ProjectPNG"} height={16} width={16} />
          <div>{`${activeProjects.length}/${maxProjects}`}</div>
        </div>
        <div className={classes.infoContainer}>
          <img src={CoinPNG} alt={"CoinPNG"} height={16} width={16} />
          <div>{currency}</div>
        </div>
        <div className={classes.infoContainer}>
          <img src={TimerPNG} alt={"TimerPNG"} height={16} width={16} />
          <div>{timer}</div>
        </div>
      </div>

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
            }
          }}
        />
      </div>
    </div>
  );
};

export default Toolbar;
