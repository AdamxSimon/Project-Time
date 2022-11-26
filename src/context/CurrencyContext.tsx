// React

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CurrencyContextValue {
  currency: number;
  addCurrency: (amount: number) => void;
  removeCurrency: (amount: number) => void;
}

const initialSaveData: string | null = localStorage.getItem("currency");

export const CurrencyContext: React.Context<CurrencyContextValue> =
  createContext<CurrencyContextValue>({
    currency: 0,
    addCurrency: () => {},
    removeCurrency: () => {},
  });

interface CurrencyProviderProps {
  children: JSX.Element;
}

const CurrencyProvider = ({ children }: CurrencyProviderProps): JSX.Element => {
  const [currency, setCurrency] = useState<number>(Number(initialSaveData));

  const addCurrency = useCallback(
    (amount: number): void => {
      setCurrency(currency + amount);
    },
    [currency]
  );

  const removeCurrency = useCallback(
    (amount: number): void => {
      const result: number = currency - amount;
      setCurrency(result > 0 ? result : 0);
    },
    [currency]
  );

  useEffect((): void => {
    localStorage.setItem("currency", currency.toString());
  }, [currency]);

  const value: CurrencyContextValue = useMemo(() => {
    return { currency, addCurrency, removeCurrency };
  }, [currency, addCurrency, removeCurrency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
