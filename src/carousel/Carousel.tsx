// React

import { useState } from "react";

// Types

import { CarouselItem } from "../App";

// Styles

import classes from "./styles.module.css";

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel = (props: CarouselProps): JSX.Element => {
  const { items } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const cycleBackward = () => {
    if (selectedIndex === 0) {
      setSelectedIndex(items.length - 1);
    } else {
      setSelectedIndex((previousIndex) => (previousIndex -= 1));
    }
  };

  const cycleForward = () => {
    if (selectedIndex === items.length - 1) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex((previousIndex) => (previousIndex += 1));
    }
  };

  const backIcon: string =
    selectedIndex === 0
      ? items[items.length - 1].icon
      : items[selectedIndex - 1].icon;

  const forwardIcon: string =
    selectedIndex === items.length - 1
      ? items[0].icon
      : items[selectedIndex + 1].icon;

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel}>
        <div className={classes.directionButton} onClick={cycleBackward}>
          <img src={backIcon} alt="Back" height={16} />
        </div>
        <div className={classes.componentContainer}>
          {items[selectedIndex].component}
        </div>
        <div className={classes.directionButton} onClick={cycleForward}>
          <img src={forwardIcon} alt="Forward" height={16} />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
