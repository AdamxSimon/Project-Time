// Components

import Carousel from "./carousel/Carousel";
import Toolbar from "./toolbar/Toolbar";
import ProjectTable from "./tools/ProjectTable/ProjectTable";
import ProjectTimer from "./tools/ProjectTimer/ProjectTimer";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <Toolbar />
      <Carousel components={[<ProjectTable />, <ProjectTimer />]} />
    </div>
  );
};

export default App;
