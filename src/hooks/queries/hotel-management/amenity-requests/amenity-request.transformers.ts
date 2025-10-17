/**
 * Amenity Request Transformer Functions
 *
 * Pure utility functions for transforming, filtering, sorting, and formatting amenity request data.
 * All functions are immutable and return new data structures.
 */

import {
  ExtendedAmenityRequest,
  AmenityRequest,
} from "./amenity-request.types";

// ============================================================================
// Filtering Functions
// ============================================================================

/**
 * Filters requests by status
 */
export const filterRequestsByStatus = (
  requests: ExtendedAmenityRequest[],
  status: AmenityRequest["status"]
): ExtendedAmenityRequest[] => {
  return requests.filter((request) => request.status === status);
};

/**
 * Filters requests by guest ID
 */
export const filterRequestsByGuest = (
  requests: ExtendedAmenityRequest[],
  guestId: string
): ExtendedAmenityRequest[] => {
  return requests.filter((request) => request.guest_id === guestId);
};

/**
 * Filters requests by amenity ID
 */
export const filterRequestsByAmenity = (
  requests: ExtendedAmenityRequest[],
  amenityId: string
): ExtendedAmenityRequest[] => {
  return requests.filter((request) => request.amenity_id === amenityId);
};

/**
 * Filters requests by room number
 */
export const filterRequestsByRoom = (
  requests: ExtendedAmenityRequest[],
  roomNumber: string
): ExtendedAmenityRequest[] => {
  return requests.filter(
    (request) => request.guests?.room_number === roomNumber
  );
};

/**
 * Filters requests by date range
 */
export const filterRequestsByDateRange = (
  requests: ExtendedAmenityRequest[],
  startDate: Date,
  endDate: Date
): ExtendedAmenityRequest[] => {
  return requests.filter((request) => {
    const requestDate = new Date(request.request_date);
    return requestDate >= startDate && requestDate <= endDate;
  });
};

/**
 * Filters pending requests (status = 'pending')
 */
export const filterPendingRequests = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return filterRequestsByStatus(requests, "pending");
};

/**
 * Filters completed requests (status = 'completed')
 */
export const filterCompletedRequests = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return filterRequestsByStatus(requests, "completed");
};

/**
 * Filters cancelled requests (status = 'cancelled')
 */
export const filterCancelledRequests = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return filterRequestsByStatus(requests, "cancelled");
};

/**
 * Filters requests for today
 */
export const filterTodaysRequests = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  const today = new Date().toISOString().split("T")[0];
  return requests.filter((request) => request.request_date === today);
};

/**
 * Searches requests by guest name, room number, or amenity name
 */
export const searchRequests = (
  requests: ExtendedAmenityRequest[],
  query: string
): ExtendedAmenityRequest[] => {
  if (!query.trim()) return requests;

  const lowerQuery = query.toLowerCase();
  return requests.filter((request) => {
    const guestData = request.guests?.guest_personal_data;
    const fullName = guestData
      ? `${guestData.first_name} ${guestData.last_name}`.toLowerCase()
      : "";
    const roomNumber = request.guests?.room_number?.toLowerCase() || "";
    const amenityName = request.amenities?.name?.toLowerCase() || "";

    return (
      fullName.includes(lowerQuery) ||
      roomNumber.includes(lowerQuery) ||
      amenityName.includes(lowerQuery)
    );
  });
};

// ============================================================================
// Sorting Functions
// ============================================================================

/**
 * Sorts requests by creation date (newest first)
 */
export const sortRequestsByDateDesc = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

/**
 * Sorts requests by creation date (oldest first)
 */
export const sortRequestsByDateAsc = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
};

/**
 * Sorts requests by request date
 */
export const sortRequestsByRequestDate = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort(
    (a, b) =>
      new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
  );
};

/**
 * Sorts requests by guest name
 */
export const sortRequestsByGuestName = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort((a, b) => {
    const nameA = a.guests?.guest_personal_data
      ? `${a.guests.guest_personal_data.first_name} ${a.guests.guest_personal_data.last_name}`
      : "";
    const nameB = b.guests?.guest_personal_data
      ? `${b.guests.guest_personal_data.first_name} ${b.guests.guest_personal_data.last_name}`
      : "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts requests by room number
 */
export const sortRequestsByRoom = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort((a, b) => {
    const roomA = a.guests?.room_number || "";
    const roomB = b.guests?.room_number || "";
    return roomA.localeCompare(roomB);
  });
};

/**
 * Sorts requests by amenity name
 */
export const sortRequestsByAmenity = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  return [...requests].sort((a, b) => {
    const amenityA = a.amenities?.name || "";
    const amenityB = b.amenities?.name || "";
    return amenityA.localeCompare(amenityB);
  });
};

/**
 * Sorts requests by status (pending → completed → cancelled)
 */
