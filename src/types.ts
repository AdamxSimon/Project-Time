// Enums

import { ProjectStatus } from "./context/ProjectContext";

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  totalSecondsSpent: number;
}

export interface StylesObject {
  [style: string]: React.CSSProperties;
}
