/**
 * Third Party Data Transformers
 *
 * Utility functions to transform API data into card format
 */

import type { Restaurant } from "../../../../../../../services/googlePlaces.service";
import type { AmadeusActivity } from "../../../../../../../services/amadeus/types";

// Helper function to transform restaurant data to RecommendedItemCard format
export const transformRestaurantToCard = (restaurant: Restaurant) => ({
  id: restaurant.place_id,
  type: "menu_item" as const,
  title: restaurant.name,
  description: restaurant.vicinity || restaurant.formatted_address || "",
  price: undefined, // Price level is not a monetary price, so we skip it
  imageUrl: restaurant.photo_url || "",
  category: "Restaurant",
});

// Helper function to transform tour data to RecommendedItemCard format
export const transformTourToCard = (tour: AmadeusActivity) => {
  // Safely parse price to number
  const priceAmount = tour.price?.amount;
  const priceNumber = priceAmount ? Number(priceAmount) : undefined;
  const validPrice =
    priceNumber && !isNaN(priceNumber) ? priceNumber : undefined;

  return {
    id: tour.id,
    type: "amenity" as const,
    title: tour.name,
    description: tour.shortDescription || "",
    price: validPrice,
    imageUrl: tour.pictures?.[0] || "",
    category: "Tour",
  };
};
