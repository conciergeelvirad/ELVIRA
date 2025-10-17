import { FormFieldConfig } from "../../../hooks";
import type {
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdateData,
} from "../../../hooks/queries/hotel-management/emergency-contacts";
import {
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
} from "../../../hooks/queries/hotel-management/emergency-contacts";
import { useCRUDWithMutations, getHotelId } from "./useCRUDWithMutations";

// Define enhanced type for EmergencyContact
export type EnhancedEmergencyContact = EmergencyContact &
  Record<string, unknown>;

// Make sure EmergencyContact satisfies the Record<string, unknown> constraint
type EmergencyContactEntity = EmergencyContact & Record<string, unknown>;

interface UseEmergencyContactCRUDProps {
  initialContacts: EmergencyContact[];
  formFields: FormFieldConfig[];
}

export const useEmergencyContactCRUD = ({
  initialContacts,
  formFields,
}: UseEmergencyContactCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    EmergencyContactEntity,
    EmergencyContactInsert,
    EmergencyContactUpdateData
  >({
    initialData: initialContacts as EmergencyContactEntity[],
    formFields,
    searchFields: ["contact_name", "phone_number", "category"],
    defaultViewMode: "list",
    createMutation: useCreateEmergencyContact(),
    updateMutation: useUpdateEmergencyContact(),
    deleteMutation: useDeleteEmergencyContact(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      contact_name:
        (data.contact_name as string) || (data.contactName as string) || "",
      phone_number:
        (data.phone_number as string) || (data.phoneNumber as string) || "",
      category: (data.category as string) || (data.type as string) || "general",
      description: (data.description as string) || undefined,
      is_active: (data.is_active as boolean) ?? true,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      updates: {
        contact_name:
          (data.contact_name as string) || (data.contactName as string),
        phone_number:
          (data.phone_number as string) || (data.phoneNumber as string),
        category: (data.category as string) || (data.type as string),
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
    contacts: crud.data as EmergencyContact[],
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
