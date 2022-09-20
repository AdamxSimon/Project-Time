// React

import { useContext, useRef } from "react";

// Context

import { ProjectContext } from "../../context/ProjectContext";

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
  index: number;
  removeProject: (id: number) => void;
}

const ProjectInputForm = (props: ProjectInputFormProps): JSX.Element => {
  const { addProject } = props;

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
            id: 1,
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

  const isEven: boolean = index % 2 === 0;

  return (
    <div
      className={classes.projectItem}
      style={{ backgroundColor: isEven ? "lightgray" : "white" }}
    >
      <div className={classes.projectNameContainer}>{project.name}</div>

      <div className={classes.buttonContainer}>
        <Button
          text="Give Up"
          style={styles.button}
          onClick={() => {
            removeProject(project.id);
          }}
        />
        <Button
          text="Mark Complete"
          style={styles.button}
          onClick={() => {
            removeProject(project.id);
          }}
        />
      </div>
    </div>
  );
};

const ProjectTable = (): JSX.Element => {
  const { projects, addProject, removeProject } = useContext(ProjectContext);

  return (
    <div className={classes.projectTable}>
      {projects.length === 0 && <ProjectInputForm addProject={addProject} />}

      {projects.length > 0 &&
        projects.map((project, index) => {
          return (
            <ProjectItem
              project={project}
              index={index}
              removeProject={removeProject}
            />
          );
        })}
    </div>
  );
};

const styles: StylesObject = {
  button: { backgroundColor: "lightgreen" },
};

export default ProjectTable;
