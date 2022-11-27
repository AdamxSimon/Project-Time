// React

import { createContext, useContext, useMemo } from "react";
import { StylesObject } from "../types";
import { ScreenSizeContext } from "./ScreenSizeContext";

interface ThemesContextValue {
  fonts: StylesObject;
}

export const ThemesContext: React.Context<ThemesContextValue> =
  createContext<ThemesContextValue>({
    fonts: {},
  });

interface ThemesProviderProps {
  children: JSX.Element;
}

const ThemesProvider = ({ children }: ThemesProviderProps): JSX.Element => {
  const { isSmallScreen } = useContext(ScreenSizeContext);

  const fonts: StylesObject = useMemo(() => {
    return {
      standard: {
        fontSize: isSmallScreen ? 12 : 16,
      },
    };
  }, [isSmallScreen]);

  const value: ThemesContextValue = useMemo(() => {
    return { fonts };
  }, [fonts]);

  return (
    <ThemesContext.Provider value={value}>{children}</ThemesContext.Provider>
  );
};

export default ThemesProvider;
