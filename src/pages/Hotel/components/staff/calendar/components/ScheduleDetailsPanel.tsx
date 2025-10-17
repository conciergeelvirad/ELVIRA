import { ScheduleDetailCard } from "./ScheduleDetailCard";

interface Schedule {
  id: string;
  staff_id: string;
  shift_start: string;
  shift_end: string;
  status: string;
  notes?: string | null;
  is_confirmed: boolean;
}

interface ScheduleDetailsPanelProps {
  selectedDate: Date | null;
  schedules: Schedule[];
  staffNameMap: Record<string, string>;
  canEditSchedules?: boolean;
  onEditSchedule?: (scheduleId: string) => void;
  onDeleteSchedule?: (scheduleId: string) => void;
}

export const ScheduleDetailsPanel = ({
  selectedDate,
  schedules,
  staffNameMap,
  canEditSchedules = false,
  onEditSchedule,
  onDeleteSchedule,
}: ScheduleDetailsPanelProps) => {
  if (!selectedDate) {
    return null;
  }

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Schedules for {formattedDate}
      </h3>

      {schedules.length > 0 ? (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const staffName =
              staffNameMap[schedule.staff_id] || "Unknown Staff";
            const shiftTime = `${schedule.shift_start.substring(
              0,
              5
            )} - ${schedule.shift_end.substring(0, 5)}`;

            return (
              <ScheduleDetailCard
                key={schedule.id}
                staffName={staffName}
                shiftTime={shiftTime}
                status={schedule.status}
                notes={schedule.notes || undefined}
                isConfirmed={schedule.is_confirmed}
                canEdit={canEditSchedules}
                onEdit={
                  onEditSchedule ? () => onEditSchedule(schedule.id) : undefined
                }
                onDelete={
                  onDeleteSchedule
                    ? () => onDeleteSchedule(schedule.id)
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No staff scheduled for this date</p>
        </div>
      )}
    </div>
  );
};
