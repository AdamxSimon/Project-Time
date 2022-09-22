// Components

import Carousel from "./components/Carousel/Carousel";
import Toolbar from "./components/Toolbar/Toolbar";
import ProjectTable from "./navigation/ProjectTable/ProjectTable";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <Toolbar />
      <Carousel components={[ProjectTable()]} />
    </div>
  );
};

export default App;
