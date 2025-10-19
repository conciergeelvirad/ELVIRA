/**
 * Restaurant CRUD Hook
 *
 * Provides CRUD state management and operations for restaurants using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../../hooks";
import type {
  Restaurant,
  RestaurantCreateData,
  RestaurantUpdateData,
} from "../../../../hooks/queries/hotel-management/restaurants";
import {
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../../../hooks/queries/hotel-management/restaurants";
import {
  useCRUDWithMutations,
  getHotelId,
} from "../../hooks/useCRUDWithMutations";

/**
 * Enhanced Restaurant type with UI-specific fields
 */
export type EnhancedRestaurant = Restaurant & {
  formattedDate?: string;
};

// Make sure Restaurant satisfies the Record<string, unknown> constraint
type RestaurantForCRUD = Restaurant & Record<string, unknown>;

interface UseRestaurantCRUDProps {
  initialRestaurants: Restaurant[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Restaurant CRUD operations
 */
export const useRestaurantCRUD = ({
  initialRestaurants,
  formFields,
}: UseRestaurantCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    RestaurantForCRUD,
    RestaurantCreateData,
    RestaurantUpdateData
  >({
    initialData: initialRestaurants as RestaurantForCRUD[],
    formFields,
    searchFields: ["name", "cuisine", "description"],
    defaultViewMode: "list",
    createMutation: useCreateRestaurant(),
    updateMutation: useUpdateRestaurant(),
    deleteMutation: useDeleteRestaurant(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      data: {
        name: (data.name as string) || "",
        cuisine: (data.cuisine as string) || "",
        description: (data.description as string) || undefined,
        is_active: (data.is_active as boolean) ?? true,
      },
      hotelId: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      data: {
        name: data.name as string,
        cuisine: data.cuisine as string,
        description: (data.description as string) || undefined,
        is_active: data.is_active as boolean,
      },
      hotelId: getHotelId(),
    }),
    // Transform ID for delete operation
    transformDelete: (id) => ({
      id: id as string,
      hotelId: getHotelId(),
    }),
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_active: (formData.is_active as boolean) ?? true,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as Restaurant[],
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
