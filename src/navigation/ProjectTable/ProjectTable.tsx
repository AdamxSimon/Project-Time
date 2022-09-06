// React

import { useRef } from "react";

// Components

import Button from "../../components/Button/Button";

// Types

import { Project, StylesObject } from "../../types";

// Utils

import { combineClassNames } from "../../utils";

// Styles

import classes from "./styles.module.css";

interface ProjectTableProps {
  data: Project[];
}

const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const { data } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classes.projectTable}>
      {data.length === 0 && (
        <div className={combineClassNames(classes.inputForm, classes.fadeIn)}>
          <div
            className={combineClassNames(classes.inputHeader, classes.fadeUp)}
          >
            What Would You Like To Work On?
          </div>
          <input
            ref={inputRef}
            className={classes.input}
            type="text"
            placeholder="Project Name"
          />
          <Button text="Add Project" style={styles.button} />
        </div>
      )}
    </div>
  );
};

const styles: StylesObject = {
  button: { backgroundColor: "lightgreen" },
};

export default ProjectTable;
