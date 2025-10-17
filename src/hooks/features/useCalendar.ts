import { useState } from "react";

export type CalendarView = "month" | "week";

export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
}

export interface CalendarActions {
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date | null) => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
}

export const useCalendar = (
  initialDate?: Date
): CalendarState & CalendarActions => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigatePrevious = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  };

  const navigateNext = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    view,
    selectedDate,
    setCurrentDate,
    setView,
    setSelectedDate,
    navigatePrevious,
    navigateNext,
    navigateToday,
  };
};
