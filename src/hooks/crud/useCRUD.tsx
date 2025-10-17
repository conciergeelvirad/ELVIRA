import { useState, useEffect } from "react";
import { useCRUDOperations } from "./useCRUDOperations";
import { useCRUDModals } from "./useCRUDModals";
import { useCRUDForm } from "./useCRUDForm";
import { useSearchAndFilter } from "../search";
import { FormFieldConfig } from "./useCRUDForm";
import { CRUDModalState, CRUDModalActions } from "./useCRUDModals";

// Define generic types for our CRUD hook
export type CRUDEntity = Record<string, unknown> & { id: string | number };
export type EnhancedEntity<T extends CRUDEntity> = T & Record<string, unknown>;

export interface UseCRUDOptions<T extends CRUDEntity> {
  initialData: T[];
  formFields: FormFieldConfig[];
  searchFields: string[];
  defaultViewMode?: "grid" | "list";
  enhanceEntity?: (entity: T) => EnhancedEntity<T>;
  formatNewEntity?: (formData: Record<string, unknown>) => Partial<T>;
  formatUpdatedEntity?: (formData: Record<string, unknown>) => Partial<T>;
  customOperations?: {
    create?: (data: Partial<T>) => Promise<void>;
    update?: (id: string | number, data: Partial<T>) => Promise<void>;
    delete?: (id: string | number) => Promise<void>;
  };
  // Table name for direct Supabase updates (to avoid query invalidation)
  tableName?: string;
}

// Re-export types from useCRUDForm.ts to avoid importing them directly in this file
import type { CRUDFormState, CRUDFormActions } from "./useCRUDForm";

export interface UseCRUDResult<T extends CRUDEntity> {
  data: T[];
  searchAndFilter: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterValue: string;
    setFilterValue: (value: string) => void;
    mode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    filteredData: Record<string, unknown>[];
  };
  modalState: CRUDModalState<EnhancedEntity<T>>;
  modalActions: CRUDModalActions<EnhancedEntity<T>>;
  formState: CRUDFormState;
  formActions: CRUDFormActions;
  handleStatusToggle: (
    entityId: string | number,
    newStatus: boolean
  ) => Promise<void>;
  handleRecommendedToggle: (
    entityId: string | number,
    newRecommendedStatus: boolean,
    fieldName?: "recommended" | "hotel_recommended"
  ) => Promise<void>;
  handleCreateSubmit: () => Promise<void>;
  handleEditSubmit: () => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  enhanceEntity: (entity: T) => EnhancedEntity<T>;
}

/**
 * Generic CRUD hook that can be used with any entity type
 * @param options Configuration options for the CRUD hook
 * @returns All the state and actions needed for a CRUD interface
 */
