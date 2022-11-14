// React

import { useContext } from "react";

// Context

import { ScreenSizeContext } from "./context/ScreenSizeContext";

// Components

import Carousel from "./carousel/Carousel";
import Toolbar from "./toolbar/Toolbar";
import ProjectTable from "./tools/ProjectTable/ProjectTable";
import ProjectTimer from "./tools/ProjectTimer/ProjectTimer";
import ModalOverlay from "./overlays/modal-overlay/ModalOverlay";
import ToastOverlay from "./overlays/toast-overlay/ToastOverlay";

// Assets

import ProjectsPNG from "./assets/projects.png";
import TimerPNG from "./assets/timer.png";

// Styles

import classes from "./styles.module.css";

export interface CarouselItem {
  id: number;
  component: React.ReactElement;
  icon: string;
}

const carouselItems: CarouselItem[] = [
  { id: 1, component: <ProjectTable />, icon: ProjectsPNG },
  { id: 2, component: <ProjectTimer />, icon: TimerPNG },
];

const App = (): JSX.Element => {
  const { isUnsupported } = useContext(ScreenSizeContext);

  return (
    <div className={classes.app}>
      <Toolbar />
      <Carousel items={carouselItems} />

      {/* Overlays */}

      <ModalOverlay />
      <ToastOverlay />

      {isUnsupported && (
        <div className={classes.unsupported}>{"Screen Size Unsupported"}</div>
      )}
    </div>
  );
};

export default App;
