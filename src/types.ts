export interface Project {
  name: string;
  weeklyHours: number;
  totalTimeSpent: string;
}

export interface StylesObject {
  [style: string]: React.CSSProperties;
}
