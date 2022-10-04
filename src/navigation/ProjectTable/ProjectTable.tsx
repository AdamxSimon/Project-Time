// React

import { useContext, useRef, useState } from "react";

// Context

import { ProjectContext } from "../../context/ProjectContext";
import { CurrencyContext } from "../../context/CurrencyContext";

// Components

import Button from "../../components/Button/Button";

// Types

import { Project, StylesObject } from "../../types";

// Styles

import classes from "./styles.module.css";

interface ProjectInputFormProps {
  addProject: (project: Project) => void;
}

interface ProjectItemProps {
  project: Project;
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
        style={{ backgroundColor: "lightgreen" }}
        onClick={() => {
          addProject({
            id: projects.length + 1,
            name: inputRef.current?.value || "",
            totalMinutesSpent: 0,
          });
        }}
      />
    </div>
  );
};

const ProjectItem = (props: ProjectItemProps): JSX.Element => {
  const { project, removeProject } = props;

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
    <div className={classes.projectItem}>
      <div className={classes.infoContainer}>
        <div className={classes.projectName}>{project.name || "Project"}</div>
        <div>{`${project.totalMinutesSpent} Minutes Spent`}</div>
      </div>
      <div className={classes.buttonContainer}>
        <Button
          text="Give Up"
          style={styles.projectItemButton}
          onClick={giveUp}
        />
        <Button
          text="Mark Complete"
          style={styles.projectItemButton}
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

  if (isAddingProject) {
    return (
      <div className={classes.projectTable}>
        <ProjectInputForm addProject={addProjectHandler} />
      </div>
    );
  } else {
    return (
      <>
        <div className={classes.projectTable}>
          {projects.map((project) => {
            return (
              <ProjectItem
                key={project.id}
                project={project}
                removeProject={removeProjectHandler}
              />
            );
          })}
        </div>
        <div
          onClick={() => {
            setIsAddingProject(true);
          }}
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
