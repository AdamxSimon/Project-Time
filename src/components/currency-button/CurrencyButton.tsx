// React

import { useContext, useState } from "react";

// Context

import { ScreenSizeContext } from "../../context/ScreenSizeContext";

// Assets

import CoinPNG from "../../assets/currency/coin.png";

// Types

import { StylesObject } from "../../types";

// Styles

import classes from "./styles.module.css";

interface CurrencyButtonProps {
  text: string;
  currencyAmount: number;
  onClick: () => void;
  isCostly?: boolean;
  disabled?: boolean;
  styleOverrides?: React.CSSProperties;
}

const CurrencyButton = (props: CurrencyButtonProps): JSX.Element => {
  const { text, currencyAmount, onClick, isCostly, disabled, styleOverrides } =
    props;

  const [isActive, setIsActive] = useState<boolean>(false);

  const { isSmallScreen } = useContext(ScreenSizeContext);

  const fontSize: number = isSmallScreen ? 12 : 16;

  return (
    <div
      className={classes.currencyButton}
      style={{
        ...(disabled
          ? styles.disabled
          : isActive
          ? styles.active
          : { backgroundColor: isCostly ? "lightcoral" : "lightgreen" }),
        ...{ fontSize },
        ...styleOverrides,
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseOut={() => setIsActive(false)}
      onClick={onClick}
    >
      <div>{text}</div>
      <div className={classes.currencyContainer}>
        <img src={CoinPNG} alt={"Currency"} height={fontSize} />
        <div>{currencyAmount}</div>
      </div>
    </div>
  );
};

const styles: StylesObject = {
  disabled: {
    backgroundColor: "lightgray",
    pointerEvents: "none",
  },
  active: {
    backgroundColor: "black",
    color: "white",
  },
};

export default CurrencyButton;
