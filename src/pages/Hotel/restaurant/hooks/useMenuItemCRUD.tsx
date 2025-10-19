/**
 * Menu Item CRUD Hook
 */

import { FormFieldConfig } from "../../../../hooks";
import type {
  MenuItem,
  MenuItemInsert,
  MenuItemUpdateData,
} from "../../../../hooks/queries/hotel-management/restaurants";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../../../hooks/queries/hotel-management/restaurants";
import {
  useCRUDWithMutations,
  getHotelId,
} from "../../hooks/useCRUDWithMutations";

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
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    MenuItemForCRUD,
    MenuItemInsert,
    MenuItemUpdateData
  >({
    initialData: initialMenuItems as MenuItemForCRUD[],
    formFields,
    searchFields: ["name", "category", "description"],
    defaultViewMode: "list",
    createMutation: useCreateMenuItem(),
    updateMutation: useUpdateMenuItem(),
    deleteMutation: useDeleteMenuItem(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      hotel_id: getHotelId(),
      name: (data.name as string) || "",
      description: (data.description as string) || null,
      category: (data.category as string) || "other",
      price: (data.price as number) ?? 0,
      service_type: (data.service_type as string[]) || null,
      special_type: (data.special_type as string[]) || null,
      restaurant_ids: (data.restaurant_ids as string[]) || [],
      is_active: (data.is_active as boolean) ?? true,
      image_url: (data.image_url as string) || null,
      hotel_recommended: (data.hotel_recommended as boolean) ?? false,
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => {
      const updatePayload = {
        id: id as string,
        updates: {
          ...(data.name !== undefined && { name: data.name as string }),
          ...(data.description !== undefined && {
            description: (data.description as string) || null,
          }),
          ...(data.category !== undefined && {
            category: data.category as string,
          }),
          ...(data.price !== undefined && { price: data.price as number }),
          ...(data.service_type !== undefined && {
            service_type: data.service_type as string[],
          }),
          ...(data.special_type !== undefined && {
            special_type: data.special_type as string[],
          }),
          ...(data.restaurant_ids !== undefined && {
            restaurant_ids: data.restaurant_ids as string[],
          }),
          ...(data.is_active !== undefined && {
            is_active: data.is_active as boolean,
          }),
          ...(data.image_url !== undefined && {
            image_url: (data.image_url as string) || null,
          }),
          ...(data.hotel_recommended !== undefined && {
            hotel_recommended: data.hotel_recommended as boolean,
          }),
        },
      };
      console.log("🔄 transformUpdate MENU ITEM:", { id, data, updatePayload });
      return updatePayload;
    },
    // Transform ID for delete operation
    transformDelete: (id) => id as string,
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_active: (formData.is_active as boolean) ?? true,
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
    handleRecommendedToggle: crud.handleRecommendedToggle,
    handleCreateSubmit: crud.handleCreateSubmit,
    handleEditSubmit: crud.handleEditSubmit,
    handleDeleteConfirm: crud.handleDeleteConfirm,
  };
};
