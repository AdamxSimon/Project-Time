// React

import ReactDOM from "react-dom/client";

// Components

import App from "./App";
import CurrencyProvider from "./context/CurrencyContext";
import ModalProvider from "./context/ModalContext";
import ProjectProvider from "./context/ProjectContext";
import TimerProvider from "./context/TimerContext";
import ToastProvider from "./context/ToastContext";

// Styles

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ModalProvider>
    <ToastProvider>
      <CurrencyProvider>
        <ProjectProvider>
          <TimerProvider>
            <App />
          </TimerProvider>
        </ProjectProvider>
      </CurrencyProvider>
    </ToastProvider>
  </ModalProvider>
);
