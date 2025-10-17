/**
 * Amenity Requests Module
 *
 * Centralized exports for amenity request management functionality.
 */

// Type exports
export type {
  AmenityRequest,
  AmenityRequestInsert,
  AmenityRequestUpdate,
  ExtendedAmenityRequest,
  AmenityRequestUpdateData,
  AmenityRequestStatusUpdateData,
  AmenityRequestDeletionData,
} from "./amenity-request.types";

// Constants exports
export {
  amenityRequestKeys,
  DEFAULT_HOTEL_ID,
} from "./amenity-request.constants";

// Transformer exports
export {
  // Filtering
  filterRequestsByStatus,
  filterRequestsByGuest,
  filterRequestsByAmenity,
  filterRequestsByRoom,
  filterRequestsByDateRange,
  filterPendingRequests,
  filterCompletedRequests,
  filterCancelledRequests,
  filterTodaysRequests,
  searchRequests,

  // Sorting
  sortRequestsByDateDesc,
  sortRequestsByDateAsc,
  sortRequestsByRequestDate,
  sortRequestsByGuestName,
  sortRequestsByRoom,
  sortRequestsByAmenity,
  sortRequestsByStatus,

  // Grouping
  groupRequestsByStatus,
  groupRequestsByAmenity,
  groupRequestsByGuest,
  groupRequestsByDate,

  // Data extraction
  getRequestCountsByStatus,
  getRequestCountsByAmenity,
  getMostRequestedAmenities,
  getUniqueGuestIds,
  getRequestStatistics,

  // Formatting
  formatRequestDate,
  formatRequestTime,
  formatRequestStatus,
  getRequestStatusColor,
  formatGuestName,
  formatAmenityName,
  formatRequestSummary,
  formatRequestDetails,
} from "./amenity-request.transformers";

// Query hook exports
export {
  useAmenityRequests,
  useAmenityRequestById,
  useCreateAmenityRequest,
  useUpdateAmenityRequest,
  useUpdateAmenityRequestStatus,
  useDeleteAmenityRequest,
} from "./useAmenityRequestQueries";
