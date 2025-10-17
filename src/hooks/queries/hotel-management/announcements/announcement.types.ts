/**
 * Announcement Type Definitions
 *
 * Core types for hotel announcement management.
 */

import type { Tables, Insert, Update } from "../../queryUtils";

/**
 * Announcement database table type
 */
export type AnnouncementTable = Tables<"announcements">;

/**
 * Announcement type (using table type directly)
 */
export type Announcement = AnnouncementTable;

/**
 * Announcement insert type for creating new announcements
 */
export type AnnouncementInsert = Insert<"announcements">;

/**
 * Announcement update type for modifying existing announcements
 */
export type AnnouncementUpdate = Update<"announcements">;

/**
 * Announcement deletion data
 */
export type AnnouncementDeletionData = {
  id: string;
  hotelId: string;
};

/**
 * Announcement priority levels
 */
export type AnnouncementPriority = "low" | "medium" | "high" | "urgent";

/**
 * Announcement status
 */
export type AnnouncementStatus = "draft" | "published" | "archived";

/**
 * Announcement target audience
 */
export type AnnouncementAudience = "all" | "guests" | "staff" | "specific";
