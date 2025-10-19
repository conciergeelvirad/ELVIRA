/**
 * Announcement Form Fields Configuration
 */

import { FormFieldConfig } from "../../../../hooks";

export const ANNOUNCEMENT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "title",
    label: "Title",
    type: "text" as const,
    required: true,
    placeholder: "Enter announcement title",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: true,
    placeholder: "Enter announcement description",
  },
  {
    key: "is_active",
    label: "Active",
    type: "select" as const,
    required: false,
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];
