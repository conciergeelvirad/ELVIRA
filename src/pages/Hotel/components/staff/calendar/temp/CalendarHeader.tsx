import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../../components/common/ui/Button";
import { CalendarView } from "../../../../../hooks/features/useCalendar";
import { formatMonthYear, formatWeekRange } from "../../../../../utils";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
}

export const CalendarHeader = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) => {
  const title =
    view === "month"
      ? formatMonthYear(currentDate)
      : formatWeekRange(currentDate);

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          leftIcon={ChevronLeft}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          rightIcon={ChevronRight}
        >
          Next
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
      </div>

      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <div className="flex items-center space-x-2">
        <Button
          variant={view === "month" ? "primary" : "outline"}
          size="sm"
          onClick={() => onViewChange("month")}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "primary" : "outline"}
          size="sm"
          onClick={() => onViewChange("week")}
        >
          Week
        </Button>
      </div>
    </div>
  );
};
