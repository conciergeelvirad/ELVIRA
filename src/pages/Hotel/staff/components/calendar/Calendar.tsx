import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import {
  useCalendar,
  CalendarView,
} from "../../../../../hooks/features/useCalendar";

interface ScheduleBadge {
  name: string;
  time: string;
  status: string;
}

interface CalendarProps {
  initialDate?: Date;
  schedules?: Record<string, ScheduleBadge[]>; // Date string as key, schedules with status as value
  onDateSelect?: (date: Date) => void;
  onSendCalendar?: () => void;
  onCreateSchedule?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export const Calendar = ({
  initialDate,
  schedules,
  onDateSelect,
  onSendCalendar,
  onCreateSchedule,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CalendarProps) => {
  const calendar = useCalendar(initialDate);

  const handleDateClick = (date: Date) => {
    calendar.setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handleViewChange = (view: CalendarView) => {
    calendar.setView(view);
  };

  return (
    <div className="w-full">
      <CalendarHeader
        currentDate={calendar.currentDate}
        view={calendar.view}
        onPrevious={calendar.navigatePrevious}
        onNext={calendar.navigateNext}
        onToday={calendar.navigateToday}
        onViewChange={handleViewChange}
        onSendCalendar={onSendCalendar}
        onCreateSchedule={onCreateSchedule}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />

      <CalendarGrid
        currentDate={calendar.currentDate}
        selectedDate={calendar.selectedDate}
        view={calendar.view}
        onDateClick={handleDateClick}
        schedules={schedules}
      />
    </div>
  );
};
