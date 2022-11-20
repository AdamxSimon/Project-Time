// React

import { useState } from "react";

// Components

import ProjectTable from "../tools/ProjectTable/ProjectTable";
import ProjectTimer from "../tools/ProjectTimer/ProjectTimer";

// Assets

import ProjectsSheetPNG from "../assets/projects/projects-sheet.png";
import TimerPNG from "../assets/timer/timer.png";

// Styles

import classes from "./styles.module.css";

export interface CarouselItem {
  id: number;
  component: React.ReactElement;
  icon: string;
  altText: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    component: <ProjectTable />,
    icon: ProjectsSheetPNG,
    altText: "Projects Table",
  },
  {
    id: 2,
    component: <ProjectTimer />,
    icon: TimerPNG,
    altText: "Project Timer",
  },
];

const NavigationCarousel = (): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<CarouselItem>(
    carouselItems[0]
  );

  return (
    <div className={classes.navigationCarouselContainer}>
      <div className={classes.navigationCarousel}>
        <div className={classes.carouselComponentContainer}>
          {selectedItem.component}
        </div>
        <div className={classes.navigationButtonsContainer}>
          {carouselItems.map((item) => {
            return (
              <div
                key={item.id}
                className={classes.navigationButton}
                style={
                  item.id === selectedItem.id
                    ? { backgroundColor: "lightgreen" }
                    : undefined
                }
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.icon} alt={item.altText} height={16} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationCarousel;
