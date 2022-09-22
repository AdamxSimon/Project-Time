// Components

import Toolbar from "./components/Toolbar/Toolbar";
import ProjectTable from "./navigation/ProjectTable/ProjectTable";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <Toolbar />
      <div className={classes.carouselContainer}>
        <ProjectTable />
      </div>
    </div>
  );
};

export default App;
