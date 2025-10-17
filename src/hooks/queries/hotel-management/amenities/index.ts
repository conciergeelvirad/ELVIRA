/**
 * Amenity Module Exports
 *
 * Centralized exports for amenity-related types, constants, utilities, and hooks.
 */

// Types
export type {
  AmenityTable,
  Amenity,
  AmenityInsert,
  AmenityUpdate,
  AmenityUpdateData,
  AmenityCategory,
  AmenityAvailability,
} from "./amenity.types";

// Constants
export { amenitiesKeys } from "./amenity.constants";

// Transformers
export {
  // Filtering utilities
  filterActiveAmenities,
  filterByCategory,
  filterRecommendedAmenities,
  filterFreeAmenities,
  filterPaidAmenities,
  searchAmenities,

  // Sorting utilities
  sortAmenitiesByName,
  sortAmenitiesByCategory,
  sortAmenitiesByPrice,
  sortAmenitiesByRecommendation,

  // Grouping utilities
  groupAmenitiesByCategory,
  groupAmenitiesByPriceType,
  groupAmenitiesByActiveStatus,

  // Data extraction utilities
  getUniqueCategories,
  getActiveAmenities,
  calculateTotalCost,
  getAmenitiesInPriceRange,

  // Status utilities
  isAmenityAvailable,
  getAmenityStatus,
  getAmenityStatusColor,

  // Formatting utilities
  formatAmenityPrice,
  formatAmenitySummary,
  formatCategoryName,
} from "./amenity.transformers";

// Query Hooks
export {
  useAmenities,
  useAmenityDetails,
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
} from "./useAmenityQueries";
