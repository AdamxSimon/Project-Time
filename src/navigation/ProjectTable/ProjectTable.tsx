// React

import { useRef } from "react";

// Components

import Button, { ButtonAnimations } from "../../components/Button/Button";

// Types

import { Project, StylesObject } from "../../types";

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
        <div className={classes.inputForm}>
          <div className={classes.inputHeader}>
            What Would You Like To Work On?
          </div>
          <input
            ref={inputRef}
            className={classes.input}
            type="text"
            placeholder="Project Name"
          />
          <Button
            text="Add Project"
            style={styles.button}
            animation={ButtonAnimations.FadeIn}
          />
        </div>
      )}
    </div>
  );
};

const styles: StylesObject = {
  button: { backgroundColor: "lightgreen" },
};

export default ProjectTable;
