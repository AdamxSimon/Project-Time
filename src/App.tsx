// Components

import Carousel from "./components/Carousel/Carousel";
import Toolbar from "./components/Toolbar/Toolbar";
import ProjectTable from "./navigation/ProjectTable/ProjectTable";
import ProjectTimer from "./navigation/ProjectTimer/ProjectTimer";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <Toolbar />
      <Carousel components={[ProjectTable(), ProjectTimer()]} />
    </div>
  );
};

export default App;
