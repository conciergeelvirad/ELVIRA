/**
 * Shop Page
 *
 * Hotel merchandise and products - displays products in a compact mobile-friendly format
 */

import { useState } from "react";
import { FilterableListPage } from "../../components/FilterableListPage";
import { useGuestHotelId } from "../../hooks";
import {
  useProducts,
  type Product,
} from "../../../../hooks/queries/hotel-management/products";
import { useProductCategories } from "../../../../hooks/queries/hotel-management/products/useProductQueries";
import type { RecommendedItem } from "../../../../hooks/queries";
import { MenuItemCard } from "../../components/MenuItemCard";
import { useCart } from "../../../../contexts/CartContext";
import { ShopCartBottomSheet } from "../../components/cart";

export const ShopPage = () => {
  const hotelId = useGuestHotelId();
  const { getTotalItemsByType } = useCart();
  const cartItemCount = getTotalItemsByType("product");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch data
  const { data: products = [], isLoading } = useProducts(hotelId);
  const { data: categories = [] } = useProductCategories(hotelId);

  // Transform Product to RecommendedItem
  const transformProduct = (product: Product): RecommendedItem => ({
    id: product.id,
    type: "product",
    title: product.name,
    description: product.description || undefined,
    price: product.price,
    imageUrl: product.image_url || undefined,
    category: product.category,
  });

  // Custom card renderer
  const renderProductCard = (
    product: Product,
    onClick: (item: Product) => void
  ) => (
    <MenuItemCard
      key={product.id}
      id={product.id}
      title={product.name}
      description={product.description || undefined}
      imageUrl={product.image_url || undefined}
      price={`$${product.price.toFixed(2)}`}
      isAvailable={product.is_active && (product.stock_quantity || 0) > 0}
      isRecommended={product.hotel_recommended || false}
      onClick={() => onClick(product)}
      showCartButton={true}
      itemType="product"
      numericPrice={product.price}
      category={product.category}
    />
  );

  return (
    <>
      <FilterableListPage
        searchPlaceholder="Search products..."
        emptyStateConfig={{
          emoji: "🛍️",
          title: "No products available",
          message: "Please check back later or contact the front desk",
        }}
        items={products}
        isLoading={isLoading}
        categories={categories}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        showCart={true}
        transformToRecommendedItem={transformProduct}
        renderCard={renderProductCard}
      />

      <ShopCartBottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutSuccess={() => {
          // Optional: Show success toast or notification
        }}
      />
    </>
  );
};
