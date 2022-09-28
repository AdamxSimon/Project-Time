// React

import { createContext, useState } from "react";

interface TimerContextValue {
  isActive: boolean;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({} as TimerContextValue);

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const value = { isActive };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
