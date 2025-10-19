import { useMemo } from "react";

interface Schedule {
  id: string;
  staff_id: string;
  schedule_start_date: string;
  schedule_finish_date: string;
  shift_start: string;
  shift_end: string;
  status: string;
  notes?: string | null;
  is_confirmed: boolean;
}

interface StaffMember {
  id: string;
  name: string;
}

/**
 * Hook to transform schedules for calendar display
 * Expands multi-day schedules across their entire date range
 */
export const useSchedulesByDate = (
  schedules: Schedule[],
  staffMembers: StaffMember[]
) => {
  // Create staff name lookup map
  const staffNameMap = useMemo(() => {
    return staffMembers.reduce((acc, staff) => {
      acc[staff.id] = staff.name;
      return acc;
    }, {} as Record<string, string>);
  }, [staffMembers]);

  // Transform schedules to group by date with full schedule info
  const schedulesByDate = useMemo(() => {
    const grouped: Record<
      string,
      Array<{ name: string; time: string; status: string }>
    > = {};

    schedules.forEach((schedule) => {
      const staffName = staffNameMap[schedule.staff_id] || "Unknown Staff";
      const shiftTime = `${schedule.shift_start.substring(
        0,
        5
      )} - ${schedule.shift_end.substring(0, 5)}`;

      // Parse date strings manually to avoid timezone issues
      const [startYear, startMonth, startDay] = schedule.schedule_start_date
        .split("-")
        .map(Number);
      const [finishYear, finishMonth, finishDay] = schedule.schedule_finish_date
        .split("-")
        .map(Number);

      const startDate = new Date(startYear, startMonth - 1, startDay);
      const finishDate = new Date(finishYear, finishMonth - 1, finishDay);

      // Add schedule to every date in the range
      const currentDate = new Date(startDate);
      while (currentDate <= finishDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push({
          name: staffName,
          time: shiftTime,
          status: schedule.status,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return grouped;
  }, [schedules, staffNameMap]);

  return { schedulesByDate, staffNameMap };
};

/**
 * Hook to get schedules for a specific date
 */
export const useSchedulesForDate = (
  selectedDate: Date | null,
  schedules: Schedule[]
) => {
  return useMemo(() => {
    if (!selectedDate) return [];

    // Use local time to match the schedule date strings
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    // Filter schedules where selected date falls within the range
    return schedules.filter((schedule) => {
      const startDate = schedule.schedule_start_date;
      const finishDate = schedule.schedule_finish_date;
      return dateKey >= startDate && dateKey <= finishDate;
    });
  }, [selectedDate, schedules]);
};
