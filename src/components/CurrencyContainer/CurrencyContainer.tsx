// React

import { useContext } from "react";

// Context

import { ScreenSizeContext } from "../../context/ScreenSizeContext";

// Assets

import coinIcon from "../../assets/coin.png";

// Styles

import classes from "./styles.module.css";

interface CurrencyContainerProps {
  amount: number;
}

const CurrencyContainer = (props: CurrencyContainerProps): JSX.Element => {
  const { amount } = props;

  const { isSmallScreen } = useContext(ScreenSizeContext);

  return (
    <div className={classes.currencyContainer}>
      <img src={coinIcon} alt="Currency" height={isSmallScreen ? 12 : 16} />
      <div style={{ fontSize: isSmallScreen ? 12 : 16 }}>{amount}</div>
    </div>
  );
};

export default CurrencyContainer;
