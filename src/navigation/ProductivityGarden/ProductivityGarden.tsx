import { useState, useRef } from "react";

// Styles

import classes from "./styles.module.css";

const GardenTile = (): JSX.Element => {
  return <div></div>;
};

const ProductivityGarden = (): JSX.Element => {
  const gardenGridRef = useRef<HTMLDivElement | null>(null);

  const [tileSize, setTileSize] = useState<number>();

  return <div ref={gardenGridRef} className={classes.gardenGrid}></div>;
};

export default ProductivityGarden;
