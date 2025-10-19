import { FormFieldConfig } from "../../../../../hooks";

interface StaffOption {
  value: string;
  label: string;
}

/**
 * Generates form fields for tasks with staff member options
 * @param staffOptions - Array of staff members to populate the staff selector
 */
export const getTaskFormFields = (
  staffOptions: StaffOption[] = []
): FormFieldConfig[] => [
  {
    key: "staffId",
    label: "Assign To",
    type: "select",
    placeholder: "Select staff member (optional)",
    required: false,
    options: staffOptions,
  },
  {
    key: "title",
    label: "Task Title",
    type: "text",
    placeholder: "Enter task title",
    required: true,
    validation: (value) => {
      if (!value) return "Task title is required";
      return null;
    },
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter task description",
    required: false,
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    placeholder: "Select priority",
    required: true,
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    required: true,
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
  {
    key: "dueDate",
    label: "Due Date",
    type: "date",
    placeholder: "Select due date",
    required: false,
  },
];

// Legacy export for backwards compatibility (with empty staff options)
export const TASK_FORM_FIELDS: FormFieldConfig[] = getTaskFormFields([]);
