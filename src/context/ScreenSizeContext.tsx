// React

import { createContext, useEffect, useMemo, useRef, useState } from "react";

interface ScreenSizeContextValue {
  isSmallScreen: boolean;
  isUnsupported: boolean;
}

export const ScreenSizeContext: React.Context<ScreenSizeContextValue> =
  createContext<ScreenSizeContextValue>({
    isSmallScreen: window.screen.width <= 420,
    isUnsupported: window.screen.width <= 320,
  });

interface ScreenSizeProviderProps {
  children: JSX.Element;
}

const ScreenSizeProvider = ({
  children,
}: ScreenSizeProviderProps): JSX.Element => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.screen.width <= 420
  );
  const [isUnsupported, setIsUnsupported] = useState<boolean>(
    window.screen.width <= 320
  );

  const value: ScreenSizeContextValue = useMemo(() => {
    return { isSmallScreen, isUnsupported };
  }, [isSmallScreen, isUnsupported]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmallScreen(window.screen.width <= 420);
      setIsUnsupported(window.screen.width <= 320);
    });
  }, []);

  return (
    <ScreenSizeContext.Provider value={value}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export default ScreenSizeProvider;
