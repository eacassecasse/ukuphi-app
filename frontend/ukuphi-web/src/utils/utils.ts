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
