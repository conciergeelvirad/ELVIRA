/**
 * Google Places API Service
 *
 * Provides methods to fetch nearby restaurants using Google Places API
 */

/// <reference types="google.maps" />

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string; // Address
  formatted_address?: string; // Full address
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  geometry: {
    location: PlaceLocation;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  photo_url?: string; // Convenience property for first photo URL
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  types?: string[];
  // Additional contact and detail fields
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description?: string;
    profile_photo_url?: string;
  }>;
  // Additional useful fields
  url?: string; // Google Maps URL
  wheelchair_accessible_entrance?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  takeout?: boolean;
  reservable?: boolean;
  serves_breakfast?: boolean;
  serves_lunch?: boolean;
  serves_dinner?: boolean;
  serves_beer?: boolean;
  serves_wine?: boolean;
  serves_vegetarian_food?: boolean;
}

export interface NearbyRestaurantsParams {
  location: PlaceLocation;
  radius: number; // in meters
  apiKey: string;
}

export interface NearbyRestaurantsResponse {
  results: Restaurant[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

/**
 * Loads Google Maps JavaScript API
 */
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", reject);
      return;
    }

    // Load the script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

/**
 * Fetches nearby restaurants from Google Places API using Places Service
 * Note: Google Places API doesn't support CORS for direct fetch requests.
 * We must use the Google Maps JavaScript API instead.
 */
export const fetchNearbyRestaurants = async ({
  location,
  radius,
  apiKey,
}: NearbyRestaurantsParams): Promise<NearbyRestaurantsResponse> => {
  try {
    // Load Google Maps script if not already loaded
    await loadGoogleMapsScript(apiKey);

    return new Promise((resolve, reject) => {
      // Create a temporary map element (required by PlacesService)
      const mapDiv = document.createElement("div");
      mapDiv.style.display = "none";
      document.body.appendChild(mapDiv);

      const map = new google.maps.Map(mapDiv);
      const service = new google.maps.places.PlacesService(map);

      // We'll fetch both restaurants and bars and gyms
      const types = ["restaurant", "bar", "cafe", "night_club", "gym"];
      const allResults: google.maps.places.PlaceResult[] = [];
      let completedTypes = 0;

      const errors: string[] = [];

      const checkComplete = () => {
        completedTypes++;
        if (completedTypes === types.length) {
          // Clean up
          document.body.removeChild(mapDiv);

          // If all requests failed, reject
          if (errors.length === types.length) {
            reject(new Error(`All requests failed: ${errors.join(", ")}`));
            return;
          }

          if (allResults.length > 0) {
            // Remove duplicates based on place_id
            const uniqueResults = Array.from(
              new Map(
                allResults.map((place) => [place.place_id, place])
              ).values()
            );

            // Convert Google Maps results to our Restaurant format
            const restaurants: Restaurant[] = uniqueResults.map((place) => {
              const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400 });
              return {
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
                photos: place.photos?.map(
                  (photo: google.maps.places.PlacePhoto) => ({
                    photo_reference: photo.getUrl({ maxWidth: 400 }),
                    height: photo.height || 0,
                    width: photo.width || 0,
                  })
                ),
                photo_url: photoUrl, // Convenience property
                opening_hours: place.opening_hours
                  ? {
                      open_now: place.opening_hours.open_now,
                    }
                  : undefined,
                types: place.types,
              };
            });

            resolve({
              results: restaurants,
              status: "OK",
            });
          } else {
            resolve({
              results: [],
              status: "ZERO_RESULTS",
            });
          }
        }
      };

      // Function to fetch with pagination (up to 3 pages = 60 results per type)
      const fetchTypeWithPagination = (
        placeType: string,
        pageToken?: string,
        pageCount = 0
      ) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius,
          type: placeType,
          ...(pageToken && { pageToken }),
        };

        service.nearbySearch(
          request,
          (
            results: google.maps.places.PlaceResult[] | null,
            status: google.maps.places.PlacesServiceStatus,
            pagination: google.maps.places.PlaceSearchPagination | null
          ) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              allResults.push(...results);

              // Google Places API allows up to 3 pages (60 results total per type)
              if (pagination?.hasNextPage && pageCount < 2) {
                // Wait 2 seconds before requesting next page (Google requirement)
                setTimeout(() => {
                  pagination.nextPage();
                  fetchTypeWithPagination(placeType, undefined, pageCount + 1);
                }, 2000);
              } else {
                checkComplete();
              }
            } else if (
              status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS
            ) {
              console.warn(`Error fetching ${placeType}: ${status}`);
              errors.push(`${placeType}: ${status}`);
              checkComplete();
            } else {
              checkComplete();
            }
          }
        );
      };

      // Make requests for each type
      types.forEach((placeType) => {
        fetchTypeWithPagination(placeType);
      });
    });
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    throw error;
  }
};

