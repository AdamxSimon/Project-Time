// React

import { createContext, useCallback, useMemo, useState } from "react";

const DEFAULT_DISPLAY_TIME: number = 2000;

interface ToastContextValue {
  showToast: (message: string, displayTime?: number) => void;
  resetToast: () => void;
  toastMessage: string;
  toastDisplayTime: number;
}

export const ToastContext: React.Context<ToastContextValue> =
  createContext<ToastContextValue>({
    showToast: () => {},
    resetToast: () => {},
    toastMessage: "",
    toastDisplayTime: DEFAULT_DISPLAY_TIME,
  });

interface ToastProviderProps {
  children: JSX.Element;
}

const ToastProvider = ({ children }: ToastProviderProps): JSX.Element => {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastDisplayTime, setToastDisplayTime] =
    useState<number>(DEFAULT_DISPLAY_TIME);

  const showToast = useCallback(
    (message: string, displayTime?: number): void => {
      setToastDisplayTime(displayTime || DEFAULT_DISPLAY_TIME);
      setToastMessage(message);
    },
    []
  );

  const resetToast = useCallback((): void => {
    setToastDisplayTime(DEFAULT_DISPLAY_TIME);
    setToastMessage("");
  }, []);

  const value: ToastContextValue = useMemo(() => {
    return {
      showToast,
      resetToast,
      toastMessage,
      toastDisplayTime,
    };
  }, [showToast, resetToast, toastMessage, toastDisplayTime]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export default ToastProvider;
