/**
 * Page Template Barrel Export
 *
 * Provides a clean public API for CRUDPageTemplate components.
 */

// Components
export { CRUDPageHeader } from "./CRUDPageHeader";
export { CRUDGridView } from "./CRUDGridView";
export { CRUDTableView } from "./CRUDTableView";

// Hooks
export { useCRUDFiltering } from "./useCRUDFiltering";

// Types
export type {
  FormField,
  CRUDConfig,
  CRUDPageTemplateProps,
  ViewMode,
} from "./types";
