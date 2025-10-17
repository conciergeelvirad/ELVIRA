/**
 * Announcement Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting announcement data.
 */

import type { Announcement } from "./announcement.types";

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters announcements by active status
 */
export const filterActiveAnnouncements = (
  announcements: Announcement[]
): Announcement[] => {
  return announcements.filter((announcement) => announcement.is_active);
};

/**
 * Filters announcements by creator
 */
export const filterByCreator = (
  announcements: Announcement[],
  creatorId: string
): Announcement[] => {
  return announcements.filter(
    (announcement) => announcement.created_by === creatorId
  );
};

/**
 * Filters announcements with descriptions
 */
export const filterWithDescription = (
  announcements: Announcement[]
): Announcement[] => {
  return announcements.filter(
    (announcement) =>
      announcement.description && announcement.description.trim().length > 0
  );
};

/**
 * Filters announcements by date range
 */
export const filterByDateRange = (
  announcements: Announcement[],
  startDate: Date,
  endDate: Date
): Announcement[] => {
  return announcements.filter((announcement) => {
    if (!announcement.created_at) return false;
    const announcementDate = new Date(announcement.created_at);
    return announcementDate >= startDate && announcementDate <= endDate;
  });
};

/**
 * Filters recent announcements (last N days)
 */
export const filterRecentAnnouncements = (
  announcements: Announcement[],
  days: number = 7
): Announcement[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return announcements.filter((announcement) => {
    if (!announcement.created_at) return false;
    return new Date(announcement.created_at) >= cutoffDate;
  });
};

/**
 * Searches announcements by title or content
 */
export const searchAnnouncements = (
  announcements: Announcement[],
  searchTerm: string
): Announcement[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return announcements;

  return announcements.filter((announcement) => {
    const title = announcement.title?.toLowerCase() || "";
    const description = announcement.description?.toLowerCase() || "";

    return title.includes(term) || description.includes(term);
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts announcements by creation date (newest first)
 */
export const sortAnnouncementsByDate = (
  announcements: Announcement[]
): Announcement[] => {
  return [...announcements].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sorts announcements by active status (active first)
 */
export const sortAnnouncementsByStatus = (
  announcements: Announcement[]
): Announcement[] => {
  return [...announcements].sort((a, b) => {
    if (a.is_active === b.is_active) return 0;
    return a.is_active ? -1 : 1;
  });
};

/**
 * Sorts announcements by title (alphabetically)
 */
export const sortAnnouncementsByTitle = (
  announcements: Announcement[]
): Announcement[] => {
  return [...announcements].sort((a, b) => {
    const titleA = a.title?.toLowerCase() || "";
    const titleB = b.title?.toLowerCase() || "";
    return titleA.localeCompare(titleB);
  });
};

/**
 * Sorts announcements by update date (most recently updated first)
 */
export const sortAnnouncementsByUpdate = (
  announcements: Announcement[]
): Announcement[] => {
  return [...announcements].sort((a, b) => {
    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return dateB - dateA;
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups announcements by month
 */
export const groupAnnouncementsByMonth = (
  announcements: Announcement[]
): Record<string, Announcement[]> => {
  return announcements.reduce((acc, announcement) => {
    if (!announcement.created_at) return acc;

    const date = new Date(announcement.created_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(announcement);
    return acc;
  }, {} as Record<string, Announcement[]>);
};

/**
 * Groups announcements by date (day)
 */
export const groupAnnouncementsByDate = (
  announcements: Announcement[]
): Record<string, Announcement[]> => {
  return announcements.reduce((acc, announcement) => {
    if (!announcement.created_at) return acc;

    const date = new Date(announcement.created_at).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(announcement);
    return acc;
  }, {} as Record<string, Announcement[]>);
};

/**
 * Groups announcements by active status
 */
export const groupAnnouncementsByStatus = (
  announcements: Announcement[]
): { active: Announcement[]; inactive: Announcement[] } => {
  return announcements.reduce(
    (acc, announcement) => {
      if (announcement.is_active) {
        acc.active.push(announcement);
      } else {
        acc.inactive.push(announcement);
      }
      return acc;
    },
    { active: [], inactive: [] } as {
      active: Announcement[];
      inactive: Announcement[];
    }
  );
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Extracts unique creators from announcements
 */
export const getUniqueCreators = (announcements: Announcement[]): string[] => {
  const creators = new Set(
    announcements
      .map((announcement) => announcement.created_by)
      .filter((creator): creator is string => !!creator)
  );
  return Array.from(creators).sort();
};

/**
 * Gets count of announcements by month
 */
export const getAnnouncementCountByMonth = (
  announcements: Announcement[]
): Record<string, number> => {
  return announcements.reduce((acc, announcement) => {
    if (!announcement.created_at) return acc;

    const date = new Date(announcement.created_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets the most recent announcement
 */
export const getMostRecentAnnouncement = (
  announcements: Announcement[]
): Announcement | null => {
  if (announcements.length === 0) return null;
  return sortAnnouncementsByDate(announcements)[0];
};

/**
 * Counts active announcements
 */
export const countActiveAnnouncements = (
  announcements: Announcement[]
): number => {
  return announcements.filter((announcement) => announcement.is_active).length;
};

// ============================================================================
// Status Utilities
// ============================================================================

/**
 * Checks if an announcement is recent (last 24 hours)
 */
export const isRecentAnnouncement = (announcement: Announcement): boolean => {
  if (!announcement.created_at) return false;
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return new Date(announcement.created_at) >= oneDayAgo;
};

/**
 * Gets announcement age in days
 */
export const getAnnouncementAge = (announcement: Announcement): number => {
  if (!announcement.created_at) return 0;
  const now = new Date();
  const created = new Date(announcement.created_at);
  const diffTime = now.getTime() - created.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Gets priority color for badges
 */
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    urgent: "red",
    high: "orange",
    medium: "yellow",
    low: "blue",
  };
  return colors[priority] || "gray";
};

/**
 * Gets priority icon name
 */
export const getPriorityIcon = (priority: string): string => {
  const icons: Record<string, string> = {
    urgent: "alert-circle",
    high: "alert-triangle",
    medium: "info",
    low: "message-circle",
  };
  return icons[priority] || "message-circle";
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats announcement date for display
 */
export const formatAnnouncementDate = (announcement: Announcement): string => {
  if (!announcement.created_at) return "Unknown date";

  const date = new Date(announcement.created_at);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};

/**
 * Formats announcement summary
 */
export const formatAnnouncementSummary = (
  announcement: Announcement
): string => {
  const title = announcement.title || "Untitled";
  const status = announcement.is_active ? "Active" : "Inactive";
  const date = formatAnnouncementDate(announcement);
  return `${title} [${status}] - ${date}`;
};

/**
 * Truncates announcement content
 */
export const truncateContent = (
  content: string | null,
  maxLength: number = 150
): string => {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

/**
 * Formats priority name for display
 */
export const formatPriorityName = (priority: string): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};
