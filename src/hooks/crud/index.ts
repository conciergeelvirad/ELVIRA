// CRUD hooks - Core functionality for Create, Read, Update, Delete operations
export { useCRUD } from "./useCRUD";
export { useCRUDForm } from "./useCRUDForm";
export { useCRUDModals } from "./useCRUDModals";
export { useCRUDOperations } from "./useCRUDOperations";

// Re-export types
export type {
  CRUDEntity,
  EnhancedEntity,
  UseCRUDOptions,
  UseCRUDResult,
} from "./useCRUD";
export type {
  FormFieldConfig,
  CRUDFormState,
  CRUDFormActions,
  UseCRUDFormReturn,
} from "./useCRUDForm";
export type { CRUDModalState, CRUDModalActions } from "./useCRUDModals";
export type { CRUDOperations } from "./useCRUDOperations";
