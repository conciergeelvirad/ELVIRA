/**
 * Emergency Contact Query Hooks
 *
 * React Query hooks for emergency contact data management.
 * Provides hooks for fetching, creating, updating, and deleting emergency contacts.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdateData,
} from "./emergencyContact.types";
import { emergencyContactKeys } from "./emergencyContact.constants";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all emergency contacts for a specific hotel
 *
 * @param hotelId - ID of the hotel to fetch contacts for
 * @returns Query result with emergency contacts array
 */
export const useEmergencyContacts = (hotelId: string) => {
  return useQuery({
    queryKey: emergencyContactKeys.list({ hotelId }),
    queryFn: async (): Promise<EmergencyContact[]> => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
  });
};

/**
 * Fetches a single emergency contact by ID
 *
 * @param contactId - ID of the contact to fetch
 * @returns Query result with single emergency contact
 */
export const useEmergencyContactById = (contactId: string | undefined) => {
  return useQuery({
    queryKey: emergencyContactKeys.detail(contactId || ""),
    queryFn: async (): Promise<EmergencyContact> => {
      if (!contactId) {
        throw new Error("Contact ID is required");
      }

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("id", contactId)
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!contactId,
  });
};

/**
 * Fetches active emergency contacts for a specific hotel
 *
 * @param hotelId - ID of the hotel to fetch contacts for
 * @returns Query result with active contacts array
 */
export const useActiveEmergencyContacts = (hotelId: string) => {
  return useQuery({
    queryKey: emergencyContactKeys.list({ hotelId, isActive: true }),
    queryFn: async (): Promise<EmergencyContact[]> => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_active", true)
        .order("contact_name", { ascending: true });

      if (error) {
        throw error;
      }
      return data || [];
    },
  });
};

/**
 * Fetches emergency contacts created by a specific user
 *
 * @param hotelId - ID of the hotel
 * @param creatorId - ID of the creator
 * @returns Query result with contacts array
 */
export const useEmergencyContactsByCreator = (
  hotelId: string,
  creatorId: string | undefined
) => {
  return useQuery({
    queryKey: emergencyContactKeys.list({ hotelId, createdBy: creatorId }),
    queryFn: async (): Promise<EmergencyContact[]> => {
      if (!creatorId) {
        throw new Error("Creator ID is required");
      }

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("created_by", creatorId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      return data || [];
    },
    enabled: !!creatorId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new emergency contact
 *
 * @returns Mutation result for creating contact
 */
export const useCreateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      contactData: EmergencyContactInsert
    ): Promise<EmergencyContact> => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert(contactData)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (newContact) => {
      // Invalidate all list queries for this hotel
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.list({ hotelId: newContact.hotel_id }),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactKeys.lists() });
    },
  });
};

/**
 * Updates an existing emergency contact
 *
 * @returns Mutation result for updating contact
 */
export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: EmergencyContactUpdateData): Promise<EmergencyContact> => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (updatedContact) => {
      // Invalidate list and detail queries
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.list({
          hotelId: updatedContact.hotel_id,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.detail(updatedContact.id),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactKeys.lists() });
    },
  });
};

/**
 * Deletes an emergency contact
 *
 * @returns Mutation result for deleting contact
 */
export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
      hotelId: string;
    }): Promise<string> => {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
      return id;
    },
    onSuccess: (deletedId, variables) => {
      // Invalidate list queries and remove detail from cache
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.list({ hotelId: variables.hotelId }),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactKeys.lists() });
      queryClient.removeQueries({
        queryKey: emergencyContactKeys.detail(deletedId),
      });
    },
  });
};

/**
 * Toggles the active status of an emergency contact
 *
 * @returns Mutation result for toggling status
 */
export const useToggleEmergencyContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }): Promise<EmergencyContact> => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (updatedContact) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.list({
          hotelId: updatedContact.hotel_id,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: emergencyContactKeys.detail(updatedContact.id),
      });
      queryClient.invalidateQueries({ queryKey: emergencyContactKeys.lists() });
    },
  });
};
