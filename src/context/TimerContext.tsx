// React

import { createContext, useRef, useState } from "react";

enum TimerStage {
  Active = "Active",
  Break = "Break",
}

interface TimerContextValue {
  isActive: boolean;
  timer: string | null;
  currentStage: TimerStage | null;
  startTimerSession: (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number
  ) => void;
  stopTimerSession: () => void;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({} as TimerContextValue);

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timer, setTimer] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<TimerStage | null>(null);

  const stagesRef = useRef<{ (): void }[]>([]);
  const stagesStepRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date>({} as Date);
  const intervalRef = useRef({} as NodeJS.Timer);

  const startTimer = (minutes: number, stage: TimerStage): void => {
    setCurrentStage(stage);
    setTimer(`${minutes < 10 ? `0${minutes}` : minutes.toString()}:00`);
    startTimeRef.current = new Date();
    clearInterval(intervalRef.current);

    const interval: NodeJS.Timer = setInterval(() => {
      const currentTime: number = new Date().getTime();
      const startTime: number = startTimeRef.current.getTime();
      const differenceInSeconds: number = Math.round(
        Math.abs(currentTime - startTime) / 1000
      );

      const timeLeftInSeconds: number = minutes * 60 - differenceInSeconds;
      const timerMinutes: number = Math.floor(timeLeftInSeconds / 60);
      const timerSeconds: number = timeLeftInSeconds - timerMinutes * 60;

      const minutesStringConversion: string =
        timerMinutes < 10 ? `0${timerMinutes}` : timerMinutes.toString();
      const secondsStringConversion: string =
        timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds.toString();

      setTimer(`${minutesStringConversion}:${secondsStringConversion}`);

      if (timeLeftInSeconds < 0 && stagesStepRef.current !== null) {
        stagesStepRef.current += 1;
        if (stagesStepRef.current <= stagesRef.current.length - 1) {
          stagesRef.current[stagesStepRef.current]();
        } else {
          stopTimerSession();
        }
      }
    }, 1000);

    intervalRef.current = interval;
  };

  const stopTimerSession = (): void => {
    setIsActive(false);
    setCurrentStage(null);
    setTimer(null);
    clearInterval(intervalRef.current);
    startTimeRef.current = {} as Date;
    stagesStepRef.current = null;
  };

  const startTimerSession = (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number
  ): void => {
    setIsActive(true);
    const stages: { (): void }[] = [];
    for (let counter = 0; counter < cycles; counter++) {
      stages.push(() => startTimer(activeMinutes, TimerStage.Active));
      stages.push(() => startTimer(breakMinutes, TimerStage.Break));
    }
    stagesRef.current = stages;
    stagesStepRef.current = 0;
    stagesRef.current[stagesStepRef.current]();
  };

  const value = {
    isActive,
    timer,
    currentStage,
    startTimerSession,
    stopTimerSession,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
