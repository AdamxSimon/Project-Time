export const combineClassNames = (...classNames: string[]): string => {
  return classNames.join(" ");
};

export const isEven = (number: number): boolean => {
  return number % 2 === 0;
};

export const convertSecondsToDuration = (seconds: number) => {
  const durationMinutes: number = Math.floor(seconds / 60);
  const durationSeconds: number = seconds - durationMinutes * 60;

  const minutesStringConversion: string =
    durationMinutes < 10 ? `0${durationMinutes}` : durationMinutes.toString();
  const secondsStringConversion: string =
    durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds.toString();

  return `${minutesStringConversion}:${secondsStringConversion}`;
};
