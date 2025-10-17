/**
 * Google Places API configuration
 */

export const GOOGLE_PLACES_CONFIG = {
  libraries: ["places"] as const,
  scriptUrl: "https://maps.googleapis.com/maps/api/js",
  timeouts: {
    default: 10000, // 10 seconds
    search: 20000, // 20 seconds
    photos: 5000, // 5 seconds
    details: 15000, // 15 seconds
  },
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
  },
  search: {
    maxResults: 60, // Maximum number of results to fetch (3 pages)
    maxRadius: 50000, // Maximum radius in meters (50km)
    minRadius: 1000, // Minimum radius in meters (1km)
  },
} as const;