export const useCRUD = <T extends CRUDEntity>({
  initialData,
  formFields,
  searchFields,
  defaultViewMode = "list",
  enhanceEntity = (entity: T) => entity as unknown as EnhancedEntity<T>,
  formatNewEntity = (formData: Record<string, unknown>) =>
    formData as Partial<T>,
  formatUpdatedEntity = (formData: Record<string, unknown>) =>
    formData as Partial<T>,
  customOperations,
}: UseCRUDOptions<T>): UseCRUDResult<T> => {
  // Main state for entities
  const [data, setData] = useState<T[]>(initialData);
  const [isOptimisticallyUpdating, setIsOptimisticallyUpdating] =
    useState(false);

  // Sync data when initialData changes (e.g., when API data loads)
  // But skip if we're in the middle of an optimistic update
  useEffect(() => {
    if (!isOptimisticallyUpdating) {
      setData(initialData);
    }
  }, [initialData, isOptimisticallyUpdating]);

  // Cast data for useSearchAndFilter compatibility
  const dataAsRecords = data as unknown as Record<string, unknown>[];

  // Use search and filter hook for data management
  const searchAndFilter = useSearchAndFilter({
    data: dataAsRecords,
    searchFields,
    defaultViewMode,
  });

  // Use CRUD operations hook with custom operations
  const crudOperations = useCRUDOperations<T>(data, setData, customOperations);

  // Extract the form field keys for the modal
  const formKeys = formFields.map((field) => field.key);

  // Use CRUD form hook for form management (create this first)
  const [formState, formActions] = useCRUDForm(formFields);

  // Use CRUD modal hook for modal management with type casting for compatibility
  // Pass the form's setFormData so modals can update the form state
  const [modalState, modalActions] = useCRUDModals<EnhancedEntity<T>>(
    formKeys,
    formActions.setFormData
  );

  // Handle status toggle (common functionality)
  const handleStatusToggle = async (
    entityId: string | number,
    newStatus: boolean
  ) => {
    console.log("🔄 STATUS TOGGLE CALLED:", {
      entityId,
      newStatus,
      timestamp: new Date().toISOString(),
    });

    try {
      // Mark that we're doing an optimistic update
      setIsOptimisticallyUpdating(true);

      // Update local state immediately for optimistic UI
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === entityId) {
            const itemWithStatus = item as Record<string, unknown>;
            console.log("✅ Updating item in local state:", {
              id: item.id,
              oldIsActive: itemWithStatus.is_active,
              newIsActive: newStatus,
            });
            return {
              ...item,
              is_active: newStatus,
              status: newStatus ? "ACTIVE" : "INACTIVE", // Keep status for backward compatibility
            } as unknown as T;
          }
          return item;
        })
      );

      // Call the update mutation to persist to database
      await crudOperations.update(entityId, {
        is_active: newStatus,
      } as unknown as Partial<T>);

      console.log("✅ STATUS TOGGLE SUCCESS:", { entityId, newStatus });

      // Clear the flag after a short delay to allow mutation to complete
      setTimeout(() => {
        setIsOptimisticallyUpdating(false);
      }, 100);
    } catch (error) {
      console.error("❌ STATUS TOGGLE FAILED:", {
        entityId,
        newStatus,
        error,
      });
      // Revert the optimistic update on error
      setData((prevData) =>
        prevData.map((item) =>
          item.id === entityId
            ? ({
                ...item,
                is_active: !newStatus,
                status: !newStatus ? "ACTIVE" : "INACTIVE",
              } as unknown as T)
            : item
        )
      );
      setIsOptimisticallyUpdating(false);
      throw error;
    }
  };

  // Handle recommended toggle (similar to status toggle)
  const handleRecommendedToggle = async (
    entityId: string | number,
    newRecommendedStatus: boolean,
    fieldName: "recommended" | "hotel_recommended" = "recommended"
  ) => {
    console.log("⭐ RECOMMENDED TOGGLE CALLED:", {
      entityId,
      newRecommendedStatus,
      fieldName,
      timestamp: new Date().toISOString(),
    });

    try {
      // Mark that we're doing an optimistic update
      setIsOptimisticallyUpdating(true);

      // Update local state immediately for optimistic UI
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === entityId) {
            console.log("✅ Updating item recommended status:", {
              id: item.id,
              field: fieldName,
              oldValue: (item as Record<string, unknown>)[fieldName],
              newValue: newRecommendedStatus,
            });
            return {
              ...item,
              [fieldName]: newRecommendedStatus,
            } as unknown as T;
          }
          return item;
        })
      );

      // Call update operation with the recommended field
      await crudOperations.update(entityId, {
        [fieldName]: newRecommendedStatus,
      } as Partial<T>);

      console.log("✅ Recommended toggle completed successfully");

      // Clear the flag after a short delay to allow mutation to complete
      setTimeout(() => {
        setIsOptimisticallyUpdating(false);
      }, 100);
    } catch (error) {
      console.error("❌ Error toggling recommended status:", error);
      // Revert the optimistic update on error
      setData((prevData) =>
        prevData.map((item) =>
          item.id === entityId
            ? ({
                ...item,
                [fieldName]: !newRecommendedStatus,
              } as unknown as T)
            : item
        )
      );
      setIsOptimisticallyUpdating(false);
      throw error;
    }
  };

  // Handle create submission
  const handleCreateSubmit = async () => {
    const newEntityData = formatNewEntity(formState.formData);
    await crudOperations.create(newEntityData as T);
  };

  // Handle edit submission
  const handleEditSubmit = async () => {
    if (!modalState.itemToEdit) return;

    const updatedData = formatUpdatedEntity(formState.formData);
    await crudOperations.update(modalState.itemToEdit.id, updatedData);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!modalState.itemToDelete) return;
    await crudOperations.delete(modalState.itemToDelete.id);
  };

  return {
    data,
    searchAndFilter,
    modalState,
    modalActions,
    formState,
    formActions,
    handleStatusToggle,
    handleRecommendedToggle,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    enhanceEntity,
  };
};
