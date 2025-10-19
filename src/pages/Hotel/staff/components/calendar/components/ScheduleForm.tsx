import { FormField } from "../../../../../../components/common/form";

interface ScheduleFormData {
  staff_id: string;
  schedule_start_date: string;
  schedule_finish_date: string;
  shift_start: string;
  shift_end: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string;
}

interface ScheduleFormProps {
  formData: ScheduleFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  staffOptions: Array<{ value: string; label: string }>;
}

const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ScheduleForm = ({
  formData,
  onChange,
  staffOptions,
}: ScheduleFormProps) => {
  // Wrapper to convert FormField's onChange (value, name) to native event format
  const handleFormFieldChange = (
    value: string | number | boolean,
    name: string
  ) => {
    onChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>);
  };

  return (
    <div className="space-y-4">
      {/* Staff Member Selection */}
      <FormField
        name="staff_id"
        label="Staff Member"
        type="select"
        value={formData.staff_id}
        onChange={handleFormFieldChange}
        options={[{ value: "", label: "Select staff member" }, ...staffOptions]}
        required
      />

      {/* Date Range - Using native inputs since FormField doesn't support date type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="schedule_start_date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="schedule_start_date"
            name="schedule_start_date"
            value={formData.schedule_start_date}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="schedule_finish_date"
            className="block text-sm font-medium text-gray-700"
          >
            Finish Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="schedule_finish_date"
            name="schedule_finish_date"
            value={formData.schedule_finish_date}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Time Range - Using native inputs since FormField doesn't support time type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="shift_start"
            className="block text-sm font-medium text-gray-700"
          >
            Shift Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="shift_start"
            name="shift_start"
            value={formData.shift_start}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="shift_end"
            className="block text-sm font-medium text-gray-700"
          >
            Shift End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="shift_end"
            name="shift_end"
            value={formData.shift_end}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Status */}
      <FormField
        name="status"
        label="Status"
        type="select"
        value={formData.status}
        onChange={handleFormFieldChange}
        options={STATUS_OPTIONS}
      />

      {/* Notes */}
      <FormField
        name="notes"
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={handleFormFieldChange}
        placeholder="Add any notes or special instructions..."
        rows={3}
        maxLength={1000}
        description={`${formData.notes.length}/1000 characters`}
      />
    </div>
  );
};
