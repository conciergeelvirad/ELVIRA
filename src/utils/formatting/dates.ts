export const formatDate = (
  date: Date,
  format: "short" | "long" | "numeric" = "short"
): string => {
  switch (format) {
    case "short":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "numeric":
      return date.getDate().toString();
    default:
      return date.toLocaleDateString();
  }
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export const formatWeekRange = (date: Date): string => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = getEndOfWeek(date);

  const startMonth = startOfWeek.toLocaleDateString("en-US", {
    month: "short",
  });
  const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
  } else {
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
  }
};

export const getStartOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getEndOfWeek = (date: Date): Date => {
  const result = getStartOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const getStartOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getEndOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const getCalendarDays = (date: Date): Date[] => {
  const startOfMonth = getStartOfMonth(date);
  const startOfCalendar = getStartOfWeek(startOfMonth);

  const days: Date[] = [];
  const current = new Date(startOfCalendar);

  // Generate 6 weeks (42 days) to ensure consistent calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const getWeekDays = (date: Date): Date[] => {
  const startOfWeek = getStartOfWeek(date);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }

  return days;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
