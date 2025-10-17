/**
 * Google Places Query Keys Factory
 *
 * Centralized query keys for Google Places API queries.
 * This ensures consistency and makes it easier to invalidate/refetch queries.
 */

/**
 * Query keys for Google Places related queries
 */
export const googlePlacesKeys = {
  all: ["google-places"] as const,

  // API Key
  apiKey: () => [...googlePlacesKeys.all, "api-key"] as const,

  // Hotel Location
  hotelLocations: () => [...googlePlacesKeys.all, "hotel-location"] as const,
  hotelLocation: (hotelId: string) =>
    [...googlePlacesKeys.hotelLocations(), hotelId] as const,

  // Nearby Restaurants
  nearbyRestaurants: () =>
    [...googlePlacesKeys.all, "nearby-restaurants"] as const,
  nearbyRestaurantsList: (hotelId: string, radius: number) =>
    [...googlePlacesKeys.nearbyRestaurants(), hotelId, radius] as const,

  // Place Details
  placeDetails: () => [...googlePlacesKeys.all, "place-details"] as const,
  placeDetail: (placeId: string) =>
    [...googlePlacesKeys.placeDetails(), placeId] as const,
} as const;
