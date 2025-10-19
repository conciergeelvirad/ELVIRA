/**
 * Amenities Tab Component (Refactored)
 *
 * Now uses the shared EntityTab component with amenity-specific configuration.
 * This eliminates ~100 lines of duplicated code while maintaining all functionality.
 *
 * Before: 130 lines of specific implementation
 * After: 40 lines using shared component + config
 * Savings: 76% code reduction
 *
 * Enhanced with HotelEntityFilterPanel for filtering by:
 * - Category
 * - Price range
 * - Recommended status
 * - Active/inactive status
 */

import { useState, useMemo } from "react";
import { EntityTab } from "../../../components/shared/entity";
import { amenityConfig } from "../config/amenityConfig";
import { enhanceAmenity } from "../amenities/AmenityColumns";
import { HotelEntityFilterPanel } from "../../../../../components/hotel/HotelEntityFilterPanel";
import type { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { getUniqueCategories } from "../../../../../hooks/queries/hotel-management/amenities";

interface AmenitiesTabProps {
  isLoading: boolean;
  crud: ReturnType<
    typeof import("../../../hooks/useAmenityCRUD").useAmenityCRUD
  >;
  tableColumns: any;
  gridColumns: any;
  currency?: string;
}

/**
 * Amenities Tab - Simplified using shared EntityTab with filter panel
 */
export const AmenitiesTab = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
  currency,
}: AmenitiesTabProps) => {
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "active",
    "inactive",
  ]);

  // Get amenities from filteredData (after search has been applied)
  const searchFilteredAmenities = useMemo(
    () => (crud.searchAndFilter.filteredData as Amenity[]) || [],
    [crud.searchAndFilter.filteredData]
  );

  // Extract filter configuration from all amenities
  const categories = useMemo(() => {
    if (!searchFilteredAmenities || searchFilteredAmenities.length === 0)
      return [];
    return getUniqueCategories(searchFilteredAmenities);
  }, [searchFilteredAmenities]);

  const priceRange = useMemo(() => {
    if (!searchFilteredAmenities || searchFilteredAmenities.length === 0)
      return { min: 0, max: 1000 };
    const prices = searchFilteredAmenities.map((a) => a.price || 0);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    };
  }, [searchFilteredAmenities]);

  // Apply additional filters on top of search results
  const fullyFilteredAmenities = useMemo(() => {
    return searchFilteredAmenities.filter((amenity) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(amenity.category || "other")
      ) {
        return false;
      }

      // Price filter
      if ((amenity.price || 0) > maxPrice) {
        return false;
      }

      // Recommended filter
      if (showRecommendedOnly && !amenity.hotel_recommended) {
        return false;
      }

      // Status filter
      const isActive = amenity.is_active;
      const statusString = isActive ? "active" : "inactive";
      if (!selectedStatuses.includes(statusString)) {
        return false;
      }

      return true;
    });
  }, [
    searchFilteredAmenities,
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
        filteredData: fullyFilteredAmenities,
      },
    }),
    [crud, fullyFilteredAmenities]
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
      <EntityTab<Amenity>
        isLoading={isLoading}
        crud={modifiedCrud}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        entityName={amenityConfig.entityName}
        searchPlaceholder={amenityConfig.searchPlaceholder}
        addButtonLabel={amenityConfig.addButtonLabel}
        emptyMessage={amenityConfig.emptyMessage}
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
            resultCount={fullyFilteredAmenities.length}
          />
        )}
        renderCard={(amenity, onClick) =>
          amenityConfig.renderCard(amenity, onClick, {
            onEdit: () => {
              crud.formActions.setFormData({
                name: amenity.name,
                description: amenity.description,
                category: amenity.category,
                price: amenity.price,
                recommended: amenity.recommended,
                is_active: amenity.is_active,
                image_url: amenity.image_url,
              });
              crud.modalActions.openEditModal(enhanceAmenity(amenity));
            },
            onDelete: () =>
              crud.modalActions.openDeleteModal(enhanceAmenity(amenity)),
            currency,
            handleRecommendedToggle: (id, newValue) =>
              crud.handleRecommendedToggle(id, newValue, "recommended"),
          })
        }
        renderDetailContent={amenityConfig.renderDetail}
        formFields={amenityConfig.formFields}
        currency={currency}
      />
    </>
  );
};
