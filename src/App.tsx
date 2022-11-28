// React

import { useContext } from "react";

// Context

import { ScreenSizeContext } from "./context/ScreenSizeContext";

// Components

import NavigationCarousel from "./navigation-carousel/NavigationCarousel";
import Toolbar from "./toolbar/Toolbar";

// Overlays

import ToastOverlay from "./overlays/toast-overlay/ToastOverlay";

// Assets

import ProjectsSheetPNG from "./assets/projects/projects-sheet.png";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  const { isScreenUnsupported } = useContext(ScreenSizeContext);

  return (
    <div className={classes.app}>
      <Toolbar />
      <NavigationCarousel />
      <ToastOverlay />

      {isScreenUnsupported && (
        <div className={classes.unsupported}>
          <img src={ProjectsSheetPNG} alt={"Project Time"} height={20} />
        </div>
      )}
    </div>
  );
};

export default App;
