import { useState, useMemo } from "react";
import { FormModal } from "../../../../../components/common/ui/FormModal";
import { useHotelStaffWithPersonalData } from "../../../../../hooks/queries/hotel-management/staff";
import { useCreateStaffSchedule } from "../../../../../hooks/queries/hotel-management/staff/useStaffScheduleQueries";
import { useHotelStaff } from "../../../../../hooks/hotel/useHotelStaff";
import { ScheduleForm } from "./components";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateScheduleModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateScheduleModalProps) => {
  const { hotelId, hotelStaff: currentStaff } = useHotelStaff();
  const { data: staffMembers = [] } = useHotelStaffWithPersonalData();
  const createSchedule = useCreateStaffSchedule();

  // Form state
  const [formData, setFormData] = useState({
    staff_id: "",
    schedule_start_date: "",
    schedule_finish_date: "",
    shift_start: "",
    shift_end: "",
    status: "SCHEDULED" as const,
    notes: "",
  });

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

    if (!hotelId) {
      console.error("Hotel ID is required");
      return;
    }

    try {
      await createSchedule.mutateAsync({
        ...formData,
        hotel_id: hotelId,
        created_by: currentStaff?.id || null,
      });

      // Reset form
      setFormData({
        staff_id: "",
        schedule_start_date: "",
        schedule_finish_date: "",
        shift_start: "",
        shift_end: "",
        status: "SCHEDULED",
        notes: "",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Schedule"
      submitText="Create Schedule"
      isLoading={createSchedule.isPending}
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
