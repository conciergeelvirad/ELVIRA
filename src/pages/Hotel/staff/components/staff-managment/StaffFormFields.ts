import { FormFieldConfig } from "../../../../../hooks";

// Define the form fields for staff members
export const STAFF_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
    required: true,
    validation: (value) => {
      if (!value) return "Name is required";
      return null;
    },
  },
  {
    key: "position",
    label: "Position",
    type: "select",
    placeholder: "Select position",
    required: true,
    options: [
      { value: "Hotel Admin", label: "Hotel Admin" },
      { value: "Hotel Staff", label: "Hotel Staff" },
    ],
  },
  {
    key: "department",
    label: "Department",
    type: "select",
    placeholder: "Select department",
    required: true,
    options: [
      { value: "Manager", label: "Manager" },
      { value: "Reception", label: "Reception" },
      { value: "Housekeeping", label: "Housekeeping" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Food & Beverage", label: "Food & Beverage" },
      { value: "Security", label: "Security" },
    ],
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    required: true,
    validation: (value) => {
      if (!value) return "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(value as string))
        return "Invalid email format";
      return null;
    },
  },
  {
    key: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
    required: true,
    validation: (value) => {
      if (!value) return "Phone number is required";
      return null;
    },
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select date of birth",
    required: false,
  },
  {
    key: "city",
    label: "City",
    type: "text",
    placeholder: "Enter city",
    required: false,
  },
  {
    key: "zipCode",
    label: "Zip Code",
    type: "text",
    placeholder: "Enter zip code",
    required: false,
  },
  {
    key: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter full address",
    required: false,
  },
  {
    key: "emergencyContactName",
    label: "Emergency Contact Name",
    type: "text",
    placeholder: "Enter emergency contact name",
    required: false,
  },
  {
    key: "emergencyContactNumber",
    label: "Emergency Contact Phone",
    type: "tel",
    placeholder: "Enter emergency contact phone",
    required: false,
  },
];
