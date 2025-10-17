/**
 * Guest Query Hooks
 *
 * React Query hooks for managing guest data operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { guestKeys, GUEST_SELECT } from "./guest.constants";
import { normalizeGuests } from "./guest.transformers";
import type {
  Guest,
  GuestCreationData,
  GuestUpdateData,
  GuestDeletionData,
} from "./guest.types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all guests for a hotel with personal data
 */
export const useGuests = (hotelId: string) => {
  return useQuery({
    queryKey: guestKeys.list({ hotelId }),
    queryFn: async () => {
      console.log("🔍 [useGuests] Starting query for hotelId:", hotelId);
      console.log("🔍 [useGuests] GUEST_SELECT query:", GUEST_SELECT);

      // Fetch guests
      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select(GUEST_SELECT)
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      console.log("🔍 [useGuests] Raw Supabase response - error:", guestsError);
      console.log("🔍 [useGuests] Raw Supabase response - data:", guestsData);
      console.log(
        "🔍 [useGuests] Number of guests returned:",
        guestsData?.length || 0
      );

      if (guestsError) {
        console.error("❌ [useGuests] Supabase query error:", guestsError);
        throw guestsError;
      }

      // Get unique created_by IDs (excluding nulls)
      const creatorIds = [
        ...new Set(
          guestsData
            ?.map((g) => g.created_by)
            .filter((id): id is string => id != null) || []
        ),
      ];

      console.log("🔍 [useGuests] Creator IDs to fetch:", creatorIds);

      // Fetch staff data for all creators in one query
      const staffMap = new Map();
      if (creatorIds.length > 0) {
        const { data: staffData, error: staffError } = await supabase
          .from("hotel_staff")
          .select(
            `
            id,
            hotel_staff_personal_data(
              first_name,
              last_name
            )
          `
          )
          .eq("hotel_id", hotelId)
          .in("id", creatorIds);

        console.log("🔍 [useGuests] Staff data fetched:", staffData);
        console.log("🔍 [useGuests] Staff fetch error:", staffError);

        if (!staffError && staffData) {
          // Create a map of staff_id -> staff data
          staffData.forEach((staff) => {
            const personalData = Array.isArray(staff.hotel_staff_personal_data)
              ? staff.hotel_staff_personal_data[0]
              : staff.hotel_staff_personal_data;

            staffMap.set(staff.id, {
              id: staff.id,
              staff_personal_data: personalData || null,
            });
          });
        }
      }

      console.log("🔍 [useGuests] Staff map created:", staffMap);

      // Merge staff data into guests
      const guestsWithStaff =
        guestsData?.map((guest) => ({
          ...guest,
          creator: guest.created_by
            ? staffMap.get(guest.created_by) || null
            : null,
        })) || [];

      console.log("🔍 [useGuests] Guests with staff merged:", guestsWithStaff);

      const normalized = normalizeGuests(guestsWithStaff as Guest[]);
      console.log("🔍 [useGuests] Normalized data:", normalized);
      console.log(
        "🔍 [useGuests] Number of normalized guests:",
        normalized?.length || 0
      );

      return normalized;
    },
  });
};

/**
 * Fetches a single guest by ID with personal data
 */
