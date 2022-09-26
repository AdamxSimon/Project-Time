// React

import { useContext, useRef, useState } from "react";

// Context

import { ProjectContext } from "../../context/ProjectContext";
import { CurrencyContext } from "../../context/CurrencyContext";

// Components

import Button from "../../components/Button/Button";

// Types

import { Project, StylesObject } from "../../types";

// Utils

import { isEven } from "../../utils";

// Styles

import classes from "./styles.module.css";

interface ProjectInputFormProps {
  addProject: (project: Project) => void;
}

interface ProjectItemProps {
  project: Project;
  index: number;
  removeProject: (id: number) => void;
}

const ProjectInputForm = (props: ProjectInputFormProps): JSX.Element => {
  const { addProject } = props;

  const { projects } = useContext(ProjectContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

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
        text="Add Project"
        style={styles.button}
        onClick={() => {
          addProject({
            id: projects.length + 1,
            name: inputRef.current?.value || "",
            weeklyHours: 0,
            totalTimeSpent: "0",
          });
        }}
      />
    </div>
  );
};

const ProjectItem = (props: ProjectItemProps): JSX.Element => {
  const { project, index, removeProject } = props;

  const { removeCurrency, addCurrency } = useContext(CurrencyContext);

  const giveUp = (): void => {
    removeProject(project.id);
    removeCurrency(10);
  };

  const markComplete = (): void => {
    removeProject(project.id);
    addCurrency(10);
  };

  return (
    <div
      className={classes.projectItem}
      style={{ backgroundColor: isEven(index) ? "lightgray" : "white" }}
    >
      <div className={classes.projectNameContainer}>
        {project.name || "Project"}
      </div>

      <div className={classes.buttonContainer}>
        <Button text="Give Up" style={styles.button} onClick={giveUp} />
        <Button
          text="Mark Complete"
          style={styles.button}
          onClick={markComplete}
        />
      </div>
    </div>
  );
};

const ProjectTable = (): JSX.Element => {
  const { projects, addProject, removeProject } = useContext(ProjectContext);

  const [isAddingProject, setIsAddingProject] = useState<boolean>(
    projects.length === 0
  );

  const addProjectHandler = (project: Project) => {
    addProject(project);
    setIsAddingProject(false);
  };

  const removeProjectHandler = (id: number) => {
    removeProject(id);
    if (projects.length === 1) setIsAddingProject(true);
  };

  return (
    <div className={classes.projectTable}>
      {isAddingProject && <ProjectInputForm addProject={addProjectHandler} />}

      {!isAddingProject &&
        projects.map((project, index) => {
          return (
            <ProjectItem
              key={project.id}
              project={project}
              index={index}
              removeProject={removeProjectHandler}
            />
          );
        })}

      {!isAddingProject && (
        <div
          className={classes.addProjectRow}
          style={{
            backgroundColor: isEven(projects.length) ? "lightgray" : "white",
          }}
        >
          <Button
            text={"Add Project"}
            onClick={() => {
              setIsAddingProject(true);
            }}
            style={styles.button}
          ></Button>
        </div>
      )}
    </div>
  );
};

const styles: StylesObject = {
  button: { backgroundColor: "lightgreen" },
};

export default ProjectTable;
