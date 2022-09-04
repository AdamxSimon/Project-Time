// React

import { useState } from "react";

// Components

import ProjectTable from "./navigation/ProjectTable/ProjectTable";

// Types

import { Project } from "./types";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  const [projectData, setProjectData] = useState<Project[]>([]);

  return (
    <div className={classes.app}>
      <ProjectTable data={projectData} />
    </div>
  );
};

export default App;
