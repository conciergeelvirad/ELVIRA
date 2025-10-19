/**
 * Q&A Form Fields Configuration
 *
 * Defines form fields for creating and editing Q&A items.
 */

import { FormFieldConfig } from "../../../../hooks";

export const QA_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "category",
    label: "Category",
    type: "text" as const,
    required: true,
    placeholder: "Enter category (e.g., Dining, Services, Amenities)",
  },
  {
    key: "question",
    label: "Question",
    type: "text" as const,
    required: true,
    placeholder: "Enter question",
  },
  {
    key: "answer",
    label: "Answer",
    type: "textarea" as const,
    required: true,
    placeholder: "Enter answer",
  },
];
