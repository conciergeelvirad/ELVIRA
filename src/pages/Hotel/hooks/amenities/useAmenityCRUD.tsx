import { FormFieldConfig } from "../../../../hooks";
import type {
  Amenity,
  AmenityInsert,
  AmenityUpdateData,
} from "../../../../hooks/queries/hotel-management/amenities";
import {
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
} from "../../../../hooks/queries/hotel-management/amenities";
import { useCRUDWithMutations, getHotelId } from "../useCRUDWithMutations";

// Define enhanced type for Amenity
export type EnhancedAmenity = Amenity & {
  // Add any additional UI-specific fields here
  formattedPrice?: string;
  categoryDisplay?: string;
};

// Make sure Amenity satisfies the Record<string, unknown> constraint
type AmenityForCRUD = Amenity & Record<string, unknown>;

interface UseAmenityCRUDProps {
  initialAmenities: Amenity[];
  formFields: FormFieldConfig[];
}

export const useAmenityCRUD = ({
  initialAmenities,
  formFields,
}: UseAmenityCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    AmenityForCRUD,
    AmenityInsert,
    AmenityUpdateData
  >({
    initialData: initialAmenities as AmenityForCRUD[],
    formFields,
    searchFields: ["name", "description", "category"],
    defaultViewMode: "grid",
    createMutation: useCreateAmenity(),
    updateMutation: useUpdateAmenity(),
    deleteMutation: useDeleteAmenity(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      name: (data.name as string) || "",
      description: (data.description as string) || null,
      category: (data.category as string) || "other",
      price: (data.price as number) ?? 0,
      is_active: (data.is_active as boolean) ?? true,
      hotel_recommended: (data.hotel_recommended as boolean) ?? false,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => {
      const updatePayload = {
        id: id as string,
        ...(data.name !== undefined && { name: data.name as string }),
        ...(data.description !== undefined && {
          description: (data.description as string) || null,
        }),
        ...(data.category !== undefined && {
          category: data.category as string,
        }),
        ...(data.price !== undefined && { price: data.price as number }),
        ...(data.is_active !== undefined && {
          is_active: data.is_active as boolean,
        }),
        ...(data.recommended !== undefined && {
          recommended: data.recommended as boolean,
        }),
        ...(data.hotel_recommended !== undefined && {
          hotel_recommended: data.hotel_recommended as boolean,
        }),
      };
      console.log("🔄 transformUpdate AMENITY:", { id, data, updatePayload });
      return updatePayload;
    },
    // Transform ID for delete operation
    transformDelete: (id) => id as string,
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_active: (formData.is_active as boolean) ?? true,
      price: (formData.price as number) ?? 0,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as Amenity[],
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
