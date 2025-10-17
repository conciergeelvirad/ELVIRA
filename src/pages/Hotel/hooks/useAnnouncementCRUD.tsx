import { useHotelStaff } from "../../../hooks/hotel/useHotelStaff";
import { FormFieldConfig } from "../../../hooks";
import type {
  Announcement,
  AnnouncementInsert,
  AnnouncementUpdate,
} from "../../../hooks/queries/hotel-management/announcements";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "../../../hooks/queries/hotel-management/announcements";
import { useCRUDWithMutations } from "./useCRUDWithMutations";

// Define enhanced type for Announcement
export type EnhancedAnnouncement = Announcement & {
  // Add any additional UI-specific fields here
  formattedDate?: string;
  priorityDisplay?: string;
};

// Make sure Announcement satisfies the Record<string, unknown> constraint
type AnnouncementForCRUD = Announcement & Record<string, unknown>;

interface UseAnnouncementCRUDProps {
  initialAnnouncements: Announcement[];
  formFields: FormFieldConfig[];
}

export const useAnnouncementCRUD = ({
  initialAnnouncements,
  formFields,
}: UseAnnouncementCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    AnnouncementForCRUD,
    AnnouncementInsert,
    AnnouncementUpdate
  >({
    initialData: initialAnnouncements as AnnouncementForCRUD[],
    formFields,
    searchFields: ["title", "description"],
    defaultViewMode: "list",
    createMutation: useCreateAnnouncement(),
    updateMutation: useUpdateAnnouncement(),
    deleteMutation: useDeleteAnnouncement(),
    // Transform form data to database insert format
    transformCreate: (data) => ({
      title: (data.title as string) || "",
      description: (data.description as string) || "",
      is_active: (data.is_active as boolean) ?? true,
      hotel_id: getHotelId(),
    }),
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      title: data.title as string,
      description: data.description as string,
      is_active: data.is_active as boolean,
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
    data: crud.data as Announcement[],
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
