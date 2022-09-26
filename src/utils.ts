export const combineClassNames = (...classNames: string[]): string => {
  return classNames.join(" ");
};

export const isEven = (number: number): boolean => {
  return number % 2 === 0;
};
