/**
 * Services Page
 *
 * Hotel amenities and services - displays amenities in a compact mobile-friendly format
 * Features cart functionality for requesting services
 */

import { useMemo, useState } from "react";
import { FilterableListPage } from "../../components/FilterableListPage";
import { ServicesCartBottomSheet } from "../../components/cart";
import { useCart } from "../../../../contexts/CartContext";
import { useGuestHotelId } from "../../hooks";
import {
  useAmenities,
  getUniqueCategories,
  type Amenity,
} from "../../../../hooks/queries/hotel-management/amenities";
import type { RecommendedItem } from "../../../../hooks/queries";

export const ServicesPage = () => {
  const hotelId = useGuestHotelId();
  const { getTotalItemsByType } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch data
  const { data: amenities = [], isLoading } = useAmenities(hotelId);

  // Cart items count
  const cartItemCount = getTotalItemsByType("service");

  // Calculate filter options
  const categories = useMemo(() => getUniqueCategories(amenities), [amenities]);

  // Transform Amenity to RecommendedItem
  const transformAmenity = (amenity: Amenity): RecommendedItem => ({
    id: amenity.id,
    type: "amenity",
    title: amenity.name,
    description: amenity.description || undefined,
    price: amenity.price || 0,
    imageUrl: amenity.image_url || undefined,
    category: amenity.category,
  });

  return (
    <>
      <FilterableListPage
        searchPlaceholder="Search services..."
        emptyStateConfig={{
          emoji: "🏊",
          title: "No services available",
          message: "Please check back later or contact the front desk",
        }}
        items={amenities}
        isLoading={isLoading}
        categories={categories}
        transformToRecommendedItem={transformAmenity}
        showCart={true}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <ServicesCartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutSuccess={() => {
          // Optional: Show success message or refresh data
        }}
      />
    </>
  );
};
