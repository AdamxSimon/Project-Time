export interface Project {
  id: number;
  name: string;
  totalMinutesSpent: number;
}

export interface StylesObject {
  [style: string]: React.CSSProperties;
}
