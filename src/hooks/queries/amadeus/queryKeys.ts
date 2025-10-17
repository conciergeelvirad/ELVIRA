/**
 * Amadeus API Query Keys
 *
 * Query keys for Amadeus Tours & Activities API queries
 */

export const amadeusKeys = {
  all: ["amadeus"] as const,
  credentials: () => [...amadeusKeys.all, "credentials"] as const,
  tours: () => [...amadeusKeys.all, "tours"] as const,
  nearbyTours: (hotelId: string, radius: number) =>
    [...amadeusKeys.tours(), hotelId, radius] as const,
  tourDetail: (tourId: string) => [...amadeusKeys.tours(), tourId] as const,
} as const;