/**
 * Gets the URL for a Google Place photo
 */
export const getPlacePhotoUrl = (
  photoReference: string,
  apiKey: string,
  maxWidth = 400
): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
};

/**
 * Converts PostGIS geography point to lat/lng
 * Geography format: 0101000020E6100000B1FCF9B6602127402D25CB4928114840
 * This is WKB (Well-Known Binary) format in hex
 *
 * Format breakdown:
 * - 01: Byte order (01 = little-endian)
 * - 01000020: Geometry type with SRID flag
 * - E6100000: SRID 4326 (WGS84)
 * - Next 16 hex chars: X coordinate (longitude) as double
 * - Next 16 hex chars: Y coordinate (latitude) as double
 */
export const parseGeographyToLatLng = (
  geography: string
): PlaceLocation | null => {
  try {
    // PostGIS POINT geography WKB format:
    // 01 01000020 E6100000 [16 hex for X] [16 hex for Y]
    // Total header: 1+4+4 = 9 bytes = 18 hex chars

    // Remove the header (first 18 hex chars)
    const coordsHex = geography.slice(18);

    // Each coordinate is 8 bytes (16 hex chars)
    const lngHex = coordsHex.slice(0, 16);
    const latHex = coordsHex.slice(16, 32);

    // Convert hex to double (little-endian)
    const lng = hexToDouble(lngHex);
    const lat = hexToDouble(latHex);

    if (isNaN(lng) || isNaN(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
      console.error("Invalid coordinates parsed from geography:", { lat, lng });
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error("Error parsing geography:", error);
    return null;
  }
};

/**
 * Converts hex string to IEEE 754 double-precision float (little-endian)
 */
const hexToDouble = (hex: string): number => {
  // Convert hex string to byte array
  const bytes = new Uint8Array(
    hex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Create a DataView to read as double
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  // Copy bytes (little-endian)
  bytes.forEach((byte, i) => {
    view.setUint8(i, byte);
  });

  // Read as double (little-endian)
  return view.getFloat64(0, true);
};

/**
 * Fetches detailed information about a specific place using Place Details API
 * This includes reviews, contact info, opening hours, and more
 */
export const fetchPlaceDetails = async (
  placeId: string,
  apiKey: string
): Promise<Restaurant> => {
  // Ensure Google Maps is loaded
  await loadGoogleMapsScript(apiKey);

  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.places) {
      reject(new Error("Google Maps Places library not loaded"));
      return;
    }

    // Create a temporary div for PlacesService (required by Google)
    const tempDiv = document.createElement("div");
    const service = new window.google.maps.places.PlacesService(tempDiv);

    const request = {
      placeId: placeId,
      fields: [
        "place_id",
        "name",
        "formatted_address",
        "vicinity",
        "geometry",
        "rating",
        "user_ratings_total",
        "price_level",
        "business_status",
        "photos",
        "opening_hours",
        "types",
        // Contact information
        "formatted_phone_number",
        "international_phone_number",
        "website",
        "url",
        // Reviews
        "reviews",
        // Service options
        "wheelchair_accessible_entrance",
        "delivery",
        "dine_in",
        "takeout",
        "reservable",
        // Food & beverage
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
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const placeAny = place as any;

          // Transform the Google Place result to our Restaurant interface
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
              photo_reference: photo.getUrl({ maxWidth: 800 }),
              height: photo.height,
              width: photo.width,
            })),
            opening_hours: place.opening_hours
              ? {
                  open_now: place.opening_hours.isOpen?.(),
                  weekday_text: place.opening_hours.weekday_text,
                }
              : undefined,
            types: place.types,
            // Contact information
            formatted_phone_number: place.formatted_phone_number,
            international_phone_number: place.international_phone_number,
            website: place.website,
            url: place.url,
            // Reviews
            reviews: place.reviews
              ?.filter((review) => review.rating !== undefined)
              .map((review) => ({
                author_name: review.author_name,
                rating: review.rating!,
                text: review.text,
                time: review.time,
                relative_time_description: review.relative_time_description,
                profile_photo_url: review.profile_photo_url,
              })),
            // Service options
            wheelchair_accessible_entrance:
              placeAny.wheelchair_accessible_entrance,
            delivery: placeAny.delivery,
            dine_in: placeAny.dine_in,
            takeout: placeAny.takeout,
            reservable: placeAny.reservable,
            // Food & beverage
            serves_breakfast: placeAny.serves_breakfast,
            serves_lunch: placeAny.serves_lunch,
            serves_dinner: placeAny.serves_dinner,
            serves_beer: placeAny.serves_beer,
            serves_wine: placeAny.serves_wine,
            serves_vegetarian_food: placeAny.serves_vegetarian_food,
          };

          resolve(restaurant);
        } else {
          reject(
            new Error(`Place Details request failed with status: ${status}`)
          );
        }
      }
    );
  });
};
