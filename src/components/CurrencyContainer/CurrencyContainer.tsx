// Assets

import coinIcon from "../../assets/coin.png";

// Styles

import classes from "./styles.module.css";

interface CurrencyContainerProps {
  amount: number;
}

const CurrencyContainer = (props: CurrencyContainerProps): JSX.Element => {
  const { amount } = props;

  return (
    <div className={classes.currencyContainer}>
      <img src={coinIcon} alt="Currency" height={16} width={16} />
      <div>{amount}</div>
    </div>
  );
};

export default CurrencyContainer;
