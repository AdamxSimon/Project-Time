// React

import { useState } from "react";

// Styles

import classes from "./styles.module.css";

interface CarouselProps {
  components: JSX.Element[];
}

const Carousel = (props: CarouselProps): JSX.Element => {
  const { components } = props;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <div className={classes.carousel}>
      <div className={classes.directionButton}>{"<"}</div>
      <div className={classes.componentContainer}>
        {components[selectedIndex]}
      </div>
      <div className={classes.directionButton}>{">"}</div>
    </div>
  );
};

export default Carousel;
