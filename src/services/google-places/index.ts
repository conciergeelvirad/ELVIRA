/**
 * Google Places API Service
 */

import { GOOGLE_PLACES_CONFIG } from "./config";
import { loadGoogleMapsScript } from "./utils/maps-loader";
import {
  handlePlacesError,
  createPlacesService,
  deduplicatePlaceResults,
} from "./utils/places-utils";
import { APICache } from "../shared/cache";
import { APIError } from "../shared/errors";
import type {
  Restaurant,
  NearbyRestaurantsParams,
  NearbyRestaurantsResponse,
} from "./types";

const CACHE_TTL = {
  NEARBY_SEARCH: 5 * 60 * 1000, // 5 minutes
  PLACE_DETAILS: 15 * 60 * 1000, // 15 minutes
  PHOTOS: 60 * 60 * 1000, // 1 hour
};

/**
 * Fetches nearby restaurants from Google Places API
 */
export const fetchNearbyRestaurants = async ({
  location,
  radius,
  apiKey,
}: NearbyRestaurantsParams): Promise<NearbyRestaurantsResponse> => {
  // Validate parameters
  if (radius < GOOGLE_PLACES_CONFIG.search.minRadius) {
    throw APIError.badRequest(
      `Radius must be at least ${GOOGLE_PLACES_CONFIG.search.minRadius} meters`
    );
  }
  if (radius > GOOGLE_PLACES_CONFIG.search.maxRadius) {
    throw APIError.badRequest(
      `Radius cannot exceed ${GOOGLE_PLACES_CONFIG.search.maxRadius} meters`
    );
  }

  const cacheKey = APICache.createKey("nearby-restaurants", {
    location,
    radius,
  });

  return APICache.withCache(cacheKey, CACHE_TTL.NEARBY_SEARCH, async () => {
    try {
      await loadGoogleMapsScript(apiKey);
      const service = createPlacesService();
      const allResults: google.maps.places.PlaceResult[] = [];

      // Function to process results and fetch next page
      const fetchPage = (pageToken?: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const request: google.maps.places.PlaceSearchRequest = {
            location: new google.maps.LatLng(location.lat, location.lng),
            radius,
            type: "restaurant",
            ...(pageToken && { pageToken }),
          };

          service.nearbySearch(
            request,
            (
              results: google.maps.places.PlaceResult[] | null,
              status: google.maps.places.PlacesServiceStatus,
              pagination: google.maps.places.PlaceSearchPagination | null
            ) => {
              try {
                handlePlacesError(status, "Nearby restaurants search failed");

                if (results) {
                  allResults.push(...results);
                }

                // Get next page if available and we want more results
                if (
                  pagination?.hasNextPage &&
                  allResults.length < GOOGLE_PLACES_CONFIG.search.maxResults
                ) {
                  pagination.nextPage();
                } else {
                  resolve();
                }
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      };

      // Start fetching pages
      await fetchPage();

      // Remove duplicates and convert to our Restaurant format
      const uniqueResults = deduplicatePlaceResults(allResults);
      const restaurants: Restaurant[] = uniqueResults.map((place) => ({
        place_id: place.place_id || "",
        name: place.name || "",
        vicinity: place.vicinity || "",
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        price_level: place.price_level,
        business_status: place.business_status,
        geometry: {
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          },
        },
        photos: place.photos?.map((photo) => ({
          photo_reference: photo.getUrl({ maxWidth: 400 }),
          height: photo.height || 0,
          width: photo.width || 0,
        })),
        photo_url: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
        opening_hours: place.opening_hours
          ? {
              open_now: place.opening_hours.open_now,
            }
          : undefined,
        types: place.types,
      }));

      return {
        results: restaurants,
        status: "OK",
      };
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      throw error;
    }
  });
};

/**
 * Fetches detailed information about a specific place
 */
export const fetchPlaceDetails = async (
  placeId: string,
  apiKey: string
): Promise<Restaurant> => {
  const cacheKey = APICache.createKey("place-details", { placeId });

  return APICache.withCache(cacheKey, CACHE_TTL.PLACE_DETAILS, async () => {
    await loadGoogleMapsScript(apiKey);
    const service = createPlacesService();

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "vicinity",
          "rating",
          "user_ratings_total",
          "price_level",
          "business_status",
          "geometry",
          "photos",
          "opening_hours",
          "types",
          "formatted_phone_number",
          "international_phone_number",
          "website",
          "url",
          "wheelchair_accessible_entrance",
          "delivery",
          "dine_in",
          "takeout",
          "reservable",
          "serves_breakfast",
          "serves_lunch",
          "serves_dinner",
          "serves_beer",
          "serves_wine",
          "serves_vegetarian_food",
        ],
      };

      service.getDetails(
        request,
        (
          place: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          try {
            handlePlacesError(status, "Place details request failed");

            if (!place) {
              throw APIError.badRequest("Place not found");
            }

            const restaurant: Restaurant = {
              place_id: place.place_id!,
              name: place.name!,
              vicinity: place.vicinity || "",
              formatted_address: place.formatted_address,
              rating: place.rating,
              user_ratings_total: place.user_ratings_total,
              price_level: place.price_level,
              business_status: place.business_status,
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng(),
                },
              },
              photos: place.photos?.map((photo) => ({
                photo_reference: photo.getUrl({ maxWidth: 400 })!,
                height: photo.height!,
                width: photo.width!,
              })),
              photo_url: place.photos?.[0]?.getUrl({ maxWidth: 400 }),
              opening_hours: place.opening_hours && {
                open_now: place.opening_hours.isOpen?.(),
                weekday_text: place.opening_hours.weekday_text,
              },
              types: place.types || [],
              formatted_phone_number: place.formatted_phone_number,
              international_phone_number: place.international_phone_number,
              website: place.website?.toString(),
              url: place.url?.toString(),
            };

            resolve(restaurant);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });
};
