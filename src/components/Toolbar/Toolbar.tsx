// React

import { useContext } from "react";

// Context

import { CurrencyContext } from "../../context/CurrencyContext";

// Assets

import coin from "../../assets/coin.png";

// Styles

import classes from "./styles.module.css";

const Toolbar = (): JSX.Element => {
  const { currency } = useContext(CurrencyContext);

  return (
    <div className={classes.toolbar}>
      <div className={classes.currencyContainer}>
        <img src={coin} alt="Currency" height={12} width={12} />
        <div>{currency}</div>
      </div>
    </div>
  );
};

export default Toolbar;
