// Styles

import classes from "./styles.module.css";

interface CarouselProps {
  components: JSX.Element[];
}

const Carousel = (props: CarouselProps): JSX.Element => {
  const { components } = props;

  return (
    <div className={classes.carousel}>
      {components.map((component) => component)}
    </div>
  );
};

export default Carousel;
