/**
 * Google Places API utility functions
 */

import { APIError } from "../../shared/errors";

/**
 * Converts Google Places API status to an APIError
 */
export function handlePlacesError(
  status: google.maps.places.PlacesServiceStatus,
  context: string
): void {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    return;
  }

  switch (status) {
    case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
      // This is not an error, just no results found
      return;

    case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
      throw APIError.rateLimitError(`${context}: Query limit exceeded`, {
        status,
      });

    case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
      throw APIError.authError(`${context}: Request denied - check API key`, {
        status,
      });

    case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
      throw APIError.badRequest(`${context}: Invalid request parameters`, {
        status,
      });

    default:
      throw new APIError(
        `${context}: ${status}`,
        "PLACES_API_ERROR",
        undefined,
        { status }
      );
  }
}

/**
 * Creates a temporary map element required by PlacesService
 */
export function createTemporaryMap(): google.maps.Map {
  const mapDiv = document.createElement("div");
  return new google.maps.Map(mapDiv, {
    center: { lat: 0, lng: 0 },
    zoom: 1,
  });
}

/**
 * Creates a PlacesService instance
 * @throws {APIError} if Google Maps is not loaded
 */
export function createPlacesService(): google.maps.places.PlacesService {
  if (!window.google?.maps?.places) {
    throw APIError.networkError(
      "Google Maps Places service not loaded. Call loadGoogleMapsScript first."
    );
  }

  return new google.maps.places.PlacesService(createTemporaryMap());
}

/**
 * Removes duplicate places from results
 */
export function deduplicatePlaceResults(
  results: google.maps.places.PlaceResult[]
): google.maps.places.PlaceResult[] {
  return Array.from(
    new Map(results.map((place) => [place.place_id, place])).values()
  );
}
