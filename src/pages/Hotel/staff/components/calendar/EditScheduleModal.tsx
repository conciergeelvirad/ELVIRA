import { useState, useMemo, useEffect } from "react";
import { FormModal } from "../../../../../components/common/ui/FormModal";
import { useHotelStaffWithPersonalData } from "../../../../../hooks/queries/hotel-management/staff";
import {
  useStaffSchedule,
  useUpdateStaffSchedule,
} from "../../../../../hooks/queries/hotel-management/staff/useStaffScheduleQueries";
import { ScheduleForm } from "./components";

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  scheduleId: string;
}

export const EditScheduleModal = ({
  isOpen,
  onClose,
  onSuccess,
  scheduleId,
}: EditScheduleModalProps) => {
  const { data: staffMembers = [] } = useHotelStaffWithPersonalData();
  const { data: schedule, isLoading: isLoadingSchedule } =
    useStaffSchedule(scheduleId);
  const updateSchedule = useUpdateStaffSchedule();

  // Form state
  const [formData, setFormData] = useState<{
    staff_id: string;
    schedule_start_date: string;
    schedule_finish_date: string;
    shift_start: string;
    shift_end: string;
    status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    notes: string;
  }>({
    staff_id: "",
    schedule_start_date: "",
    schedule_finish_date: "",
    shift_start: "",
    shift_end: "",
    status: "SCHEDULED",
    notes: "",
  });

  // Populate form when schedule data is loaded
  useEffect(() => {
    if (schedule) {
      setFormData({
        staff_id: schedule.staff_id,
        schedule_start_date: schedule.schedule_start_date,
        schedule_finish_date: schedule.schedule_finish_date,
        shift_start: schedule.shift_start,
        shift_end: schedule.shift_end,
        status: schedule.status as
          | "SCHEDULED"
          | "CONFIRMED"
          | "COMPLETED"
          | "CANCELLED",
        notes: schedule.notes || "",
      });
    }
  }, [schedule]);

  // Staff options for dropdown
  const staffOptions = useMemo(() => {
    return staffMembers.map((staff) => ({
      value: staff.id,
      label: `${staff.name} (${staff.employeeId})`,
    }));
  }, [staffMembers]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSchedule.mutateAsync({
        id: scheduleId,
        data: formData,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  if (isLoadingSchedule) {
    return (
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(e) => e.preventDefault()}
        title="Edit Schedule"
        submitText="Update Schedule"
        isLoading={true}
        size="lg"
      >
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      </FormModal>
    );
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Edit Schedule"
      submitText="Update Schedule"
      isLoading={updateSchedule.isPending}
      size="lg"
    >
      <ScheduleForm
        formData={formData}
        onChange={handleInputChange}
        staffOptions={staffOptions}
      />
    </FormModal>
  );
};
