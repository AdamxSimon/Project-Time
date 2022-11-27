// React

import { useContext, useRef } from "react";

// Components

import CurrencyButton from "../../../components/currency-button/CurrencyButton";

// Context

import { ProjectContext, ProjectStatus } from "../../../context/ProjectContext";

// Assets

import CloseButtonPNG from "../../../assets/general/close-button.png";

// Styles

import classes from "./styles.module.css";

const ProjectInputForm = (): JSX.Element => {
  const { projects, activeProjects, addProject, setIsAddingProject } =
    useContext(ProjectContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classes.inputForm}>
      <div className={classes.inputHeader}>
        {"What Would You Like To Work On?"}
      </div>

      <input
        ref={inputRef}
        className={classes.input}
        type={"text"}
        placeholder={"Project Name"}
      />

      <CurrencyButton
        text={"Add Project"}
        currencyAmount={10}
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
          src={CloseButtonPNG}
          alt={"Close"}
          height={20}
          onClick={() => setIsAddingProject(false)}
        />
      )}
    </div>
  );
};

export default ProjectInputForm;
