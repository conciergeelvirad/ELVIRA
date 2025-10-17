/**
 * Guest Form Fields Configuration
 *
 * Defines form fields for creating and editing guests.
 */

import { FormFieldConfig } from "../../../../hooks";
import { COUNTRIES, LANGUAGES } from "../../../../utils";

export const GUEST_FORM_FIELDS: FormFieldConfig[] = [
  // Guest Basic Information (side by side)
  {
    key: "room_number",
    label: "Room Number",
    type: "text" as const,
    required: true,
    placeholder: "Enter room number",
    gridColumn: "half" as const,
  },
  {
    key: "access_code",
    label: "Access Code",
    type: "text" as const,
    required: false,
    placeholder: "6-digit code",
    maxLength: 6,
    gridColumn: "half" as const,
    showGenerateButton: true, // New property for generate button
  },
  {
    key: "checkout_date",
    label: "Checkout Date",
    type: "date" as const,
    required: true,
    placeholder: "Select checkout date",
    gridColumn: "full" as const,
  },

  // Personal Information (side by side)
  {
    key: "first_name",
    label: "First Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter first name",
    gridColumn: "half" as const,
  },
  {
    key: "last_name",
    label: "Last Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter last name",
    gridColumn: "half" as const,
  },
  {
    key: "guest_email",
    label: "Email",
    type: "email" as const,
    required: false,
    placeholder: "Enter email address",
  },
  {
    key: "phone_number",
    label: "Phone Number",
    type: "text" as const,
    required: false,
    placeholder: "Enter phone number",
  },
  {
    key: "date_of_birth",
    label: "Date of Birth",
    type: "date" as const,
    required: false,
  },

  // Location preferences (side by side)
  {
    key: "country",
    label: "Country",
    type: "select" as const,
    required: false,
    placeholder: "Select country",
    gridColumn: "half" as const,
    options: COUNTRIES.map((country) => ({
      value: country,
      label: country,
    })),
  },
  {
    key: "language",
    label: "Language",
    type: "select" as const,
    required: false,
    placeholder: "Select preferred language",
    gridColumn: "half" as const,
    options: LANGUAGES.map((language) => ({
      value: language,
      label: language,
    })),
  },

  // Guest Status (side by side)
  {
    key: "is_active",
    label: "Active",
    type: "select" as const,
    required: false,
    gridColumn: "half" as const,
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
  {
    key: "dnd_status",
    label: "Do Not Disturb",
    type: "select" as const,
    required: false,
    gridColumn: "half" as const,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
  },
];
