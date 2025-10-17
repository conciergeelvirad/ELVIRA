/**
 * Gastronomy Page
 *
 * Displays approved restaurants from Google Places API in a compact mobile-friendly format
 * Uses the same FilterableListPage pattern as Services, Shop, and Tours pages
 */

import { useMemo, useState } from "react";
import { FilterableListPage } from "../../components/FilterableListPage";
import { MenuItemCard } from "../../components/MenuItemCard";
import { RecommendedItemModal } from "../Home/components/RecommendedSection/RecommendedItemModal";
import { useGuestHotelId } from "../../hooks";
import { useApprovedRestaurants } from "./hooks/useApprovedRestaurants";
import type { FilterOptions } from "../../components/common/FilterModal/types";
import type { Restaurant } from "../../../../services/googlePlaces.service";
import type { RecommendedItem } from "../../../../hooks/queries";
import type { FilterableItem } from "../../components/FilterableListPage/FilterableListPage";

/**
 * Extend Restaurant to match FilterableItem interface
 */
interface RestaurantItem extends FilterableItem {
  // Original Google Places fields (stored separately from FilterableItem fields)
  place_id: string;
  vicinity: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  photo_url?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  types?: string[];
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
}

/**
 * Convert Google Places restaurant format to FilterableItem format
 */
const transformRestaurantToFilterable = (
  restaurant: Restaurant
): RestaurantItem => {
  // Get price from price_level (1-4 scale)
  const getEstimatedPrice = (priceLevel?: number): number => {
    if (!priceLevel) return 0;
    // Convert Google's 1-4 scale to estimated price range
    switch (priceLevel) {
      case 1:
        return 15; // Budget
      case 2:
        return 30; // Moderate
      case 3:
        return 50; // Expensive
      case 4:
        return 75; // Very Expensive
      default:
        return 0;
    }
  };

  // Get main category from types
  const getMainCategory = (types?: string[]): string => {
    if (!types || types.length === 0) return "Restaurant";

    // Priority categories
    const priorityTypes: { [key: string]: string } = {
      restaurant: "Restaurant",
      cafe: "Café",
      bar: "Bar",
      bakery: "Bakery",
      meal_takeaway: "Takeaway",
      meal_delivery: "Delivery",
    };

    for (const type of types) {
      if (priorityTypes[type]) {
        return priorityTypes[type];
      }
    }

    return "Restaurant";
  };

  return {
    id: restaurant.place_id,
    name: restaurant.name,
    description: restaurant.vicinity || restaurant.formatted_address || null,
    price: getEstimatedPrice(restaurant.price_level),
    image_url: restaurant.photo_url || null,
    category: getMainCategory(restaurant.types),
    is_active: restaurant.business_status === "OPERATIONAL",
    hotel_recommended: true, // All are recommended since they're approved
    // Keep original Google Places fields
    place_id: restaurant.place_id,
    vicinity: restaurant.vicinity,
    formatted_address: restaurant.formatted_address,
    rating: restaurant.rating,
    user_ratings_total: restaurant.user_ratings_total,
    price_level: restaurant.price_level,
    business_status: restaurant.business_status,
    geometry: restaurant.geometry,
    photos: restaurant.photos,
    photo_url: restaurant.photo_url,
    opening_hours: restaurant.opening_hours,
    types: restaurant.types,
    formatted_phone_number: restaurant.formatted_phone_number,
    international_phone_number: restaurant.international_phone_number,
    website: restaurant.website,
  };
};

/**
 * Convert restaurant to modal format for display
 */
const convertToModalFormat = (restaurant: RestaurantItem): Restaurant => ({
  place_id: restaurant.place_id,
  name: restaurant.name,
  vicinity: restaurant.vicinity,
  formatted_address: restaurant.formatted_address,
  rating: restaurant.rating,
  user_ratings_total: restaurant.user_ratings_total,
  price_level: restaurant.price_level,
  business_status: restaurant.business_status,
  geometry: restaurant.geometry,
  photos: restaurant.photos,
  photo_url: restaurant.photo_url,
  opening_hours: restaurant.opening_hours,
  types: restaurant.types,
  formatted_phone_number: restaurant.formatted_phone_number,
  international_phone_number: restaurant.international_phone_number,
  website: restaurant.website,
});

