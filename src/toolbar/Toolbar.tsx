// React

import { useContext, useRef } from "react";

// Context

import { CurrencyContext } from "../context/CurrencyContext";
import { ProjectContext, ProjectStatus } from "../context/ProjectContext";

// Assets

import projectsIcon from "../assets/projects.png";
import coinIcon from "../assets/coin.png";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const { projects, projectsDataRef, uploadProjectData, maxProjects } =
    useContext(ProjectContext);

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
          <img src={projectsIcon} alt="Projects" height={16} width={16} />
          <div>{`${activeProjects.length}/${maxProjects}`}</div>
        </div>
        <div className={classes.infoContainer}>
          <img src={coinIcon} alt="Currency" height={16} width={16} />
          <div>{currency}</div>
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
