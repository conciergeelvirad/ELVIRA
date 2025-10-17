/**
 * Announcement Query Hooks
 *
 * React Query hooks for managing announcement data operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { announcementKeys } from "./announcement.constants";
import type {
  Announcement,
  AnnouncementInsert,
  AnnouncementUpdate,
  AnnouncementDeletionData,
} from "./announcement.types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetches all announcements for a hotel
 *
 * Results are ordered by creation date (newest first).
 */
export const useAnnouncements = (hotelId: string) => {
  return useQuery({
    queryKey: announcementKeys.list(hotelId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    },
  });
};

/**
 * Fetches a single announcement by ID
 */
export const useAnnouncementById = (announcementId: string | undefined) => {
  return useQuery({
    queryKey: announcementKeys.detail(announcementId || ""),
    queryFn: async () => {
      if (!announcementId) {
        throw new Error("Announcement ID is required");
      }

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", announcementId)
        .single();

      if (error) throw error;
      return data as Announcement;
    },
    enabled: !!announcementId,
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Creates a new announcement
 *
 * @example
 * ```tsx
 * const createAnnouncement = useCreateAnnouncement();
 *
 * createAnnouncement.mutate({
 *   hotel_id: 'hotel-123',
 *   title: 'Pool Maintenance',
 *   description: 'The pool will be closed for maintenance on Friday.',
 *   is_active: true,
 * });
 * ```
 */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: AnnouncementInsert) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert([announcement])
        .select()
        .single();

      if (error) throw error;
      return data as Announcement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.list(data.hotel_id),
      });
    },
  });
};

/**
 * Updates an existing announcement
 *
 * @example
 * ```tsx
 * const updateAnnouncement = useUpdateAnnouncement();
 *
 * updateAnnouncement.mutate({
 *   id: 'announcement-123',
 *   title: 'Updated Title',
 *   description: 'Updated description text.',
 * });
 * ```
 */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: AnnouncementUpdate) => {
      const { data, error } = await supabase
        .from("announcements")
        .update(announcement)
        .eq("id", announcement.id)
        .select()
        .single();

      if (error) throw error;
      return data as Announcement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.list(data.hotel_id),
      });
      queryClient.invalidateQueries({
        queryKey: announcementKeys.detail(data.id),
      });
    },
  });
};

/**
 * Deletes an announcement
 *
 * This is a hard delete operation that permanently removes the announcement.
 *
 * @example
 * ```tsx
 * const deleteAnnouncement = useDeleteAnnouncement();
 *
 * deleteAnnouncement.mutate({
 *   id: 'announcement-123',
 *   hotelId: 'hotel-456',
 * });
 * ```
 */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: AnnouncementDeletionData) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: (_deletedId, variables) => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.list(variables.hotelId),
      });
      queryClient.removeQueries({
        queryKey: announcementKeys.detail(variables.id),
      });
    },
  });
};
