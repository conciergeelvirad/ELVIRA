/**
 * Announcement Module Exports
 *
 * Centralized exports for announcement-related types, constants, utilities, and hooks.
 */

// Types
export type {
  AnnouncementTable,
  Announcement,
  AnnouncementInsert,
  AnnouncementUpdate,
  AnnouncementDeletionData,
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementAudience,
} from "./announcement.types";

// Constants
export { announcementKeys } from "./announcement.constants";

// Transformers
export {
  // Filtering utilities
  filterActiveAnnouncements,
  filterByCreator,
  filterWithDescription,
  filterByDateRange,
  filterRecentAnnouncements,
  searchAnnouncements,

  // Sorting utilities
  sortAnnouncementsByDate,
  sortAnnouncementsByStatus,
  sortAnnouncementsByTitle,
  sortAnnouncementsByUpdate,

  // Grouping utilities
  groupAnnouncementsByMonth,
  groupAnnouncementsByDate,
  groupAnnouncementsByStatus,

  // Data extraction utilities
  getUniqueCreators,
  getAnnouncementCountByMonth,
  getMostRecentAnnouncement,
  countActiveAnnouncements,

  // Status utilities
  isRecentAnnouncement,
  getAnnouncementAge,
  getPriorityColor,
  getPriorityIcon,

  // Formatting utilities
  formatAnnouncementDate,
  formatAnnouncementSummary,
  truncateContent,
  formatPriorityName,
} from "./announcement.transformers";

// Query Hooks
export {
  useAnnouncements,
  useAnnouncementById,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "./useAnnouncementQueries";
