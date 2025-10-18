import React from "react";
import type { useRestaurantCRUD } from "../../../hooks/restaurant/useRestaurantCRUD";
import { EntityTab } from "../../shared";
import { restaurantEntityConfig } from "../config/restaurantConfig";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";

interface RestaurantsTabProps {
  isLoading: boolean;
  crud: ReturnType<typeof useRestaurantCRUD>;
  tableColumns: any;
  gridColumns: any;
}

/**
 * Restaurants Tab Component
 *
 * Displays and manages restaurants with:
 * - Search and filter functionality
 * - Grid/List view modes
 * - CRUD operations (create, edit, delete, view)
 *
 * @refactored Uses shared EntityTab component with restaurant-specific configuration
 */
export const RestaurantsTab: React.FC<RestaurantsTabProps> = ({
  isLoading,
  crud,
  tableColumns,
  gridColumns,
}) => {
  return (
    <>
      {/* Entity Tab */}
      <EntityTab<Restaurant>
        isLoading={isLoading}
        crud={crud}
        tableColumns={tableColumns}
        gridColumns={gridColumns}
        entityName={restaurantEntityConfig.entityName}
        searchPlaceholder={restaurantEntityConfig.searchPlaceholder}
        addButtonLabel={restaurantEntityConfig.addButtonLabel}
        emptyMessage={restaurantEntityConfig.emptyMessage}
        renderCard={(restaurant, onClick) =>
          restaurantEntityConfig.renderCard(restaurant, onClick, {
            onEdit: () => crud.modalActions.openEditModal(restaurant),
            onDelete: () => crud.modalActions.openDeleteModal(restaurant),
          })
        }
        renderDetailContent={restaurantEntityConfig.renderDetail}
        formFields={restaurantEntityConfig.formFields}
      />
    </>
  );
};
