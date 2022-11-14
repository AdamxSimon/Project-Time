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

  const [selectedItem, setSelectedItem] = useState<CarouselItem>(items[0]);

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel}>
        <div className={classes.componentContainer}>
          {selectedItem.component}
        </div>
        <div className={classes.navigationContainer}>
          {items.map((item) => {
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
                <img src={item.icon} alt={item.icon} height={16} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
