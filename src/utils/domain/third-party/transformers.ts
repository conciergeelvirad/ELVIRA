/**
 * Utility functions for third-party data transformations
 */

import type { AmadeusActivity } from "../../../services/amadeus/types";
import type { Restaurant } from "../../../services/googlePlaces.service";

/**
 * Converts an AmadeusActivity (tour) to Restaurant format
 * This allows tours to be processed using the same approval system as restaurants
 */
export const convertTourToRestaurant = (tour: AmadeusActivity): Restaurant => ({
  place_id: tour.id,
  name: tour.name,
  vicinity: tour.shortDescription || "",
  types: ["travel_agency", "point_of_interest"],
  geometry: {
    location: {
      lat: tour.geoCode.latitude,
      lng: tour.geoCode.longitude,
    },
  },
  rating: tour.rating,
  user_ratings_total: 0,
  photos: tour.pictures?.map((url) => ({
    photo_reference: url,
    height: 400,
    width: 600,
  })),
});
