// React

import ReactDOM from "react-dom/client";

// Components

import App from "./App";
import CurrencyProvider from "./context/CurrencyContext";
import ProjectProvider from "./context/ProjectContext";
import TimerProvider from "./context/TimerContext";

// Styles

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <CurrencyProvider>
    <ProjectProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </ProjectProvider>
  </CurrencyProvider>
);
