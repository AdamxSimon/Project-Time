// React

import { useContext } from "react";

// Context

import { CurrencyContext } from "../context/CurrencyContext";
import { ProjectContext, ProjectStatus } from "../context/ProjectContext";

// Components

import Button from "../components/Button/Button";

// Assets

import projectsIcon from "../assets/projects.png";
import coinIcon from "../assets/coin.png";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);
  const { projects, maxProjects } = useContext(ProjectContext);

  const activeProjects = projects.filter((project) => {
    return project.status === ProjectStatus.Active;
  });

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
        <Button
          text={"Save"}
          onClick={() => {}}
          style={{ backgroundColor: "lightgray" }}
        />
        <Button
          text={"Import"}
          onClick={() => {}}
          style={{ backgroundColor: "lightgray" }}
        />
      </div>
    </div>
  );
};

export default Toolbar;
