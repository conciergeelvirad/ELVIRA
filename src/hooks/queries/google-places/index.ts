/**
 * Google Places Query Hooks
 *
 * Centralized exports for all Google Places API related query hooks.
 * This provides a clean public API for the rest of the application.
 */

// Query Keys
export { googlePlacesKeys } from "./queryKeys";

// Hotel Location
export { useHotelLocation } from "./useHotelLocation";

// API Key Management
export { useGooglePlacesApiKey } from "./useGooglePlacesApiKey";

// Nearby Restaurants
export {
  useNearbyRestaurants,
  useNearbyRestaurantsWithStatus,
  type NearbyRestaurantsParams,
} from "./useNearbyRestaurants";

// Place Details
export { usePlaceDetails } from "./usePlaceDetails";

// Re-export types from service layer for convenience
export type {
  Restaurant,
  PlaceLocation,
  NearbyRestaurantsParams as GooglePlacesParams,
  NearbyRestaurantsResponse,
} from "../../../services/googlePlaces.service";
