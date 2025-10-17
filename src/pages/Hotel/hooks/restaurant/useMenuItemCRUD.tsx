/**
 * Menu Item CRUD Hook
 */

import { useCRUD, FormFieldConfig } from "../../../../hooks";
import type { MenuItem } from "../../../../hooks/queries/hotel-management/restaurants";

export type EnhancedMenuItem = MenuItem & { formattedDate?: string };
type MenuItemForCRUD = MenuItem & Record<string, unknown>;

interface UseMenuItemCRUDProps {
  initialMenuItems: MenuItem[];
  formFields: FormFieldConfig[];
}

export const useMenuItemCRUD = ({
  initialMenuItems,
  formFields,
}: UseMenuItemCRUDProps) => {
  const initialDataForCRUD = initialMenuItems as MenuItemForCRUD[];

  const crud = useCRUD<MenuItemForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["name", "category", "description"],
    defaultViewMode: "list",
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_available: (formData.is_available as boolean) ?? true,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  return {
    data: crud.data as MenuItem[],
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
