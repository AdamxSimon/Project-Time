// React

import { createContext, useRef, useState, useContext, useEffect } from "react";

// Context

import { ProjectContext, ProjectStatus } from "./ProjectContext";

// Types

import { Project } from "../types";

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
    cycles: number,
    project: Project | null
  ) => void;
  stopTimerSession: () => void;
  timedProject: Project | null;
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

  const stagesRef = useRef<{ (): void }[]>([]);
  const stagesStepRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef({} as NodeJS.Timer);
  const lastTickRef = useRef<number | null>(null);

  const { addProjectSeconds, projects } = useContext(ProjectContext);

  const startTimer = (
    minutes: number,
    stage: TimerStage,
    project: Project | null
  ): void => {
    setCurrentStage(stage);
    setTimer(`${minutes < 10 ? `0${minutes}` : minutes.toString()}:00`);
    startTimeRef.current = Date.now();
    lastTickRef.current = startTimeRef.current;
    clearInterval(intervalRef.current);

    const interval: NodeJS.Timer = setInterval(() => {
      const currentTime: number = Date.now();
      const secondsSinceLastTick: number = lastTickRef.current
        ? Math.round(Math.abs(currentTime - lastTickRef.current) / 1000)
        : 0;
      const startTime: number = startTimeRef.current as number;
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

      if (secondsSinceLastTick && stage === TimerStage.Active) {
        addProjectSeconds(project, secondsSinceLastTick);
      }

      lastTickRef.current = currentTime;
    }, 1000);

    intervalRef.current = interval;
  };

  const stopTimerSession = (): void => {
    setIsActive(false);
    setTimedProject(null);
    setCurrentStage(null);
    setTimer(null);
    clearInterval(intervalRef.current);
    startTimeRef.current = null;
    stagesStepRef.current = null;
    lastTickRef.current = null;
  };

  const startTimerSession = (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number,
    project: Project | null
  ): void => {
    setIsActive(true);
    setTimedProject(project);
    const stages: { (): void }[] = [];
    for (let counter = 0; counter < cycles; counter++) {
      stages.push(() => startTimer(activeMinutes, TimerStage.Active, project));
      stages.push(() => startTimer(breakMinutes, TimerStage.Break, project));
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
        stopTimerSession();
      }
    });
  }, [projects, timedProject?.id]);

  const value: TimerContextValue = {
    isActive,
    timer,
    currentStage,
    startTimerSession,
    stopTimerSession,
    timedProject,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
