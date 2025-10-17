/**
 * Hotel Staff Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  hotelStaffKeys,
  STAFF_WITH_PERSONAL_DATA_SELECT,
  STAFF_WITH_FULL_PERSONAL_DATA_SELECT,
} from "./staff.constants";
import { transformStaffMembers } from "./staff.transformers";
import type {
  StaffMember,
  StaffCreationData,
  StaffUpdateData,
  StaffWithPersonalData,
} from "./staff.types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch all hotel staff with personal data
 * Uses authenticated user's hotel ID
 * Returns transformed StaffMember[] for UI display
 */
export const useHotelStaffWithPersonalData = () => {
  return useQuery<StaffMember[]>({
    queryKey: hotelStaffKeys.lists(),
    queryFn: async () => {
      // Get the user's session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No authenticated user found");
      }

      // Get the user's hotel_staff record which contains their hotel_id
      const { data: currentStaff, error: staffError } = await supabase
        .from("hotel_staff")
        .select("hotel_id")
        .eq("id", session.user.id)
        .single();

      if (staffError) {
        console.error("Error fetching staff record:", staffError);
        throw new Error("Could not fetch staff record");
      }

      if (!currentStaff?.hotel_id) {
        console.error("No hotel_id found in staff record");
        throw new Error("No hotel ID found");
      }

      // Get all staff members for this hotel
      const { data, error } = await supabase
        .from("hotel_staff")
        .select(STAFF_WITH_PERSONAL_DATA_SELECT)
        .eq("hotel_id", currentStaff.hotel_id);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return transformStaffMembers(data as StaffWithPersonalData[]);
    },
  });
};

/**
 * Get a single staff member by ID with personal data
 */
export const useStaffById = (staffId: string | undefined) => {
  return useQuery({
    queryKey: hotelStaffKeys.detail(staffId || ""),
    queryFn: async () => {
      if (!staffId) {
        throw new Error("Staff ID is required");
      }

      const { data, error } = await supabase
        .from("hotel_staff")
        .select(STAFF_WITH_FULL_PERSONAL_DATA_SELECT)
        .eq("id", staffId)
        .single();

      if (error) throw error;
      return data as StaffWithPersonalData;
    },
    enabled: !!staffId,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new staff member with personal data and auth account
 * Uses edge function to handle the entire creation process securely
 */
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return useMutation({
    mutationFn: async ({ staff, personalData }: StaffCreationData) => {
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }

      // Get the current session for authentication
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("No active session found");
      }

      // Get the current user's hotel_id and role
      const { data: currentStaff, error: staffError } = await supabase
        .from("hotel_staff")
        .select("hotel_id")
        .eq("id", sessionData.session.user.id)
        .single();

      if (staffError) {
        console.error("Error fetching current staff record:", staffError);
        throw new Error("Could not fetch staff record");
      }

      // Ensure we're creating staff for the same hotel as the logged-in user
      const payload = {
        firstName: personalData.first_name,
        lastName: personalData.last_name,
        email: personalData.email,
        position: staff.position,
        department: staff.department,
        phone: personalData.phone_number,
        city: personalData.city,
        zipCode: personalData.zip_code,
        country: personalData.country,
        address: personalData.address,
        dateOfBirth: personalData.date_of_birth,
        hotelId: currentStaff.hotel_id, // Use the logged-in user's hotel_id
      };

      // Call the edge function to create staff member
      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-staff-hotel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Edge function error:", responseData);
        throw new Error(responseData.error || "Failed to create staff member");
      }

      return responseData;
    },
    onMutate: async (newStaff) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: hotelStaffKeys.lists() });

      // Snapshot the previous value
      const previousStaff = queryClient.getQueryData<StaffMember[]>(
        hotelStaffKeys.lists()
      );

      // Create optimistic staff member
      const optimisticStaff: StaffMember = {
        id: "temp-id",
        employee_id: "Pending...",
        position: newStaff.staff.position,
        department: newStaff.staff.department,
        status: "active",
        hire_date: new Date().toISOString().split("T")[0],
        personal_data: {
          first_name: newStaff.personalData.first_name,
          last_name: newStaff.personalData.last_name,
          email: newStaff.personalData.email,
        },
      };

      // Optimistically update the UI
      queryClient.setQueryData<StaffMember[]>(
        hotelStaffKeys.lists(),
        (old = []) => [...old, optimisticStaff]
      );

      return { previousStaff };
    },
    onError: (err, newStaff, context) => {
      // If the mutation fails, roll back to the previous state
      queryClient.setQueryData(hotelStaffKeys.lists(), context?.previousStaff);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: hotelStaffKeys.lists() });
    },
  });
};

/**
 * Update a staff member
 * Supports updating either staff record, personal data, or both
 */
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      staffId,
      staffUpdates,
      personalDataUpdates,
    }: StaffUpdateData) => {
      let staffData = null;
      let personalData = null;

      // Update staff record if updates provided
      if (staffUpdates) {
        const { data, error } = await supabase
          .from("hotel_staff")
          .update(staffUpdates)
          .eq("id", staffId)
          .select()
          .single();

        if (error) throw error;
        staffData = data;
      }

      // Update personal data if updates provided
      if (personalDataUpdates) {
        const { data, error } = await supabase
          .from("hotel_staff_personal_data")
          .update(personalDataUpdates)
          .eq("staff_id", staffId)
          .select()
          .single();

        if (error) throw error;
        personalData = data;
      }

      return {
        staff: staffData,
        personalData,
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: hotelStaffKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: hotelStaffKeys.detail(variables.staffId),
      });
    },
  });
};

/**
 * Delete a staff member and their auth account
 * Uses edge function to handle the entire deletion process securely
 */
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return useMutation({
    mutationFn: async (staffId: string) => {
      if (!supabaseUrl) {
        throw new Error("Supabase URL not configured");
      }

      // Get the current session for authentication
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("No active session found");
      }

      // Call the edge function to delete staff member
      const response = await fetch(
        `${supabaseUrl}/functions/v1/delete-hotel-staff`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify({ staffId }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Edge function error:", responseData);
        throw new Error(responseData.error || "Failed to delete staff member");
      }

      console.log(
        "✅ Staff member deleted successfully:",
        responseData.message
      );
      return responseData;
    },
    onMutate: async (staffIdToDelete) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: hotelStaffKeys.lists() });

      // Snapshot the previous value
      const previousStaff = queryClient.getQueryData<StaffMember[]>(
        hotelStaffKeys.lists()
      );

      // Optimistically remove the staff member
      queryClient.setQueryData<StaffMember[]>(
        hotelStaffKeys.lists(),
        (old = []) => old.filter((staff) => staff.id !== staffIdToDelete)
      );

      return { previousStaff };
    },
    onError: (_err, _staffId, context) => {
      // Roll back on error
      if (context?.previousStaff) {
        queryClient.setQueryData(hotelStaffKeys.lists(), context.previousStaff);
      }
      console.error("❌ Failed to delete staff member");
    },
    onSettled: () => {
      // Sync with server
      queryClient.invalidateQueries({ queryKey: hotelStaffKeys.lists() });
    },
  });
};
