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
  component: React.ReactElement;
  icon: string;
}

const carouselItems: CarouselItem[] = [
  { component: <ProjectTable />, icon: ProjectsPNG },
  { component: <ProjectTimer />, icon: TimerPNG },
];

const App = (): JSX.Element => {
  return (
    <div className={classes.app}>
      <Toolbar />
      <Carousel items={carouselItems} />

      {/* Overlays */}

      <ModalOverlay />
      <ToastOverlay />
    </div>
  );
};

export default App;
