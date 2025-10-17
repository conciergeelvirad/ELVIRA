/**
 * Third-Party Management Components
 *
 * Components for managing third-party places (restaurants, tours, etc.)
 * with approval workflows.
 */

// Generic Shared Components (excluding formatRating to avoid conflict)
export type {
  ThirdPartyType,
  LocationData,
  PriceData,
  StatusData,
  ThirdPartyMetadata,
  ThirdPartyData,
  ThirdPartyCardProps,
  ThirdPartyListProps,
  ThirdPartyDetailsModalProps,
  CardSection,
} from "./shared/types";
export {
  getTypeIcon,
  getTypeLabel,
  getTypePluralLabel,
  formatPrice,
  formatDuration,
  parseDurationToMinutes,
  getTypeBadges,
  getRatingColor,
  truncateText,
  formatCategories,
  getPrimaryCategory,
  isApproved,
  isRecommended,
  getStatusLabel,
  formatAddress,
  calculateDistance,
  formatDistance,
} from "./shared/thirdPartyHelpers";
export { ThirdPartyCard } from "./shared/ThirdPartyCard";
export * from "./shared/third-party-card";

// Restaurant Components
export { RestaurantCard } from "./RestaurantCard";
export { RestaurantList } from "./RestaurantList";
export { RestaurantTable } from "./RestaurantTable";
export { RestaurantDetailsModal } from "./RestaurantDetailsModal";

// Restaurant Details Sub-Components (Modular)
export * from "./restaurant-details";

// Restaurant Table Sub-Components (Modular)
export * from "./restaurant-table";

// Restaurant Card Sub-Components (Modular)
export * from "./restaurant-card";

// Tour Agencies Components
export * from "./tour-agencies";

// Third-Party Filter Sub-Components (Modular)
export * from "./third-party-filter";

// Shared Components
export { RadiusSelector } from "./RadiusSelector";
export { ThirdPartyFilterPanel } from "./ThirdPartyFilterPanel";

// Types
export type { Restaurant } from "./RestaurantTable";
export type { RadiusSelectorProps, PlaceLocation } from "./RadiusSelector";
export type {
  ThirdPartyFilters,
  ThirdPartyFilterPanelProps,
} from "./ThirdPartyFilterPanel";
