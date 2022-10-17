export const combineClassNames = (...classNames: string[]): string => {
  return classNames.join(" ");
};

export const isEven = (number: number): boolean => {
  return number % 2 === 0;
};

export const convertSecondsToDuration = (seconds: number): string => {
  const durationHours: number = Math.floor(seconds / 3600);
  const durationMinutes: number = Math.floor(seconds / 60) - durationHours * 60;
  const durationSeconds: number =
    seconds - durationHours * 3600 - durationMinutes * 60;

  const hoursStringConversion: string =
    durationHours < 10 ? `0${durationHours}` : durationHours.toString();
  const minutesStringConversion: string =
    durationMinutes < 10 ? `0${durationMinutes}` : durationMinutes.toString();
  const secondsStringConversion: string =
    durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds.toString();

  return `${hoursStringConversion}:${minutesStringConversion}:${secondsStringConversion}`;
};

export const convertDurationToSeconds = (
  hours: number,
  minutes: number,
  seconds: number
): number => {
  return hours * 3600 + minutes * 60 + seconds;
};
