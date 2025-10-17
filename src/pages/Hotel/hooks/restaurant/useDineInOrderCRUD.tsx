/**
 * Dine-In Order CRUD Hook
 *
 * Provides CRUD state management and operations for dine-in orders using the useCRUD hook.
 */

import { useCRUD, FormFieldConfig } from "../../../../hooks";
import type { DineInOrderWithDetails } from "../../../../hooks/queries/hotel-management/restaurants";

export type EnhancedDineInOrder = DineInOrderWithDetails &
  Record<string, unknown>;

interface UseDineInOrderCRUDProps {
  initialOrders: DineInOrderWithDetails[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Dine-In Order CRUD operations
 */
export const useDineInOrderCRUD = ({
  initialOrders,
  formFields,
}: UseDineInOrderCRUDProps) => {
  const initialDataForCRUD = initialOrders as EnhancedDineInOrder[];

  const crud = useCRUD<EnhancedDineInOrder>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["guest_name", "room_number", "status"],
    defaultViewMode: "list",
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      status: (formData.status as string) ?? "pending",
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  return {
    data: crud.data as DineInOrderWithDetails[],
    searchAndFilter: crud.searchAndFilter,
    modalState: crud.modalState,
    modalActions: crud.modalActions,
    formState: crud.formState,
    formActions: crud.formActions,
    handleStatusToggle: crud.handleStatusToggle,
    handleCreateSubmit: crud.handleCreateSubmit,
    handleEditSubmit: crud.handleEditSubmit,
    handleDeleteConfirm: crud.handleDeleteConfirm,
  };
};
