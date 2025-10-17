/**
 * Product Form Fields Configuration
 */

import { FormFieldConfig } from "../../../../../hooks";

export const PRODUCT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Product Name",
    type: "text" as const,
    required: true,
    placeholder: "Enter product name",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: false,
    placeholder: "Enter product description",
  },
  {
    key: "category",
    label: "Category",
    type: "text" as const,
    required: true,
    placeholder: "e.g., Beverages, Snacks, Toiletries",
  },
  {
    key: "price",
    label: "Price",
    type: "number" as const,
    required: true,
    placeholder: "0.00",
  },
  {
    key: "stock_quantity",
    label: "Stock Quantity",
    type: "number" as const,
    required: true,
    placeholder: "0",
  },
  {
    key: "image_url",
    label: "Image URL",
    type: "text" as const,
    required: false,
    placeholder: "https://example.com/image.jpg",
  },
];
