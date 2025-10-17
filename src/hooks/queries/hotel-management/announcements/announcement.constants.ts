/**
 * Announcement Query Constants
 *
 * Query keys for announcement-related queries.
 */

/**
 * Query key factory for announcement-related queries
 */
export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (hotelId: string) => [...announcementKeys.lists(), hotelId] as const,
  details: () => [...announcementKeys.all, "detail"] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
  active: (hotelId: string) =>
    [...announcementKeys.all, "active", hotelId] as const,
  byPriority: (hotelId: string, priority: string) =>
    [...announcementKeys.all, "priority", hotelId, priority] as const,
} as const;
