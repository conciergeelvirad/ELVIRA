/**
 * MenuItemsTab Component
 *
 * Manages restaurant menu items with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 * - Recommended toggle functionality
 *
 * @refactored Uses shared EntityTab component with menu-item-specific configuration
 *
 * Enhanced with HotelEntityFilterPanel for filtering by:
 * - Category
 * - Price range
 * - Recommended status
 * - Active/inactive status
 * - Service types (breakfast, lunch, dinner)
 */

import React, { useState, useMemo } from "react";
import { useHotelStaff } from "../../../../../components/common";
import { EntityTab } from "../../../components/shared/entity";
import { MenuItemCard } from "../shared/MenuItemCard";
import { MenuItemDetail, MENU_ITEM_FORM_FIELDS } from "../index";
import { HotelEntityFilterPanel } from "../../../../../components/hotel/HotelEntityFilterPanel";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";
import type { useMenuItemCRUD } from "../../hooks/useMenuItemCRUD";
import { useRestaurants } from "../../../../../hooks/queries/hotel-management/restaurants/useRestaurantQueries";
import {
  getMenuItemTableColumns,
  menuItemGridColumns,
} from "../menu-items/MenuItemColumns";
import { getUniqueCategories } from "../../../../../hooks/queries/hotel-management/restaurants";

interface MenuItemsTabProps {
  hotelId: string;
  menuItemCRUD: ReturnType<typeof useMenuItemCRUD>;
}

/**
 * Menu Items Tab - Simplified using shared EntityTab with filter panel
 */
export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({
  hotelId,
  menuItemCRUD,
}) => {
  // Get hotel currency from context
  const { currency } = useHotelStaff();

  // Fetch restaurants for displaying restaurant names in the menu items table
  const { data: restaurants = [] } = useRestaurants(hotelId);

  // Generate table columns with dependencies
  const menuItemTableColumns = useMemo(
    () =>
      getMenuItemTableColumns({
        handleStatusToggle: menuItemCRUD.handleStatusToggle,
        restaurants,
        currency,
      }),
    [menuItemCRUD.handleStatusToggle, restaurants, currency]
  );

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "active",
    "inactive",
  ]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );

  // Get menu items from filteredData (after search has been applied)
  const searchFilteredMenuItems = useMemo(
    () =>
      (menuItemCRUD.searchAndFilter.filteredData as unknown as MenuItem[]) ||
      [],
    [menuItemCRUD.searchAndFilter.filteredData]
  );

  // Extract filter configuration from all menu items
  const categories = useMemo(() => {
    if (!searchFilteredMenuItems || searchFilteredMenuItems.length === 0)
      return [];
    return getUniqueCategories(searchFilteredMenuItems);
  }, [searchFilteredMenuItems]);

  const priceRange = useMemo(() => {
    if (!searchFilteredMenuItems || searchFilteredMenuItems.length === 0)
      return { min: 0, max: 1000 };
    const prices = searchFilteredMenuItems.map((item) => item.price || 0);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    };
  }, [searchFilteredMenuItems]);

  // Apply additional filters on top of search results
  const fullyFilteredMenuItems = useMemo(() => {
    return searchFilteredMenuItems.filter((menuItem) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(menuItem.category || "other")
      ) {
        return false;
      }

      // Price filter
      if ((menuItem.price || 0) > maxPrice) {
        return false;
      }

      // Recommended filter
      if (showRecommendedOnly && !menuItem.hotel_recommended) {
        return false;
      }

      // Status filter
      const isActive = menuItem.is_active;
      const statusString = isActive ? "active" : "inactive";
      if (!selectedStatuses.includes(statusString)) {
        return false;
      }

      // Service type filter
      if (selectedServiceTypes.length > 0) {
        const itemServiceTypes = Array.isArray(menuItem.service_type)
          ? menuItem.service_type
          : [];
        const hasMatchingServiceType = selectedServiceTypes.some((type) =>
          itemServiceTypes.includes(type)
        );
        if (!hasMatchingServiceType) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchFilteredMenuItems,
    selectedCategories,
    maxPrice,
    showRecommendedOnly,
    selectedStatuses,
    selectedServiceTypes,
  ]);

  // Create a modified crud object with the fully filtered data
  const modifiedCrud = useMemo(
    () => ({
      ...menuItemCRUD,
      searchAndFilter: {
        ...menuItemCRUD.searchAndFilter,
        filteredData: fullyFilteredMenuItems,
      },
    }),
    [menuItemCRUD, fullyFilteredMenuItems]
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

  const handleServiceTypeToggle = (serviceType: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(serviceType)
        ? prev.filter((t) => t !== serviceType)
        : [...prev, serviceType]
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setMaxPrice(priceRange.max);
    setShowRecommendedOnly(false);
    setSelectedStatuses(["active", "inactive"]);
    setSelectedServiceTypes([]);
  };

  return (
    <>
      {/* Entity Tab */}
      <EntityTab<MenuItem>
        isLoading={false}
        crud={modifiedCrud}
        tableColumns={menuItemTableColumns}
        gridColumns={menuItemGridColumns}
        entityName="Menu Item"
        searchPlaceholder="Search menu items..."
        addButtonLabel="Add Menu Item"
        emptyMessage="No menu items found"
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
            showServiceTypeFilter={true}
            selectedServiceTypes={selectedServiceTypes}
            onServiceTypeToggle={handleServiceTypeToggle}
            isOpen={isOpen}
            onToggle={onToggle}
            onReset={handleReset}
            resultCount={fullyFilteredMenuItems.length}
          />
        )}
        renderCard={(menuItem, onClick) => (
          <MenuItemCard
            menuItem={menuItem}
            onClick={onClick}
            onEdit={() => {
              const enhanced = { ...menuItem, hotel_id: hotelId };
              menuItemCRUD.modalActions.openEditModal(enhanced);
            }}
            onDelete={() => {
              const enhanced = { ...menuItem, hotel_id: hotelId };
              menuItemCRUD.modalActions.openDeleteModal(enhanced);
            }}
            onRecommendedToggle={(id, newValue) =>
              menuItemCRUD.handleRecommendedToggle(
                id,
                newValue,
                "hotel_recommended"
              )
            }
            currency={currency}
          />
        )}
        renderDetailContent={(item) => <MenuItemDetail menuItem={item} />}
        formFields={MENU_ITEM_FORM_FIELDS}
        currency={currency}
      />
    </>
  );
};