export const useGuestById = (guestId: string) => {
  return useQuery({
    queryKey: guestKeys.detail(guestId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select(GUEST_SELECT)
        .eq("id", guestId)
        .single();

      if (error) throw error;

      return data as Guest;
    },
    enabled: !!guestId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new guest with personal data
 *
 * This mutation performs a transaction-like operation:
 * 1. Creates the guest record
 * 2. Creates associated personal data
 * 3. If personal data creation fails, the guest record remains (manual cleanup needed)
 *
 * @example
 * ```tsx
 * const createGuest = useCreateGuest();
 *
 * createGuest.mutate({
 *   guestData: {
 *     hotel_id: 'hotel-123',
 *     room_number: '101',
 *     guest_name: 'John Doe',
 *     access_code_expires_at: new Date().toISOString(),
 *     is_active: true,
 *   },
 *   personalData: {
 *     first_name: 'John',
 *     last_name: 'Doe',
 *     guest_email: 'john@example.com',
 *     phone_number: '+1234567890',
 *   },
 * });
 * ```
 */
export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guestData, personalData }: GuestCreationData) => {
      console.log("🚀 [useCreateGuest] Starting guest creation process...");
      console.log("📦 [useCreateGuest] Guest data:", guestData);
      console.log("📦 [useCreateGuest] Personal data:", personalData);

      // Prepare data for edge function
      const requestData = {
        hotelId: guestData.hotel_id,
        roomNumber: guestData.room_number,
        verificationCode: guestData.hashed_verification_code, // Access code
        firstName: personalData.first_name,
        lastName: personalData.last_name,
        guestEmail: personalData.guest_email,
        telephone: personalData.phone_number,
        dateOfBirth: personalData.date_of_birth,
        country: personalData.country,
        language: personalData.language || "english", // Default to English if not provided
        codeExpiresAt: guestData.access_code_expires_at,
        isActive: guestData.is_active ?? true,
        dndStatus: guestData.dnd_status ?? false,
        additionalGuests: personalData.additional_guests_data || [],
      };

      console.log(
        "📤 [useCreateGuest] Calling edge function with data:",
        requestData
      );

      // Call edge function with translation support
      const { data, error } = await supabase.functions.invoke(
        "create-guest-with-translation",
        {
          body: requestData,
        }
      );

      console.log("📨 [useCreateGuest] Edge function response - data:", data);
      console.log("📨 [useCreateGuest] Edge function response - error:", error);

      if (error) {
        console.error("❌ [useCreateGuest] Edge function error:", error);
        console.error("❌ [useCreateGuest] Error message:", error.message);
        console.error("❌ [useCreateGuest] Error context:", error.context);
        throw new Error(error.message || "Failed to create guest");
      }

      if (!data?.success) {
        console.error(
          "❌ [useCreateGuest] Edge function returned failure:",
          data
        );
        console.error(
          "❌ [useCreateGuest] Failure message:",
          data?.message || data?.error
        );
        throw new Error(
          data?.message || data?.error || "Failed to create guest"
        );
      }

      console.log("✅ [useCreateGuest] Guest created successfully:", data);
      console.log(
        `📧 [useCreateGuest] Email sent: ${data.emailSent ? "YES" : "NO"}`
      );
      console.log(`🌍 [useCreateGuest] Language: ${data.language}`);

      // Return data in the expected format
      return {
        guest: {
          id: data.guestId,
          hotel_id: guestData.hotel_id,
          room_number: data.roomNumber,
          guest_name: data.guestName,
          is_active: guestData.is_active ?? true,
          dnd_status: guestData.dnd_status ?? false,
          hashed_verification_code: guestData.hashed_verification_code,
          access_code_expires_at: guestData.access_code_expires_at,
        },
        personalData: {
          guest_id: data.guestId,
          first_name: personalData.first_name,
          last_name: personalData.last_name,
          guest_email: personalData.guest_email,
          phone_number: personalData.phone_number,
          date_of_birth: personalData.date_of_birth,
          country: personalData.country,
          language: personalData.language,
          additional_guests_data: personalData.additional_guests_data,
        },
        emailSent: data.emailSent,
        language: data.language,
        message: data.message,
      };
    },
    onSuccess: (result, { guestData }) => {
      console.log(
        "✅ [useCreateGuest] onSuccess - Invalidating queries for hotel:",
        guestData.hotel_id
      );
      console.log("📊 [useCreateGuest] Result summary:", {
        guestId: result.guest.id,
        emailSent: result.emailSent,
        language: result.language,
      });

      queryClient.invalidateQueries({
        queryKey: guestKeys.list({ hotelId: guestData.hotel_id }),
      });
    },
    onError: (error: Error) => {
      console.error("💥 [useCreateGuest] Mutation error:", error);
      console.error("💥 [useCreateGuest] Error details:", {
        message: error.message,
        stack: error.stack,
      });
    },
  });
};

/**
 * Updates an existing guest and/or their personal data
 *
 * This mutation allows flexible updates:
 * - Update only guest data
 * - Update only personal data
 * - Update both guest and personal data
 *
 * @example
 * ```tsx
 * const updateGuest = useUpdateGuest();
 *
 * // Update only guest data
 * updateGuest.mutate({
 *   id: 'guest-123',
 *   hotelId: 'hotel-456',
 *   guestData: { room_number: '102' },
 * });
 *
 * // Update only personal data
 * updateGuest.mutate({
 *   id: 'guest-123',
 *   hotelId: 'hotel-456',
 *   personalData: { phone_number: '+9876543210' },
 * });
 *
 * // Update both
 * updateGuest.mutate({
 *   id: 'guest-123',
 *   hotelId: 'hotel-456',
 *   guestData: { is_active: false },
 *   personalData: { guest_email: 'newemail@example.com' },
 * });
 * ```
 */
export const useUpdateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, guestData, personalData }: GuestUpdateData) => {
      // Update guest data if provided
      if (guestData) {
        const { error: guestError } = await supabase
          .from("guests")
          .update(guestData)
          .eq("id", id);

        if (guestError) throw guestError;
      }

      // Update personal data if provided
      if (personalData) {
        const { error: personalDataError } = await supabase
          .from("guest_personal_data")
          .update(personalData)
          .eq("guest_id", id);

        if (personalDataError) throw personalDataError;
      }

      return { id };
    },
    onSuccess: (_, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.list({ hotelId }),
      });
    },
  });
};

/**
 * Deletes a guest and their personal data
 *
 * This mutation handles the foreign key constraint by:
 * 1. Deleting personal data first
 * 2. Then deleting the guest record
 *
 * @example
 * ```tsx
 * const deleteGuest = useDeleteGuest();
 *
 * deleteGuest.mutate({
 *   id: 'guest-123',
 *   hotelId: 'hotel-456',
 * });
 * ```
 */
export const useDeleteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: GuestDeletionData) => {
      // Delete personal data first (foreign key constraint)
      const { error: personalDataError } = await supabase
        .from("guest_personal_data")
        .delete()
        .eq("guest_id", id);

      if (personalDataError) throw personalDataError;

      // Then delete the guest
      const { error: guestError } = await supabase
        .from("guests")
        .delete()
        .eq("id", id);

      if (guestError) throw guestError;

      return id;
    },
    onSuccess: (_, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: guestKeys.list({ hotelId }),
      });
    },
  });
};
