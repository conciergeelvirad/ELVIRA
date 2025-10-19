import { useState } from "react";
import { Calendar } from "./Calendar";
import { CreateScheduleModal } from "./CreateScheduleModal";
import {
  useStaffSchedules,
  useDeleteStaffSchedule,
} from "../../../../../hooks/queries/hotel-management/staff/useStaffScheduleQueries";
import { useHotelStaffWithPersonalData } from "../../../../../hooks/queries/hotel-management/staff";
import { useHotelStaff } from "../../../../../hooks/hotel/useHotelStaff";
import { ConfirmationModal } from "../../../../../components/common/ui";
import { useConfirmDialog } from "../../../../../hooks/ui";
import { useToast } from "../../../../../hooks/ui/useToast";
import {
  useSchedulesByDate,
  useSchedulesForDate,
  useSendCalendarEmails,
} from "./hooks";
import { ScheduleDetailsPanel } from "./components";
import { EditScheduleModal } from "./EditScheduleModal";

export const StaffScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { hotelId, hotelStaff } = useHotelStaff();
  const { data: schedules = [], isLoading } = useStaffSchedules(
    hotelId || undefined
  );
  const { data: staffMembers = [] } = useHotelStaffWithPersonalData();
  const deleteSchedule = useDeleteStaffSchedule();
  const deleteDialog = useConfirmDialog();
  const { toast } = useToast();

  // Check if current user has permission to edit/delete schedules
  // Only Hotel Admin and Manager can edit/delete
  const canEditSchedules =
    hotelStaff?.position === "Hotel Admin" ||
    hotelStaff?.department === "Manager";

  // Check if user is admin or manager to determine what actions they can take
  const isAdminOrManager =
    hotelStaff?.position === "Hotel Admin" ||
    hotelStaff?.department === "Manager";

  console.log("====================================");
  console.log("👤 [StaffScheduleCalendar] CURRENT USER INFO");
  console.log("====================================");
  console.log("Position:", hotelStaff?.position);
  console.log("Department:", hotelStaff?.department);
  console.log("Staff ID:", hotelStaff?.id);
  console.log("Is Admin/Manager:", isAdminOrManager);
  console.log("Hotel ID:", hotelId);
  console.log("====================================");

  console.log("====================================");
  console.log("📊 [StaffScheduleCalendar] ALL SCHEDULES FROM DATABASE");
  console.log("====================================");
  console.log("Total schedules fetched:", schedules.length);
  schedules.forEach((schedule, index) => {
    console.log(`Schedule ${index + 1}:`, {
      id: schedule.id,
      staff_id: schedule.staff_id,
      schedule_start_date: schedule.schedule_start_date,
      schedule_finish_date: schedule.schedule_finish_date,
      shift_start: schedule.shift_start,
      shift_end: schedule.shift_end,
      status: schedule.status,
      matchesCurrentUser: schedule.staff_id === hotelStaff?.id,
    });
  });
  console.log("====================================");

  // Filter schedules by staff name search query and status
  // Hotel Staff can only see their own schedules
  const filteredSchedules = schedules.filter((schedule) => {
    // First filter: Hotel Staff can only see their own schedules
    if (!isAdminOrManager && hotelStaff?.id) {
      console.log(
        "🔍 [StaffScheduleCalendar] Checking schedule for Hotel Staff:",
        {
          scheduleId: schedule.id,
          scheduleStaffId: schedule.staff_id,
          currentStaffId: hotelStaff.id,
          match: schedule.staff_id === hotelStaff.id,
          scheduleDate: schedule.schedule_start_date,
        }
      );
      if (schedule.staff_id !== hotelStaff.id) {
        console.log(
          "❌ [StaffScheduleCalendar] Schedule filtered out (not assigned to current user)"
        );
        return false;
      }
      console.log(
        "✅ [StaffScheduleCalendar] Schedule included (assigned to current user)"
      );
    }

    // Filter by search query (only for admin/manager)
    if (searchQuery.trim() && isAdminOrManager) {
      const staffMember = staffMembers.find((s) => s.id === schedule.staff_id);
      if (!staffMember) return false;

      const matchesSearch = staffMember.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Filter by status
    if (statusFilter) {
      return schedule.status === statusFilter;
    }

    return true;
  });

  console.log("====================================");
  console.log("📊 [StaffScheduleCalendar] FILTERING RESULTS");
  console.log("====================================");
  console.log("Total schedules in database:", schedules.length);
  console.log("Schedules after filtering:", filteredSchedules.length);
  console.log("Is Admin/Manager:", isAdminOrManager);
  console.log("Current user ID:", hotelStaff?.id);
  console.log(
    "Filtered schedule IDs:",
    filteredSchedules.map((s) => s.id)
  );
  console.log("====================================");

  // Use custom hooks for schedule transformation
  const { schedulesByDate, staffNameMap } = useSchedulesByDate(
    filteredSchedules,
    staffMembers
  );
  const selectedDateSchedules = useSchedulesForDate(
    selectedDate,
    filteredSchedules
  );

  // Use custom hook for sending calendar emails
  const { handleSendCalendar, isSending, confirmDialog, successDialog } =
    useSendCalendarEmails(hotelId);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateSchedule = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    // Calendar will auto-refresh via React Query invalidation
    setIsCreateModalOpen(false);
  };

  const handleEditSchedule = (scheduleId: string) => {
    setEditingScheduleId(scheduleId);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingScheduleId(null);
    toast({
      message: "Schedule updated successfully",
      type: "success",
    });
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    const confirmed = await deleteDialog.confirm({
      title: "Delete Schedule",
      message:
        "Are you sure you want to delete this schedule? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      try {
        await deleteSchedule.mutateAsync(scheduleId);
        toast({
          message: "Schedule deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Failed to delete schedule:", error);
        toast({
          message: "Failed to delete schedule",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">Loading schedules...</p>
        </div>
      ) : (
        <Calendar
          initialDate={new Date()}
          schedules={schedulesByDate}
          onDateSelect={handleDateSelect}
          onSendCalendar={isAdminOrManager ? handleSendCalendar : undefined}
          onCreateSchedule={isAdminOrManager ? handleCreateSchedule : undefined}
          searchQuery={isAdminOrManager ? searchQuery : undefined}
          onSearchChange={isAdminOrManager ? setSearchQuery : undefined}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      <ScheduleDetailsPanel
        selectedDate={selectedDate}
        schedules={selectedDateSchedules}
        staffNameMap={staffNameMap}
        canEditSchedules={canEditSchedules}
        onEditSchedule={handleEditSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Schedule Modal */}
      {editingScheduleId && (
        <EditScheduleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingScheduleId(null);
          }}
          onSuccess={handleEditSuccess}
          scheduleId={editingScheduleId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationModal {...deleteDialog.dialog} />

      {/* Confirmation Modal for Sending Calendar */}
      <ConfirmationModal {...confirmDialog} isLoading={isSending} />

      {/* Success Confirmation Modal */}
      <ConfirmationModal {...successDialog} />
    </div>
  );
};
