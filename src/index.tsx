// React

import ReactDOM from "react-dom/client";

// Components

import App from "./App";

// Providers

import CurrencyProvider from "./context/CurrencyContext";
import ProjectProvider from "./context/ProjectContext";
import ScreenSizeProvider from "./context/ScreenSizeContext";
import ThemesProvider from "./context/ThemesContext";
import TimerProvider from "./context/TimerContext";
import ToastProvider from "./context/ToastContext";

// Styles

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ScreenSizeProvider>
    <ThemesProvider>
      <ToastProvider>
        <CurrencyProvider>
          <ProjectProvider>
            <TimerProvider>
              <App />
            </TimerProvider>
          </ProjectProvider>
        </CurrencyProvider>
      </ToastProvider>
    </ThemesProvider>
  </ScreenSizeProvider>
);
