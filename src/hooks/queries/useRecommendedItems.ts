/**
 * Recommended Items Query Hook
 *
 * Fetches recommended items from products, amenities, and menu_items tables
 * Combines all recommended items into a unified format for display
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export interface RecommendedItem {
  id: string;
  type: "menu_item" | "product" | "amenity";
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  serviceType?: "restaurant_booking" | "room_service"; // For menu items
}

/**
 * Fetches all recommended items for a hotel
 * Combines products, amenities, and menu items marked as hotel_recommended
 *
 * @param hotelId - ID of the hotel
 * @returns Query result with unified recommended items array
 */
export const useRecommendedItems = (hotelId: string) => {
  return useQuery({
    queryKey: ["recommended-items", hotelId],
    queryFn: async (): Promise<RecommendedItem[]> => {
      const recommendedItems: RecommendedItem[] = [];

      // Fetch recommended products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, category")
        .eq("hotel_id", hotelId)
        .eq("recommended", true)
        .eq("is_active", true);

      if (productsError) {
        console.error(
          "❌ [useRecommendedItems] Error fetching products:",
          productsError
        );
      } else if (products) {
        products.forEach((product) => {
          recommendedItems.push({
            id: product.id,
            type: "product",
            title: product.name,
            description: product.description || undefined,
            price: product.price || undefined,
            imageUrl: product.image_url || undefined,
            category: "Product Shop",
          });
        });
      }

      // Fetch recommended amenities
      const { data: amenities, error: amenitiesError } = await supabase
        .from("amenities")
        .select("id, name, description, price, image_url, category")
        .eq("hotel_id", hotelId)
        .eq("recommended", true)
        .eq("is_active", true);

      if (amenitiesError) {
        console.error(
          "❌ [useRecommendedItems] Error fetching amenities:",
          amenitiesError
        );
      } else if (amenities) {
        amenities.forEach((amenity) => {
          recommendedItems.push({
            id: amenity.id,
            type: "amenity",
            title: amenity.name,
            description: amenity.description || undefined,
            price: amenity.price || undefined,
            imageUrl: amenity.image_url || undefined,
            category: "Amenity",
          });
        });
      }

      // Fetch recommended menu items
      const { data: menuItems, error: menuItemsError } = await supabase
        .from("menu_items")
        .select("id, name, description, price, image_url, category")
        .eq("hotel_id", hotelId)
        .eq("hotel_recommended", true)
        .eq("is_active", true);

      if (menuItemsError) {
        console.error(
          "❌ [useRecommendedItems] Error fetching menu items:",
          menuItemsError
        );
      } else if (menuItems) {
        menuItems.forEach((menuItem) => {
          recommendedItems.push({
            id: menuItem.id,
            type: "menu_item",
            title: menuItem.name,
            description: menuItem.description || undefined,
            price: menuItem.price || undefined,
            imageUrl: menuItem.image_url || undefined,
            category: "Menu",
          });
        });
      }

      return recommendedItems;
    },
  });
};