export const sortRequestsByStatus = (
  requests: ExtendedAmenityRequest[]
): ExtendedAmenityRequest[] => {
  const statusOrder: Record<string, number> = {
    pending: 1,
    completed: 2,
    cancelled: 3,
  };

  return [...requests].sort((a, b) => {
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
};

// ============================================================================
// Grouping Functions
// ============================================================================

/**
 * Groups requests by status
 */
export const groupRequestsByStatus = (
  requests: ExtendedAmenityRequest[]
): Record<string, ExtendedAmenityRequest[]> => {
  return requests.reduce((acc, request) => {
    const status = request.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(request);
    return acc;
  }, {} as Record<string, ExtendedAmenityRequest[]>);
};

/**
 * Groups requests by amenity
 */
export const groupRequestsByAmenity = (
  requests: ExtendedAmenityRequest[]
): Record<string, ExtendedAmenityRequest[]> => {
  return requests.reduce((acc, request) => {
    const amenityName = request.amenities?.name || "Unknown";
    if (!acc[amenityName]) acc[amenityName] = [];
    acc[amenityName].push(request);
    return acc;
  }, {} as Record<string, ExtendedAmenityRequest[]>);
};

/**
 * Groups requests by guest
 */
export const groupRequestsByGuest = (
  requests: ExtendedAmenityRequest[]
): Record<string, ExtendedAmenityRequest[]> => {
  return requests.reduce((acc, request) => {
    const guestId = request.guest_id;
    if (!acc[guestId]) acc[guestId] = [];
    acc[guestId].push(request);
    return acc;
  }, {} as Record<string, ExtendedAmenityRequest[]>);
};

/**
 * Groups requests by date (YYYY-MM-DD)
 */
export const groupRequestsByDate = (
  requests: ExtendedAmenityRequest[]
): Record<string, ExtendedAmenityRequest[]> => {
  return requests.reduce((acc, request) => {
    const date = request.request_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(request);
    return acc;
  }, {} as Record<string, ExtendedAmenityRequest[]>);
};

// ============================================================================
// Data Extraction Functions
// ============================================================================

/**
 * Gets request counts by status
 */
export const getRequestCountsByStatus = (
  requests: ExtendedAmenityRequest[]
): Record<string, number> => {
  return requests.reduce((acc, request) => {
    const status = request.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets request counts by amenity
 */
export const getRequestCountsByAmenity = (
  requests: ExtendedAmenityRequest[]
): Record<string, number> => {
  return requests.reduce((acc, request) => {
    const amenityName = request.amenities?.name || "Unknown";
    acc[amenityName] = (acc[amenityName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets most requested amenities
 */
export const getMostRequestedAmenities = (
  requests: ExtendedAmenityRequest[],
  limit: number = 10
): Array<{ amenityId: string; amenityName: string; count: number }> => {
  const amenityCounts: Record<string, { name: string; count: number }> = {};

  requests.forEach((request) => {
    const amenityId = request.amenity_id;
    const amenityName = request.amenities?.name || "Unknown";

    if (!amenityCounts[amenityId]) {
      amenityCounts[amenityId] = { name: amenityName, count: 0 };
    }
    amenityCounts[amenityId].count++;
  });

  return Object.entries(amenityCounts)
    .map(([amenityId, { name, count }]) => ({
      amenityId,
      amenityName: name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Gets unique guest IDs from requests
 */
export const getUniqueGuestIds = (
  requests: ExtendedAmenityRequest[]
): string[] => {
  return [...new Set(requests.map((request) => request.guest_id))];
};

/**
 * Gets request statistics
 */
export const getRequestStatistics = (requests: ExtendedAmenityRequest[]) => {
  const counts = getRequestCountsByStatus(requests);

  return {
    totalRequests: requests.length,
    pendingRequests: counts.pending || 0,
    completedRequests: counts.completed || 0,
    cancelledRequests: counts.cancelled || 0,
    uniqueGuests: getUniqueGuestIds(requests).length,
    todaysRequests: filterTodaysRequests(requests).length,
  };
};

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Formats request date
 */
export const formatRequestDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats request time
 */
export const formatRequestTime = (timeString: string | null): string => {
  if (!timeString) return "N/A";
  return timeString;
};

/**
 * Formats request status for display
 */
export const formatRequestStatus = (
  status: AmenityRequest["status"]
): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Gets request status color for UI
 */
export const getRequestStatusColor = (
  status: AmenityRequest["status"]
): string => {
  const colors: Record<string, string> = {
    pending: "yellow",
    completed: "green",
    cancelled: "red",
  };
  return colors[status] || "gray";
};

/**
 * Formats guest name from request
 */
export const formatGuestName = (request: ExtendedAmenityRequest): string => {
  const guestData = request.guests?.guest_personal_data;
  if (!guestData) return "Unknown Guest";
  return `${guestData.first_name} ${guestData.last_name}`;
};

/**
 * Formats amenity name from request
 */
export const formatAmenityName = (request: ExtendedAmenityRequest): string => {
  return request.amenities?.name || "Unknown Amenity";
};

/**
 * Creates a summary string for a request
 */
export const formatRequestSummary = (
  request: ExtendedAmenityRequest
): string => {
  const guestName = formatGuestName(request);
  const amenityName = formatAmenityName(request);
  const roomNumber = request.guests?.room_number || "N/A";

  return `${guestName} (Room ${roomNumber}) - ${amenityName}`;
};

/**
 * Formats full request details
 */
export const formatRequestDetails = (
  request: ExtendedAmenityRequest
): string => {
  const summary = formatRequestSummary(request);
  const date = formatRequestDate(request.request_date);
  const time = formatRequestTime(request.request_time);
  const status = formatRequestStatus(request.status);

  return `${summary} | ${date} at ${time} | Status: ${status}`;
};
