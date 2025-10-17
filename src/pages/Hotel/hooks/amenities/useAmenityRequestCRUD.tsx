import { useCRUD } from "../../../../hooks";
import { FormFieldConfig } from "../../../../hooks";
import type { AmenityRequest } from "../../../../hooks/queries/hotel-management/amenity-requests";

// Define enhanced type for AmenityRequest
export type EnhancedAmenityRequest = AmenityRequest & {
  // Add any additional UI-specific fields here
  guestName?: string;
  amenityName?: string;
  statusDisplay?: string;
};

// Make sure AmenityRequest satisfies the Record<string, unknown> constraint
type AmenityRequestForCRUD = AmenityRequest & Record<string, unknown>;

interface UseAmenityRequestCRUDProps {
  initialRequests: AmenityRequest[];
  formFields: FormFieldConfig[];
}

export const useAmenityRequestCRUD = ({
  initialRequests,
  formFields,
}: UseAmenityRequestCRUDProps) => {
  // Cast initialRequests to satisfy the CRUDEntity constraint
  const initialDataForCRUD = initialRequests as AmenityRequestForCRUD[];

  // Use the generic CRUD hook with our AmenityRequest type
  const crud = useCRUD<AmenityRequestForCRUD>({
    initialData: initialDataForCRUD,
    formFields,
    searchFields: ["status", "special_instructions"],
    defaultViewMode: "list",
    // Customize how new entities are created
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      status: (formData.status as string) ?? "pending",
      request_date:
        (formData.request_date as string) ??
        new Date().toISOString().split("T")[0],
    }),
    // Customize how entities are updated
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as AmenityRequest[],
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
