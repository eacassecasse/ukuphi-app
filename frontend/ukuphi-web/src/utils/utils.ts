import { eachDayOfInterval, getDay, parseISO } from "date-fns";

export function getWeekDaysInRange(
  from: string | null,
  to: string | null
): number[] {
  const fromDate = parseISO(from ?? new Date().toISOString());
  const toDate = parseISO(to ?? new Date().toISOString());

  const allDays = eachDayOfInterval({ start: fromDate, end: toDate });

  const weekDaysSet = new Set<number>();

  allDays.map((day) => {
    weekDaysSet.add(getDay(day));
  });

  return Array.from(weekDaysSet);
}

export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};
