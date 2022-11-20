// React

import { useContext } from "react";

// Context

import { ScreenSizeContext } from "./context/ScreenSizeContext";

// Components

import NavigationCarousel from "./navigation-carousel/NavigationCarousel";
import Toolbar from "./toolbar/Toolbar";

// Overlays

import ToastOverlay from "./overlays/toast-overlay/ToastOverlay";

// Styles

import classes from "./styles.module.css";

const App = (): JSX.Element => {
  const { isUnsupported } = useContext(ScreenSizeContext);

  return (
    <div className={classes.app}>
      <Toolbar />
      <NavigationCarousel />

      {/* Overlays */}

      <ToastOverlay />

      {isUnsupported && (
        <div className={classes.unsupported}>{"Screen Size Unsupported"}</div>
      )}
    </div>
  );
};

export default App;
