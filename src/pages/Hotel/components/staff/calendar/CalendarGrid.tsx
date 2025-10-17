import { CalendarDay } from "./CalendarDay";
import { CalendarView } from "../../../../../hooks/features/useCalendar";
import { getCalendarDays, getWeekDays, WEEKDAYS } from "../../../../../utils";

interface ScheduleBadge {
  name: string;
  time: string;
  status: string;
}

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  view: CalendarView;
  onDateClick: (date: Date) => void;
  schedules?: Record<string, ScheduleBadge[]>; // Date string as key, schedules with status as value
}

export const CalendarGrid = ({
  currentDate,
  selectedDate,
  view,
  onDateClick,
  schedules = {},
}: CalendarGridProps) => {
  const days =
    view === "month" ? getCalendarDays(currentDate) : getWeekDays(currentDate);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with weekday names */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`grid grid-cols-7 ${
          view === "month" ? "grid-rows-6" : "grid-rows-1"
        }`}
      >
        {days.map((date) => {
          // Use local time to match the schedule keys (avoid timezone shift)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`;
          const daySchedules = schedules[dateKey] || [];

          return (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onClick={onDateClick}
              schedules={daySchedules}
            />
          );
        })}
      </div>
    </div>
  );
};
