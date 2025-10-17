/**
 * Amadeus API configuration
 */

export const AMADEUS_CONFIG = {
  baseUrl: "https://test.api.amadeus.com/v1",
  endpoints: {
    auth: "/security/oauth2/token",
    activities: "/shopping/activities",
  },
  timeouts: {
    default: 10000, // 10 seconds
    search: 15000, // 15 seconds
  },
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
  },
} as const;
