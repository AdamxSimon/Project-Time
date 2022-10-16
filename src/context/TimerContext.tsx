// React

import {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

// Context

import { ProjectContext, ProjectStatus } from "./ProjectContext";

// Utils

import { convertSecondsToDuration } from "../utils";

// Types

import { Project } from "../types";
import { CurrencyContext } from "./CurrencyContext";

enum TimerStage {
  Active = "Active",
  Break = "Break",
}

export enum ReasonTimerStopped {
  Canceled,
  Completed,
}

interface TimerContextValue {
  isActive: boolean;
  timer: string | null;
  currentStage: TimerStage | null;
  startTimerSession: (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number,
    project: Project
  ) => void;
  stopTimerSession: (reason: ReasonTimerStopped) => void;
  timedProject: Project | null;
  timerMinutes: number | null;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({} as TimerContextValue);

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps): JSX.Element => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timer, setTimer] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<TimerStage | null>(null);
  const [timedProject, setTimedProject] = useState<Project | null>(null);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  const stagesRef = useRef<{ (): void }[]>([]);
  const stagesStepRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef({} as NodeJS.Timer);
  const projectTimeRef = useRef<number | null>(null);
  const rewardAmountRef = useRef<number>(0);

  const { projects, updateProjectSeconds } = useContext(ProjectContext);
  const { addCurrency } = useContext(CurrencyContext);

  const startTimer = (
    minutes: number,
    stage: TimerStage,
    project: Project
  ): void => {
    setCurrentStage(stage);
    setTimer(convertSecondsToDuration(minutes * 60));
    startTimeRef.current = Date.now();
    if (!projectTimeRef.current) {
      projectTimeRef.current = project.totalSecondsSpent;
    }
    clearInterval(intervalRef.current);

    const interval: NodeJS.Timer = setInterval(() => {
      const currentTime: number = Date.now();
      const startTime: number = startTimeRef.current as number;
      const differenceInSeconds: number = Math.round(
        Math.abs(currentTime - startTime) / 1000
      );

      const timeLeftInSeconds: number = minutes * 60 - differenceInSeconds;
      const timer = convertSecondsToDuration(timeLeftInSeconds);
      setTimer(timer);

      if (stage === TimerStage.Active && timeLeftInSeconds >= 0) {
        updateProjectSeconds(
          project,
          (projectTimeRef.current as number) + differenceInSeconds
        );
      }

      if (timeLeftInSeconds < 0 && stagesStepRef.current !== null) {
        if (projectTimeRef.current && stage === TimerStage.Active) {
          projectTimeRef.current += minutes * 60;
        }
        stagesStepRef.current += 1;
        if (stagesStepRef.current <= stagesRef.current.length - 1) {
          stagesRef.current[stagesStepRef.current]();
        } else {
          stopTimerSession(ReasonTimerStopped.Completed);
        }
      }
    }, 1000);

    intervalRef.current = interval;
  };

  const stopTimerSession = useCallback(
    (reason: ReasonTimerStopped): void => {
      setIsActive(false);
      setTimedProject(null);
      setCurrentStage(null);
      setTimer(null);
      clearInterval(intervalRef.current);
      startTimeRef.current = null;
      stagesRef.current = [];
      stagesStepRef.current = null;
      projectTimeRef.current = null;

      if (reason === ReasonTimerStopped.Completed) {
        addCurrency(rewardAmountRef.current);
      }

      rewardAmountRef.current = 0;
      setTimerMinutes(null);
    },
    [addCurrency]
  );

  const startTimerSession = (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number,
    project: Project
  ): void => {
    setIsActive(true);
    setTimedProject(project);
    setTimerMinutes((activeMinutes + breakMinutes) * cycles - breakMinutes);
    rewardAmountRef.current =
      (activeMinutes + breakMinutes) * cycles - breakMinutes;
    const stages: { (): void }[] = [];
    for (let counter = 0; counter < cycles; counter++) {
      stages.push(() => startTimer(activeMinutes, TimerStage.Active, project));
      if (!(counter === cycles - 1)) {
        stages.push(() => startTimer(breakMinutes, TimerStage.Break, project));
      }
    }
    stagesRef.current = stages;
    stagesStepRef.current = 0;
    stagesRef.current[stagesStepRef.current]();
  };

  useEffect(() => {
    projects.forEach((project) => {
      if (
        project.id === timedProject?.id &&
        project.status !== ProjectStatus.Active
      ) {
        stopTimerSession(ReasonTimerStopped.Canceled);
      }
    });
  }, [projects, stopTimerSession, timedProject?.id]);

  const value: TimerContextValue = {
    isActive,
    timer,
    currentStage,
    startTimerSession,
    stopTimerSession,
    timedProject,
    timerMinutes,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
