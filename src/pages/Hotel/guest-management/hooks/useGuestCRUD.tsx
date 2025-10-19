/**
 * Guest CRUD Hook
 *
 * Provides CRUD state management and operations for guests using the useCRUD hook.
 */

import { FormFieldConfig } from "../../../../hooks";
import type {
  GuestWithPersonalData,
  GuestCreationData,
  GuestUpdateData,
} from "../../../../hooks/queries/hotel-management/guests";
import {
  useCreateGuest,
  useUpdateGuest,
  useDeleteGuest,
} from "../../../../hooks/queries/hotel-management/guests";
import { useCRUDWithMutations } from "../../hooks/useCRUDWithMutations";
import { generateAccessCode } from "../../../../utils";

/**
 * Enhanced Guest type with UI-specific fields
 */
export type EnhancedGuest = GuestWithPersonalData & {
  fullName?: string;
  displayEmail?: string;
};

interface UseGuestCRUDProps {
  initialGuests: GuestWithPersonalData[];
  formFields: FormFieldConfig[];
  hotelId: string; // Add hotelId as required parameter
}

/**
 * Hook for managing guest CRUD operations
 *
 * @param props - Initial guests, form fields configuration, and hotel ID
 * @returns CRUD state and handlers for guests
 *
 * @example
 * ```tsx
 * const guestCRUD = useGuestCRUD({
 *   initialGuests: guests,
 *   formFields: GuestFormFields,
 *   hotelId: currentHotel.id,
 * });
 * ```
 */
export const useGuestCRUD = ({
  initialGuests,
  formFields,
  hotelId,
}: UseGuestCRUDProps) => {
  // Use the CRUD with mutations helper for database integration
  const crud = useCRUDWithMutations<
    GuestWithPersonalData & { id: string },
    GuestCreationData,
    GuestUpdateData
  >({
    initialData: initialGuests as (GuestWithPersonalData & { id: string })[],
    formFields,
    searchFields: ["guest_name", "room_number", "guest_email"],
    defaultViewMode: "list",
    createMutation: useCreateGuest(),
    updateMutation: useUpdateGuest(),
    deleteMutation: useDeleteGuest(),
    // Transform form data to database insert format
    transformCreate: (data) => {
      console.log("[useGuestCRUD] Starting guest creation process...");
      console.log("[useGuestCRUD] Form data received:", data);

      // Build guest_name from first_name and last_name
      const firstName = (data.first_name as string) || "";
      const lastName = (data.last_name as string) || "";
      const fullName = `${firstName} ${lastName}`.trim();

      // Generate access code if not provided
      const accessCode = (data.access_code as string) || generateAccessCode();

      // Use checkout_date for access_code_expires_at, or default to 30 days from now
      let expirationDate: Date;
      if (data.checkout_date) {
        console.log(
          "[useGuestCRUD] Checkout date provided:",
          data.checkout_date
        );
        expirationDate = new Date(data.checkout_date as string);
        // Set to end of day (23:59:59)
        expirationDate.setHours(23, 59, 59, 999);
        console.log(
          "[useGuestCRUD] Expiration date set to:",
          expirationDate.toISOString()
        );
      } else {
        console.log("[useGuestCRUD] No checkout date, using default 30 days");
        expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
      }

      // Parse boolean values properly - handle empty strings and string values
      const parseBoolean = (value: unknown): boolean => {
        if (typeof value === "boolean") return value;
        if (value === "true" || value === true) return true;
        if (value === "false" || value === false) return false;
        // Default to true for is_active, false for dnd_status
        return false;
      };

      const isActive =
        data.is_active !== undefined && data.is_active !== ""
          ? parseBoolean(data.is_active)
          : true; // Default to true if not set

      const dndStatus =
        data.dnd_status !== undefined && data.dnd_status !== ""
          ? parseBoolean(data.dnd_status)
          : false; // Default to false if not set

      console.log(
        "[useGuestCRUD] Parsed is_active:",
        isActive,
        "from:",
        data.is_active
      );
      console.log(
        "[useGuestCRUD] Parsed dnd_status:",
        dndStatus,
        "from:",
        data.dnd_status
      );

      // Collect additional guests data from multi-guest carousel
      // Note: This will be populated by DynamicForm if multi-guest is enabled
      const additionalGuests =
        (data._additionalGuests as Array<Record<string, unknown>>) || [];
      console.log(
        "[useGuestCRUD] Additional guests count:",
        additionalGuests.length
      );

      const guestCreationData = {
        guestData: {
          room_number: (data.room_number as string) || "",
          guest_name: fullName || "",
          hashed_verification_code: accessCode, // Use the access code
          access_code_expires_at: expirationDate.toISOString(),
          is_active: isActive,
          dnd_status: dndStatus,
          hotel_id: hotelId, // Use the hotelId parameter instead of getHotelId()
        },
        personalData: {
          first_name: firstName,
          last_name: lastName,
          guest_email: (data.guest_email as string) || "",
          phone_number: (data.phone_number as string) || undefined,
          date_of_birth: (data.date_of_birth as string) || undefined,
          country: (data.country as string) || undefined,
          language: (data.language as string) || "english", // Default to English
          additional_guests_data:
            additionalGuests.length > 0 ? additionalGuests : undefined,
        },
      };

      console.log(
        "[useGuestCRUD] Guest creation data prepared:",
        JSON.stringify(guestCreationData, null, 2)
      );
      return guestCreationData;
    },
    // Transform form data to database update format
    transformUpdate: (id, data) => {
      // Build guest_name from first_name and last_name
      const firstName = (data.first_name as string) || "";
      const lastName = (data.last_name as string) || "";
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        id: id as string,
        hotelId: hotelId, // Use the hotelId parameter instead of getHotelId()
        guestData: {
          room_number: data.room_number as string,
          guest_name: fullName,
          is_active: data.is_active as boolean,
          dnd_status: data.dnd_status as boolean,
        },
        personalData: {
          first_name: firstName,
          last_name: lastName,
          guest_email: (data.guest_email as string) || undefined,
          phone_number: (data.phone_number as string) || undefined,
          date_of_birth: (data.date_of_birth as string) || undefined,
          country: (data.country as string) || undefined,
          language: (data.language as string) || undefined,
        },
      };
    },
    // Transform ID for delete operation
    transformDelete: (id) => ({
      id: id as string,
      hotelId: hotelId, // Use the hotelId parameter instead of getHotelId()
    }),
    // Optional: Customize how new entities appear in local state
    formatNewEntity: (formData) => ({
      ...formData,
      created_at: new Date().toISOString(),
      is_active: (formData.is_active as boolean) ?? true,
      dnd_status: (formData.dnd_status as boolean) ?? false,
    }),
    formatUpdatedEntity: (formData) => formData,
  });

  // Map crud result to the expected return structure
  return {
    data: crud.data as GuestWithPersonalData[],
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
