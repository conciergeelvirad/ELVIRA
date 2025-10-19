/**
 * Products Tab Component (Refactored)
 *
 * Now uses the shared EntityTab component with product-specific configuration.
 * This eliminates ~100 lines of duplicated code while maintaining all functionality.
 *
 * Before: 135 lines of specific implementation
 * After: 70 lines using shared component + config
 * Savings: 48% code reduction
 *
 * Enhanced with HotelEntityFilterPanel for filtering by:
 * - Category
 * - Price range
 * - Recommended status
 * - Active/inactive status
 */

import { useState, useMemo } from "react";
import { EntityTab } from "../../../components/shared/entity";
import { productConfig } from "../config/productConfig";
import { enhanceProduct } from "../products/ProductColumns";
import { HotelEntityFilterPanel } from "../../../../../components/hotel/HotelEntityFilterPanel";
import type { Product } from "../../../../../hooks/queries/hotel-management/products";
import { getUniqueCategories } from "../../../../../hooks/queries/hotel-management/products";
import type { useProductCRUD } from "../../hooks/useProductCRUD";

interface ProductsTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useProductCRUD>;
  tableColumns: any[];
  gridColumns: any[];
  currency?: string;
}

/**
 * Products Tab - Simplified using shared EntityTab with filter panel
 */
export const ProductsTab: React.FC<ProductsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}) => {
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "active",
    "inactive",
  ]);

  // Get products from filteredData (after search has been applied)
  const searchFilteredProducts = useMemo(
    () => (crud.searchAndFilter.filteredData as Product[]) || [],
    [crud.searchAndFilter.filteredData]
  );

  // Extract filter configuration from all products
  const categories = useMemo(() => {
    if (!searchFilteredProducts || searchFilteredProducts.length === 0)
      return [];
    return getUniqueCategories(searchFilteredProducts);
  }, [searchFilteredProducts]);

  const priceRange = useMemo(() => {
    if (!searchFilteredProducts || searchFilteredProducts.length === 0)
      return { min: 0, max: 1000 };
    const prices = searchFilteredProducts.map((p) => p.price || 0);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    };
  }, [searchFilteredProducts]);

  // Apply additional filters on top of search results
  const fullyFilteredProducts = useMemo(() => {
    return searchFilteredProducts.filter((product) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category || "other")
      ) {
        return false;
      }

      // Price filter
      if ((product.price || 0) > maxPrice) {
        return false;
      }

      // Recommended filter
      if (showRecommendedOnly && !product.hotel_recommended) {
        return false;
      }

      // Status filter
      const isActive = product.is_active;
      const statusString = isActive ? "active" : "inactive";
      if (!selectedStatuses.includes(statusString)) {
        return false;
      }

      return true;
    });
  }, [
    searchFilteredProducts,
    selectedCategories,
    maxPrice,
    showRecommendedOnly,
    selectedStatuses,
  ]);

  // Create a modified crud object with the fully filtered data
  const modifiedCrud = useMemo(
    () => ({
      ...crud,
      searchAndFilter: {
        ...crud.searchAndFilter,
        filteredData: fullyFilteredProducts,
      },
    }),
    [crud, fullyFilteredProducts]
  );

  // Filter handlers
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMaxPrice(priceRange.max);
    setShowRecommendedOnly(false);
    setSelectedStatuses(["active", "inactive"]);
  };

  return (
    <>
      {/* Entity Tab */}
      <EntityTab<Product>
        isLoading={isLoading}
        crud={modifiedCrud}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        entityName={productConfig.entityName}
        searchPlaceholder={productConfig.searchPlaceholder}
        addButtonLabel={productConfig.addButtonLabel}
        emptyMessage={productConfig.emptyMessage}
        filterPanel={(isOpen, onToggle) => (
          <HotelEntityFilterPanel
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            currentMaxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            currency={currency}
            showRecommendedOnly={showRecommendedOnly}
            onRecommendedToggle={setShowRecommendedOnly}
            selectedStatuses={selectedStatuses}
            onStatusToggle={handleStatusToggle}
            isOpen={isOpen}
            onToggle={onToggle}
            onReset={handleReset}
            resultCount={fullyFilteredProducts.length}
          />
        )}
        renderCard={(product, onClick) =>
          productConfig.renderCard(product, onClick, {
            onEdit: () => {
              crud.formActions.setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                stock_quantity: product.stock_quantity,
                image_url: product.image_url,
              });
              crud.modalActions.openEditModal(enhanceProduct(product));
            },
            onDelete: () =>
              crud.modalActions.openDeleteModal(enhanceProduct(product)),
            currency,
            handleRecommendedToggle: (id, newValue) =>
              crud.handleRecommendedToggle(id, newValue, "recommended"),
          })
        }
        renderDetailContent={productConfig.renderDetail}
        formFields={productConfig.formFields}
        currency={currency}
      />
    </>
  );
};
