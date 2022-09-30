// React

import { createContext, useRef, useState } from "react";

interface TimerContextValue {
  isActive: boolean;
  timer: string;
  startTimer: (minutes: number) => void;
  stopTimer: () => void;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({} as TimerContextValue);

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("00:00");

  const startTimeRef = useRef<Date>({} as Date);
  const intervalRef = useRef({} as NodeJS.Timer);

  const startTimer = (minutes: number): void => {
    setIsActive(true);
    if (!isActive) setTimer(`${minutes}:00`);
    startTimeRef.current = new Date();

    const interval = setInterval(() => {
      const currentTime: number = new Date().getTime();
      const startTime: number = startTimeRef.current.getTime();
      const differenceInSeconds: number = Math.round(
        Math.abs(currentTime - startTime) / 1000
      );

      const timeLeftInSeconds: number = minutes * 60 - differenceInSeconds;
      const timerMinutes = Math.floor(timeLeftInSeconds / 60);
      const timerSeconds = timeLeftInSeconds - timerMinutes * 60;
      setTimer(`${timerMinutes}:${timerSeconds}`);
    }, 1000);

    intervalRef.current = interval;
  };

  const stopTimer = (): void => {
    setIsActive(false);
    clearInterval(intervalRef.current);
    setTimer("00:00");
    startTimeRef.current = {} as Date;
  };

  const value = { isActive, timer, startTimer, stopTimer };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
