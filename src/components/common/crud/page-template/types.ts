/**
 * Shared types for CRUDPageTemplate components
 *
 * This file contains all TypeScript interfaces and types used by
 * the CRUD page template components.
 */

import type { Column } from "../../../../types/table";

/**
 * Form field configuration for CRUD operations
 */
export interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

/**
 * Configuration for CRUD page template
 */
export interface CRUDConfig<T> {
  title: string;
  columns: Column<T>[];
  formFields: FormField[];
  data: T[];
  onAdd?: (data: Partial<T>) => void;
  onEdit?: (id: string | number, data: Partial<T>) => void;
  onDelete?: (id: string | number) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
  addButtonText?: string;
  defaultViewMode?: "grid" | "list";
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  entityName?: string;
}

/**
 * Props for CRUDPageTemplate component
 */
export interface CRUDPageTemplateProps<T> {
  config: CRUDConfig<T>;
}

/**
 * View mode options for CRUD display
 */
export type ViewMode = "grid" | "list";
