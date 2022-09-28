// React

import { createContext, useRef, useState } from "react";

interface TimerContextValue {
  isActive: boolean;
  seconds: number;
  startTimer: () => void;
  stopTimer: () => void;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({} as TimerContextValue);

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  const startTimeRef = useRef<Date>({} as Date);
  const intervalRef = useRef({} as NodeJS.Timer);

  const startTimer = (): void => {
    setIsActive(true);
    startTimeRef.current = new Date();
    const interval = setInterval(() => {
      setSeconds(new Date().getSeconds() - startTimeRef.current.getSeconds());
    }, 1000);
    intervalRef.current = interval;
  };

  const stopTimer = (): void => {
    setIsActive(false);
    clearInterval(intervalRef.current);
    setSeconds(0);
  };

  const value = { isActive, seconds, startTimer, stopTimer };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
