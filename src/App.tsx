// Components

import ProjectTable from "./navigation/ProjectTable/ProjectTable";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <ProjectTable />
    </div>
  );
};

export default App;
