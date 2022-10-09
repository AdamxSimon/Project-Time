// React

import { useState } from "react";

// Styles

import classes from "./styles.module.css";

interface CarouselProps {
  components: React.ReactElement[];
}

const Carousel = (props: CarouselProps): JSX.Element => {
  const { components } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const cycleBackward = () => {
    if (selectedIndex === 0) {
      setSelectedIndex(components.length - 1);
    } else {
      setSelectedIndex((previousIndex) => (previousIndex -= 1));
    }
  };

  const cycleForward = () => {
    if (selectedIndex === components.length - 1) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex((previousIndex) => (previousIndex += 1));
    }
  };

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel}>
        <div className={classes.directionButton} onClick={cycleBackward}>
          ⮜
        </div>
        <div className={classes.componentContainer}>
          {components[selectedIndex]}
        </div>
        <div className={classes.directionButton} onClick={cycleForward}>
          ⮞
        </div>
      </div>
    </div>
  );
};

export default Carousel;
