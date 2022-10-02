// React

import { createContext, useEffect, useState } from "react";

interface CurrencyContextValue {
  currency: number;
  addCurrency: (amount: number) => void;
  removeCurrency: (amount: number) => void;
}

const initialSaveData: string | null = localStorage.getItem("currency");

export const CurrencyContext: React.Context<CurrencyContextValue> =
  createContext<CurrencyContextValue>({} as CurrencyContextValue);

interface CurrencyProviderProps {
  children: JSX.Element;
}

const CurrencyProvider = ({ children }: CurrencyProviderProps): JSX.Element => {
  const [currency, setCurrency] = useState<number>(
    initialSaveData ? +initialSaveData : 0
  );

  const addCurrency = (amount: number) => {
    setCurrency(currency + amount);
  };

  const removeCurrency = (amount: number) => {
    const result: number = currency - amount;
    setCurrency(result > 0 ? result : 0);
  };

  useEffect(() => {
    localStorage.setItem("currency", currency.toString());
  }, [currency]);

  const value: CurrencyContextValue = { currency, addCurrency, removeCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
