/**
 * Absence Requests CRUD Hook
 *
 * Provides CRUD state management and operations for absence requests using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../hooks";
import type { AbsenceRequestWithStaff } from "../../../hooks/queries/hotel-management/absence-requests";
import type {
  AbsenceRequestInsert,
  AbsenceRequestUpdate,
} from "../../../hooks/queries/hotel-management/absence-requests/absenceRequest.types";
import {
  useCreateAbsenceRequest,
  useUpdateAbsenceRequest,
  useDeleteAbsenceRequest,
} from "../../../hooks/queries/hotel-management/absence-requests";
import { useCRUDWithMutations, getHotelId } from "./useCRUDWithMutations";

// Make sure AbsenceRequestWithStaff satisfies the Record<string, unknown> constraint
type AbsenceRequestForCRUD = AbsenceRequestWithStaff & Record<string, unknown>;

interface UseAbsenceRequestsCRUDProps {
  initialRequests: AbsenceRequestWithStaff[];
  formFields: FormFieldConfig[];
}

/**
 * Hook for managing Absence Requests CRUD operations with database integration
 */
export const useAbsenceRequestsCRUD = ({
  initialRequests,
  formFields,
}: UseAbsenceRequestsCRUDProps) => {
  const crud = useCRUDWithMutations<
    AbsenceRequestForCRUD,
    AbsenceRequestInsert,
    AbsenceRequestUpdate & { id: string }
  >({
    initialData: initialRequests as AbsenceRequestForCRUD[],
    formFields,
    searchFields: ["staffName", "requestType", "status"],
    defaultViewMode: "list",
    createMutation: useCreateAbsenceRequest(),
    updateMutation: useUpdateAbsenceRequest(),
    deleteMutation: useDeleteAbsenceRequest(),
    // Transform form data to database insert format
    transformCreate: (data) => {
      console.log("[AbsenceRequest] transformCreate - Raw form data:", data);

      const staffId = (data.staffId as string) || "";
      const hotelId = getHotelId();

      if (!staffId) {
        console.error(
          "[AbsenceRequest] transformCreate - Missing staffId:",
          data
        );
        throw new Error("Staff ID is required");
      }

      if (!hotelId) {
        console.error("[AbsenceRequest] transformCreate - Missing hotelId");
        throw new Error("Hotel ID is required");
      }

      const transformed = {
        staff_id: staffId,
        hotel_id: hotelId,
        request_type:
          (data.requestType as
            | "vacation"
            | "sick"
            | "personal"
            | "training"
            | "other") || "personal",
        start_date: (data.startDate as string) || "",
        end_date: (data.endDate as string) || "",
        status:
          (data.status as "pending" | "approved" | "rejected" | "cancelled") ||
          "pending",
        notes: (data.notes as string) || null,
        data_processing_consent: true,
        consent_date: new Date().toISOString(),
      };

      console.log(
        "[AbsenceRequest] transformCreate - Transformed data:",
        transformed
      );
      return transformed;
    },
    // Transform form data to database update format
    transformUpdate: (id, data) => ({
      id: id as string,
      staff_id: data.staffId as string,
      request_type: data.requestType as
        | "vacation"
        | "sick"
        | "personal"
        | "training"
        | "other",
      start_date: data.startDate as string,
      end_date: data.endDate as string,
      status: data.status as "pending" | "approved" | "rejected" | "cancelled",
      notes: (data.notes as string) || null,
    }),
    // Transform ID for delete operation
    transformDelete: (id) => ({
      id: id as string,
      hotelId: getHotelId(),
    }),
    // Optional: Customize how new entities appear in local state before server response
    formatNewEntity: (formData) => ({
      ...formData,
      status: "pending",
      created_at: new Date().toISOString(),
    }),
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as AbsenceRequestWithStaff[],
    searchAndFilter: crud.searchAndFilter,
    modalState: crud.modalState,
    modalActions: crud.modalActions,
    formState: crud.formState,
    formActions: crud.formActions,
    handleCreateSubmit: crud.handleCreateSubmit,
    handleEditSubmit: crud.handleEditSubmit,
    handleDeleteConfirm: crud.handleDeleteConfirm,
  };
};
