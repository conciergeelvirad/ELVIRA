import { FormFieldConfig } from "../../../../../hooks";

interface StaffOption {
  value: string;
  label: string;
}

/**
 * Generates form fields for absence requests with staff member options
 * @param staffOptions - Array of staff members to populate the staff selector
 * @param isAdminOrManager - Whether the current user is an admin/manager
 * @param currentStaffId - Current staff member's ID (for non-admin/manager)
 */
export const getAbsenceRequestFormFields = (
  staffOptions: StaffOption[] = [],
  isAdminOrManager: boolean = true,
  currentStaffId?: string
): FormFieldConfig[] => [
  {
    key: "staffId",
    label: "Staff Member",
    type: "select",
    placeholder: isAdminOrManager ? "Select staff member" : "Current User",
    required: true,
    disabled: !isAdminOrManager,
    defaultValue:
      !isAdminOrManager && currentStaffId ? currentStaffId : undefined,
    options: isAdminOrManager
      ? staffOptions
      : currentStaffId
      ? [{ value: currentStaffId, label: "Current User" }]
      : [],
    validation: (value) => {
      if (!value) return "Staff member is required";
      return null;
    },
  },
  {
    key: "requestType",
    label: "Request Type",
    type: "select",
    placeholder: "Select request type",
    required: true,
    options: [
      { value: "vacation", label: "Vacation" },
      { value: "sick", label: "Sick Leave" },
      { value: "personal", label: "Personal" },
      { value: "training", label: "Training" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
    placeholder: "Select start date",
    required: true,
    validation: (value) => {
      if (!value) return "Start date is required";
      return null;
    },
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Select end date",
    required: true,
    validation: (value) => {
      if (!value) return "End date is required";
      return null;
    },
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    required: true,
    disabled: !isAdminOrManager,
    options: isAdminOrManager
      ? [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
          { value: "cancelled", label: "Cancelled" },
        ]
      : [{ value: "pending", label: "Pending" }],
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Enter any additional notes",
    required: false,
  },
];

// Legacy export for backwards compatibility (with empty staff options)
/**
 * Gets restricted form fields for regular staff members
 * Only shows request type, dates, and notes
 */
export const getRestrictedAbsenceRequestFormFields = (
  currentStaffId: string
): FormFieldConfig[] => [
  {
    key: "staffId",
    label: "Staff ID",
    type: "text",
    required: true,
    validation: () => null, // Always valid since we provide the value
    placeholder: currentStaffId,
  },
  {
    key: "requestType",
    label: "Request Type",
    type: "select",
    placeholder: "Select request type",
    required: true,
    options: [
      { value: "vacation", label: "Vacation" },
      { value: "sick", label: "Sick Leave" },
      { value: "personal", label: "Personal" },
      { value: "training", label: "Training" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
    placeholder: "Select start date",
    required: true,
    validation: (value) => {
      if (!value) return "Start date is required";
      return null;
    },
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Select end date",
    required: true,
    validation: (value) => {
      if (!value) return "End date is required";
      return null;
    },
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Enter any additional notes",
    required: false,
  },
];

// Legacy export for backwards compatibility (with empty staff options)
export const ABSENCE_REQUEST_FORM_FIELDS: FormFieldConfig[] =
  getAbsenceRequestFormFields([]);
