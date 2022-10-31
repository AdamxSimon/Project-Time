// React

import { createContext, useRef, useState } from "react";

const DEFAULT_DISPLAY_TIME: number = 2000;

interface ToastContextValue {
  showToast: (message: string, displayTime?: number) => void;
  resetToast: () => void;
  message: string;
  displayTime: number;
}

export const ToastContext: React.Context<ToastContextValue> =
  createContext<ToastContextValue>({
    showToast: () => {},
    resetToast: () => {},
    message: "",
    displayTime: DEFAULT_DISPLAY_TIME,
  });

interface ToastProviderProps {
  children: JSX.Element;
}

const ToastProvider = ({ children }: ToastProviderProps): JSX.Element => {
  const [message, setMessage] = useState<string>("");

  const displayTimeRef = useRef<number>(DEFAULT_DISPLAY_TIME);
  const displayTime: number = displayTimeRef.current;

  const showToast = (message: string, displayTime?: number): void => {
    if (displayTime) displayTimeRef.current = displayTime;
    setMessage(message);
  };

  const resetToast = (): void => {
    displayTimeRef.current = DEFAULT_DISPLAY_TIME;
    setMessage("");
  };

  const value: ToastContextValue = {
    showToast,
    resetToast,
    message,
    displayTime,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export default ToastProvider;
