// React

import ReactDOM from "react-dom/client";

// Components

import App from "./App";
import ProjectProvider from "./context/ProjectContext";

// Styles

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ProjectProvider>
    <App />
  </ProjectProvider>
);
