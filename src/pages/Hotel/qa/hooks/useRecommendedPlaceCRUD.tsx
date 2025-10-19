/**
 * Recommended Place CRUD Hook
 *
 * Provides CRUD state management and operations for Recommended Places using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../../hooks";
import type {
  RecommendedPlace,
  RecommendedPlaceInsert,
  RecommendedPlaceUpdate,
} from "../../../../hooks/queries/hotel-management/recommended-places";
import {
  useCreateRecommendedPlace,
  useUpdateRecommendedPlace,
  useDeleteRecommendedPlace,
} from "../../../../hooks/queries/hotel-management/recommended-places";
import {
  useCRUDWithMutations,
  getHotelId,
} from "../../hooks/useCRUDWithMutations";

/**
 * Enhanced Recommended Place type with UI-specific fields
 */
export type EnhancedRecommendedPlace = RecommendedPlace & {
  // Add any additional UI-specific fields here
  formattedDate?: string;
};

// Make sure RecommendedPlace satisfies the Record<string, unknown> constraint
type RecommendedPlaceForCRUD = RecommendedPlace & Record<string, unknown>;

interface UseRecommendedPlaceCRUDProps {
  initialPlaces: RecommendedPlace[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Recommended Place CRUD operations
 *
 * @param props - Initial places and form fields configuration
 * @returns CRUD state and handlers for recommended places
 */
export const useRecommendedPlaceCRUD = ({
  initialPlaces,
  formFields,
}: UseRecommendedPlaceCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    RecommendedPlaceForCRUD,
    RecommendedPlaceInsert,
    { id: string; updates: RecommendedPlaceUpdate }
  >({
    initialData: initialPlaces as RecommendedPlaceForCRUD[],
    formFields,
    searchFields: ["place_name", "address", "description"],
    defaultViewMode: "list",
    createMutation: useCreateRecommendedPlace(),
    updateMutation: useUpdateRecommendedPlace(),
    deleteMutation: useDeleteRecommendedPlace(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      place_name: (data.place_name as string) || "",
      address: (data.address as string) || "",
      description: (data.description as string) || undefined,
      is_active: (data.is_active as boolean) ?? true,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      updates: {
        place_name: data.place_name as string,
        address: data.address as string,
        description: (data.description as string) || undefined,
        is_active: data.is_active as boolean,
      },
    }),
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

  // Map crud result to the expected return structure
  return {
    data: crud.data as RecommendedPlace[],
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
