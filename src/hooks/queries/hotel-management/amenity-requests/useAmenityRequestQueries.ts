/**
 * Amenity Request Query Hooks
 *
 * React Query hooks for amenity request management.
 * Provides hooks for fetching, creating, updating, and deleting amenity requests.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import {
  ExtendedAmenityRequest,
  AmenityRequest,
  AmenityRequestInsert,
  AmenityRequestUpdateData,
  AmenityRequestStatusUpdateData,
  AmenityRequestDeletionData,
} from "./amenity-request.types";
import { amenityRequestKeys } from "./amenity-request.constants";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all amenity requests for a specific hotel with related data
 *
 * @param hotelId - ID of the hotel to fetch requests for
 * @returns Query result with extended amenity requests array
 */
export const useAmenityRequests = (hotelId: string) => {
  return useQuery({
    queryKey: amenityRequestKeys.list(hotelId),
    queryFn: async (): Promise<ExtendedAmenityRequest[]> => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .select(
          `
          *,
          amenities!inner(
            id,
            name,
            image_url,
            description
          ),
          guests!inner(
            id,
            room_number,
            guest_personal_data(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExtendedAmenityRequest[];
    },
  });
};

/**
 * Fetches a single amenity request by ID with related data
 *
 * @param requestId - ID of the request to fetch
 * @returns Query result with single extended amenity request
 */
export const useAmenityRequestById = (requestId: string | undefined) => {
  return useQuery({
    queryKey: amenityRequestKeys.detail(requestId || ""),
    queryFn: async (): Promise<ExtendedAmenityRequest> => {
      if (!requestId) {
        throw new Error("Request ID is required");
      }

      const { data, error } = await supabase
        .from("amenity_requests")
        .select(
          `
          *,
          amenities!inner(
            id,
            name,
            image_url,
            description
          ),
          guests!inner(
            id,
            room_number,
            guest_personal_data(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("id", requestId)
        .single();

      if (error) throw error;
      return data as ExtendedAmenityRequest;
    },
    enabled: !!requestId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new amenity request
 *
 * @returns Mutation result for creating amenity request
 */
export const useCreateAmenityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      requestData: AmenityRequestInsert
    ): Promise<AmenityRequest> => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .insert(requestData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.list(data.hotel_id),
      });
    },
  });
};

/**
 * Updates an existing amenity request
 *
 * @returns Mutation result for updating amenity request
 */
export const useUpdateAmenityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
      hotelId,
    }: AmenityRequestUpdateData): Promise<AmenityRequest> => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.list(variables.hotelId),
      });
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.detail(data.id),
      });
    },
  });
};

/**
 * Updates amenity request status (convenience hook for status-only updates)
 *
 * @returns Mutation result for updating amenity request status
 */
export const useUpdateAmenityRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      hotelId,
    }: AmenityRequestStatusUpdateData): Promise<AmenityRequest> => {
      const { data, error } = await supabase
        .from("amenity_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.list(hotelId),
      });
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.detail(data.id),
      });
    },
  });
};

/**
 * Deletes an amenity request
 *
 * @returns Mutation result for deleting amenity request
 */
export const useDeleteAmenityRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      hotelId,
    }: AmenityRequestDeletionData): Promise<string> => {
      const { error } = await supabase
        .from("amenity_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId, { hotelId }) => {
      queryClient.invalidateQueries({
        queryKey: amenityRequestKeys.list(hotelId),
      });
      queryClient.removeQueries({
        queryKey: amenityRequestKeys.detail(deletedId),
      });
    },
  });
};
