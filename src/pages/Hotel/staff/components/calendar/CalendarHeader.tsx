import { ChevronLeft, ChevronRight, Send, Plus } from "lucide-react";
import { Button } from "../../../../../components/common/ui/Button";
import { SearchInput } from "../../../../../components/common/ui/SearchInput";
import { FilterDropdown } from "../../../../../components/common/ui/FilterDropdown";
import { CalendarView } from "../../../../../hooks/features/useCalendar";
import { formatMonthYear, formatWeekRange } from "../../../../../utils";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onSendCalendar?: () => void;
  onCreateSchedule?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const CalendarHeader = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onSendCalendar,
  onCreateSchedule,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CalendarHeaderProps) => {
  const getTitle = () => {
    return view === "month"
      ? formatMonthYear(currentDate)
      : formatWeekRange(currentDate);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left Side: Title, Today Button, and Search Box */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-semibold text-gray-900">{getTitle()}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-sm"
        >
          Today
        </Button>
        {onSearchChange && (
          <SearchInput
            value={searchQuery}
            onSearchChange={onSearchChange}
            placeholder="Search by staff member name..."
            className="w-64"
          />
        )}
        {onStatusFilterChange && (
          <FilterDropdown
            label="Status"
            value={statusFilter || ""}
            options={STATUS_OPTIONS}
            onChange={onStatusFilterChange}
            placeholder="All Statuses"
          />
        )}
      </div>

      {/* Right Side: View Toggle, Navigation, and Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange("month")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "month"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewChange("week")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "week"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Week
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        {onSendCalendar && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={Send}
            onClick={onSendCalendar}
          >
            Send Calendar
          </Button>
        )}
        {onCreateSchedule && (
          <Button
            variant="dark"
            size="sm"
            leftIcon={Plus}
            onClick={onCreateSchedule}
          >
            Create Schedule
          </Button>
        )}
      </div>
    </div>
  );
};