export const GastronomyPage = () => {
  const hotelId = useGuestHotelId();

  // Fetch approved restaurants from Google Places API
  const { restaurants: googleRestaurants, isLoading } =
    useApprovedRestaurants(hotelId);

  // Transform Google Places restaurants to FilterableItem format
  const restaurants: RestaurantItem[] = useMemo(
    () => googleRestaurants.map(transformRestaurantToFilterable),
    [googleRestaurants]
  );

  // Extract unique categories from restaurants
  const categories = useMemo(() => {
    const cats = Array.from(new Set(restaurants.map((r) => r.category)));
    return cats.length > 0 ? cats : ["Restaurant"];
  }, [restaurants]);

  // Transform RestaurantItem to RecommendedItem for modal
  const transformRestaurantToRecommendedItem = (
    restaurant: RestaurantItem
  ): RecommendedItem => ({
    id: restaurant.place_id,
    type: "product", // Use "product" as the type for restaurants
    title: restaurant.name,
    description: restaurant.vicinity || restaurant.formatted_address || "",
    price: restaurant.price,
    imageUrl: restaurant.image_url || undefined,
    category: restaurant.category,
  });

  // Custom filter for restaurants
  const filterRestaurants = (
    itemsToFilter: RestaurantItem[],
    currentFilters: FilterOptions,
    query: string
  ): RestaurantItem[] => {
    let filtered = [...itemsToFilter];

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.description?.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.types?.some((type) =>
            type.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    // Category filter
    if (currentFilters.selectedCategories.length > 0) {
      filtered = filtered.filter((restaurant) =>
        currentFilters.selectedCategories.includes(restaurant.category)
      );
    }

    // Price range filter - only filter restaurants that have a price > 0
    filtered = filtered.filter((restaurant) => {
      // If restaurant has no price (0), don't filter it out
      if (restaurant.price === 0) return true;

      // Otherwise, apply price range filter
      return (
        restaurant.price >= currentFilters.priceRange.min &&
        restaurant.price <= currentFilters.priceRange.max
      );
    });

    // Recommended filter - all approved restaurants are recommended
    if (currentFilters.showOnlyRecommended) {
      filtered = filtered.filter((restaurant) => restaurant.hotel_recommended);
    }

    return filtered;
  };

  // Custom restaurant rendering with modal
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderRestaurantCard = (restaurant: RestaurantItem) => {
    // Format price level
    const priceDisplay =
      restaurant.price > 0 ? `€${restaurant.price.toFixed(0)}` : "";

    // Get currency symbol based on price level
    const getPriceLevelSymbol = (priceLevel?: number): string => {
      if (!priceLevel) return "";
      return "€".repeat(priceLevel);
    };

    return (
      <MenuItemCard
        key={restaurant.place_id}
        id={restaurant.place_id}
        title={restaurant.name}
        description={restaurant.vicinity || restaurant.formatted_address}
        imageUrl={restaurant.image_url || undefined}
        price={priceDisplay}
        tags={[
          ...(restaurant.rating ? [`⭐ ${restaurant.rating.toFixed(1)}`] : []),
          ...(restaurant.price_level
            ? [getPriceLevelSymbol(restaurant.price_level)]
            : []),
          ...(restaurant.opening_hours?.open_now !== undefined
            ? [restaurant.opening_hours.open_now ? "🟢 Open" : "🔴 Closed"]
            : []),
        ]}
        isAvailable={restaurant.is_active}
        isRecommended={restaurant.hotel_recommended}
        onClick={() => {
          setSelectedRestaurant(restaurant);
          setIsModalOpen(true);
        }}
      />
    );
  };

  return (
    <>
      <FilterableListPage
        searchPlaceholder="Search restaurants..."
        emptyStateConfig={{
          emoji: "🍽️",
          title: "No restaurants available",
          message:
            restaurants.length > 0
              ? "No restaurants found nearby. Try adjusting your search."
              : "Please check back later or contact the front desk",
        }}
        items={restaurants}
        isLoading={isLoading}
        categories={categories}
        transformToRecommendedItem={transformRestaurantToRecommendedItem}
        renderCard={renderRestaurantCard}
        filterItems={filterRestaurants}
      />

      {/* Restaurant Detail Modal */}
      {selectedRestaurant && (
        <RecommendedItemModal
          item={null}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRestaurant(null);
          }}
          restaurant={convertToModalFormat(selectedRestaurant)}
        />
      )}
    </>
  );
};
