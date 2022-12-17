// React

import {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Context

import { CurrencyContext } from "./CurrencyContext";
import { ProjectContext, ProjectStatus } from "./ProjectContext";
import { ToastContext } from "./ToastContext";

// Utils

import { convertSecondsToDuration } from "../utils";

// Assets

import BackToWorkMP3 from "../assets/audio/back-to-work.mp3";
import BreakTimeMP3 from "../assets/audio/break-time.mp3";
import TimerCompleteMP3 from "../assets/audio/timer-complete.mp3";

// Types

import { Project } from "../types";

const BackToWorkAudio = new Audio(BackToWorkMP3);
const BreakTimeAudio = new Audio(BreakTimeMP3);
const TimerCompleteAudio = new Audio(TimerCompleteMP3);

enum TimerStatus {
  Active = "Active",
  Break = "Break",
  Inactive = "Inactive",
}

export enum ReasonTimerStopped {
  Canceled,
  Completed,
}

interface TimerContextValue {
  isTimerActive: boolean;
  timerAsDuration: string;
  timerStatus: TimerStatus;
  totalTimerCycles: number;
  currentTimerCycle: number;
  startTimerSession: (
    activeMinutes: number,
    breakMinutes: number,
    cycles: number,
    project: Project
  ) => void;
  stopTimerSession: (reason: ReasonTimerStopped, reward?: number) => void;
  timedProject: Project | null;
  timerReward: number;
}

export const TimerContext: React.Context<TimerContextValue> =
  createContext<TimerContextValue>({
    isTimerActive: false,
    timerAsDuration: "00:00:00",
    timerStatus: TimerStatus.Inactive,
    totalTimerCycles: 0,
    currentTimerCycle: 0,
    startTimerSession: () => {},
    stopTimerSession: () => {},
    timedProject: null,
    timerReward: 0,
  });

interface TimerProviderProps {
  children: JSX.Element;
}

const TimerProvider = ({ children }: TimerProviderProps): JSX.Element => {
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [timerAsDuration, setTimerAsDuration] = useState<string>("00:00:00");
  const [timerStatus, setTimerStatus] = useState<TimerStatus>(
    TimerStatus.Inactive
  );
  const [totalTimerCycles, setTotalTimerCycles] = useState<number>(0);
  const [currentTimerCycle, setCurrentTimerCycle] = useState<number>(0);
  const [timedProject, setTimedProject] = useState<Project | null>(null);
  const [timerReward, setTimerReward] = useState<number>(0);

  const stagesRef = useRef<{ (): void }[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef({} as NodeJS.Timer);
  const projectTimeRef = useRef<number | null>(null);

  const { addCurrency } = useContext(CurrencyContext);
  const { projects, updateProjectSeconds } = useContext(ProjectContext);
  const { showToast } = useContext(ToastContext);

  const stopTimerSession = useCallback(
    (reason: ReasonTimerStopped, reward?: number): void => {
      setIsTimerActive(false);
      setTimerAsDuration("00:00:00");
      setTimerStatus(TimerStatus.Inactive);
      setTotalTimerCycles(0);
      setCurrentTimerCycle(0);
      setTimedProject(null);
      setTimerReward(0);

      clearInterval(intervalRef.current);

      startTimeRef.current = null;
      projectTimeRef.current = null;
      stagesRef.current = [];

      if (reason === ReasonTimerStopped.Completed) {
        showToast("Timer Completed!");
        TimerCompleteAudio.play();
        addCurrency(reward || 0);
      }
    },
    [addCurrency, showToast]
  );

  const startTimer = useCallback(
    (
      minutes: number,
      status: TimerStatus,
      cycle: number,
      step: number,
      reward: number,
      project: Project
    ): void => {
      setTimerStatus(status);
      setCurrentTimerCycle(cycle);
      setTimerAsDuration(convertSecondsToDuration(minutes * 60));
      startTimeRef.current = Date.now();
      if (projectTimeRef.current === null) {
        projectTimeRef.current = project.totalSecondsSpent;
      }
      clearInterval(intervalRef.current);
      showToast(
        status === TimerStatus.Active ? "Time To Work!" : "Break Time!"
      );

      if (status === TimerStatus.Active) {
        BackToWorkAudio.play();
      } else {
        BreakTimeAudio.play();
      }

      const interval: NodeJS.Timer = setInterval(() => {
        const currentTime: number = Date.now();
        const startTime: number = startTimeRef.current ?? Date.now();
        const differenceInSeconds: number = Math.round(
          Math.abs(currentTime - startTime) / 1000
        );

        const timeLeftInSeconds: number = minutes * 60 - differenceInSeconds;
        const timer: string = convertSecondsToDuration(timeLeftInSeconds);
        setTimerAsDuration(timer);

        if (
          status === TimerStatus.Active &&
          timeLeftInSeconds >= 0 &&
          projectTimeRef.current !== null
        ) {
          updateProjectSeconds(
            project,
            projectTimeRef.current + differenceInSeconds
          );
        }

        if (timeLeftInSeconds < 0) {
          if (
            projectTimeRef.current !== null &&
            status === TimerStatus.Active
          ) {
            projectTimeRef.current += minutes * 60;
          }
          if (step + 1 < stagesRef.current.length) {
            stagesRef.current[step + 1]();
          } else {
            stopTimerSession(ReasonTimerStopped.Completed, reward);
          }
        }
      }, 1000);

      intervalRef.current = interval;
    },
    [showToast, stopTimerSession, updateProjectSeconds]
  );

  const startTimerSession = useCallback(
    (
      activeMinutes: number,
      breakMinutes: number,
      cycles: number,
      project: Project
    ): void => {
      setIsTimerActive(true);
      setTotalTimerCycles(cycles);
      setTimedProject(project);
      const reward: number = activeMinutes * cycles;
      setTimerReward(reward);
      const stages: { (): void }[] = [];
      for (let cycle = 1, step = 0; cycle <= cycles; cycle++, step += 2) {
        stages.push(() =>
          startTimer(
            activeMinutes,
            TimerStatus.Active,
            cycle,
            step,
            reward,
            project
          )
        );
        const isLastCycle: boolean = cycle === cycles;
        if (!isLastCycle) {
          stages.push(() =>
            startTimer(
              breakMinutes,
              TimerStatus.Break,
              cycle,
              step + 1,
              reward,
              project
            )
          );
        }
      }
      stagesRef.current = stages;
      stagesRef.current[0]();
    },
    [startTimer]
  );

  useEffect((): void => {
    if (timedProject) {
      projects.forEach((project) => {
        if (
          project.id === timedProject.id &&
          project.status !== ProjectStatus.Active
        ) {
          stopTimerSession(ReasonTimerStopped.Canceled);
        }
      });
    }
  }, [projects, timedProject, stopTimerSession]);

  const value: TimerContextValue = useMemo(() => {
    return {
      isTimerActive,
      timerAsDuration,
      timerStatus,
      totalTimerCycles,
      currentTimerCycle,
      startTimerSession,
      stopTimerSession,
      timedProject,
      timerReward,
    };
  }, [
    isTimerActive,
    timerAsDuration,
    timerStatus,
    totalTimerCycles,
    currentTimerCycle,
    startTimerSession,
    stopTimerSession,
    timedProject,
    timerReward,
  ]);

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerProvider;
