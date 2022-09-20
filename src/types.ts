export interface Project {
  id: number;
  name: string;
  weeklyHours: number;
  totalTimeSpent: string;
}

export interface StylesObject {
  [style: string]: React.CSSProperties;
}
