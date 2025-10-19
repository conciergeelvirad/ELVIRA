/**
 * Amenity Form Fields Configuration
 */

import { FormFieldConfig } from "../../../../../hooks";

export const AMENITY_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Amenity Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter amenity name",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter amenity description",
  },
  {
    key: "category",
    label: "Category",
    type: "text" as const,
    required: true,
    placeholder: "e.g., Room Service, Spa, Entertainment",
  },
  {
    key: "price",
    label: "Price",
    type: "number" as const,
    required: true,
    placeholder: "0.00",
  },
  {
    key: "recommended",
    label: "Hotel Recommended",
    type: "select" as const,
    required: false,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
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
  {
    key: "image_url",
    label: "Amenity Image",
    type: "file" as const,
    required: false,
    storageFolder: "AMENITIES",
  },
];
