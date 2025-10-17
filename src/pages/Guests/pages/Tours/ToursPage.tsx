/**
 * Tours Page
 *
 * Tours and activities from Amadeus API - displays tours in a compact mobile-friendly format
 * Uses the same FilterableListPage pattern as Services and Shop pages
 */

import { useMemo, useState } from "react";
import { FilterableListPage } from "../../components/FilterableListPage";
import { MenuItemCard } from "../../components/MenuItemCard";
import { RecommendedItemModal } from "../Home/components/RecommendedSection/RecommendedItemModal";
import { useGuestHotelId } from "../../hooks";
import { useAmadeusTours } from "./hooks/useAmadeusTours";
import type { FilterOptions } from "../../components/common/FilterModal/types";
import type { AmadeusActivity as AmadeusActivityService } from "../../../../services/amadeusActivities.service";
import type { AmadeusActivity as AmadeusActivityModal } from "../../../../services/amadeus/types";
import type { RecommendedItem } from "../../../../hooks/queries";
import type { FilterableItem } from "../../components/FilterableListPage/FilterableListPage";

/**
 * Extend AmadeusActivity to match FilterableItem interface
 */
interface TourItem extends FilterableItem {
  // Original Amadeus fields (stored separately from FilterableItem fields)
  originalPrice?: { amount: string; currencyCode: string };
  type: string;
  shortDescription?: string;
  geoCode: { latitude: number; longitude: number };
  rating?: number;
  pictures?: string[];
  bookingLink?: string;
  minimumDuration?: string;
}

/**
 * Convert Amadeus service format to FilterableItem format
 */
const transformAmadeusToFilterable = (
  tour: AmadeusActivityService
): TourItem => ({
  id: tour.id,
  name: tour.name,
  description: tour.description || tour.shortDescription || null,
  price: tour.price ? parseFloat(tour.price.amount) : 0, // Convert to number for FilterableItem
  image_url: tour.pictures?.[0] || null,
  category: tour.type || "Tour",
  is_active: true,
  hotel_recommended: false,
  // Keep original Amadeus fields
  originalPrice: tour.price, // Keep original for currency code
  type: tour.type,
  shortDescription: tour.shortDescription,
  geoCode: tour.geoCode,
  rating: tour.rating,
  pictures: tour.pictures,
  bookingLink: tour.bookingLink,
  minimumDuration: tour.minimumDuration,
});

/**
 * Convert service format to modal format for display
 */
const convertToModalFormat = (tour: TourItem): AmadeusActivityModal => ({
  id: tour.id,
  name: tour.name,
  shortDescription: tour.shortDescription,
  geoCode: tour.geoCode,
  rating: tour.rating,
  bookingLink: tour.bookingLink,
  pictures: tour.pictures,
  price: tour.originalPrice
    ? {
        amount: parseFloat(tour.originalPrice.amount),
        currency: tour.originalPrice.currencyCode,
      }
    : { amount: tour.price, currency: "EUR" },
  business_hours: undefined,
  category: tour.category,
  tags: [],
});

export const ToursPage = () => {
  const hotelId = useGuestHotelId();

  // Fetch tours from Amadeus API
  const {
    tours: amadeousTours,
    isLoading,
    approvedCount,
  } = useAmadeusTours({
    hotelId,
    radius: 15, // 15km radius
  });

  // Transform Amadeus tours to FilterableItem format
  const tours: TourItem[] = useMemo(
    () => amadeousTours.map(transformAmadeusToFilterable),
    [amadeousTours]
  );

  // Extract unique categories from tours
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tours.map((t) => t.category)));
    return cats.length > 0 ? cats : ["Tour"];
  }, [tours]);

  // Transform TourItem to RecommendedItem for modal
  const transformTourToRecommendedItem = (tour: TourItem): RecommendedItem => ({
    id: tour.id,
    type: "amenity", // Use "amenity" as fallback since "tour" is not in the union type
    title: tour.name,
    description: tour.description || tour.shortDescription || "",
    price: tour.price,
    imageUrl: tour.image_url || undefined,
    category: tour.category,
  });

  // Custom filter for tours - don't filter by price if tour price is 0 (many tours don't have price info)
  const filterTours = (
    itemsToFilter: TourItem[],
    currentFilters: FilterOptions,
    query: string
  ): TourItem[] => {
    let filtered = [...itemsToFilter];

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(query.toLowerCase()) ||
          tour.description?.toLowerCase().includes(query.toLowerCase()) ||
          tour.shortDescription?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (currentFilters.selectedCategories.length > 0) {
      filtered = filtered.filter((tour) =>
        currentFilters.selectedCategories.includes(tour.category)
      );
    }

    // Price range filter - only filter tours that have a price > 0
    filtered = filtered.filter((tour) => {
      // If tour has no price (0), don't filter it out
      if (tour.price === 0) return true;

      // Otherwise, apply price range filter
      return (
        tour.price >= currentFilters.priceRange.min &&
        tour.price <= currentFilters.priceRange.max
      );
    });

    // Recommended filter
    if (currentFilters.showOnlyRecommended) {
      filtered = filtered.filter((tour) => tour.hotel_recommended);
    }

    return filtered;
  };

  // Custom tour rendering with modal
  const [selectedTour, setSelectedTour] = useState<TourItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderTourCard = (
    tour: TourItem,
    _onClick?: (item: TourItem) => void
  ) => {
    // Format duration if available
    const duration = tour.minimumDuration
      ? formatDuration(tour.minimumDuration)
      : undefined;

    // Get currency symbol
    const currency = tour.originalPrice?.currencyCode || "EUR";
    const currencySymbol = currency === "USD" ? "$" : "€";

    return (
      <MenuItemCard
        key={tour.id}
        id={tour.id}
        title={tour.name}
        description={tour.description || tour.shortDescription || undefined}
        imageUrl={tour.image_url || undefined}
        price={
          tour.price > 0 ? `${currencySymbol}${tour.price.toFixed(2)}` : ""
        }
        tags={[
          ...(tour.rating ? [`⭐ ${tour.rating.toFixed(1)}`] : []),
          ...(duration ? [duration] : []),
        ]}
        isAvailable={true}
        isRecommended={false}
        onClick={() => {
          setSelectedTour(tour);
          setIsModalOpen(true);
        }}
      />
    );
  };

  return (
    <>
      <FilterableListPage
        searchPlaceholder="Search tours..."
        emptyStateConfig={{
          emoji: "🗺️",
          title: "No tours available",
          message:
            approvedCount > 0
              ? "No tours found nearby. Try adjusting your search."
              : "Please check back later or contact the front desk",
        }}
        items={tours}
        isLoading={isLoading}
        categories={categories}
        transformToRecommendedItem={transformTourToRecommendedItem}
        renderCard={renderTourCard}
        filterItems={filterTours}
      />

      {/* Tour Detail Modal */}
      {selectedTour && (
        <RecommendedItemModal
          item={null}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTour(null);
          }}
          tour={convertToModalFormat(selectedTour)}
        />
      )}
    </>
  );
};

/**
 * Format ISO 8601 duration to readable format
 * PT2H30M -> "2h 30min"
 */
const formatDuration = (duration: string): string => {
  const hourMatch = duration.match(/(\d+)H/);
  const minMatch = duration.match(/(\d+)M/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const mins = minMatch ? parseInt(minMatch[1]) : 0;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}min`);

  return parts.length > 0 ? parts.join(" ") : duration;
};
