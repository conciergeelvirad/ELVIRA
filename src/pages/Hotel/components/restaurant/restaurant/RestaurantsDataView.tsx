/**
 * Restaurants Data View Component
 *
 * Renders restaurants in table or grid view with pagination and action handlers.
 */

import React, { useMemo } from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import {
  getRestaurantTableColumns,
  restaurantGridColumns,
} from "./RestaurantColumns";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";
import { UtensilsCrossed, MapPin, Phone } from "lucide-react";

interface RestaurantsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (restaurant: Restaurant) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
  handleStatusToggle: (id: string, newStatus: boolean) => void;
}

/**
 * Restaurant Card Component for Grid View
 */
const RestaurantCard: React.FC<{
  restaurant: Restaurant;
  onClick: () => void;
  onEdit?: (restaurant: Restaurant) => void;
  onDelete?: (restaurant: Restaurant) => void;
}> = ({ restaurant, onClick, onEdit, onDelete }) => {
  const status = restaurant.is_active ? "Active" : "Inactive";

  // Build sections array
  const sections = [];

  if (restaurant.description) {
    sections.push({
      icon: <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />,
      content: <span className="line-clamp-2">{restaurant.description}</span>,
      className: "items-start",
    });
  }

  if (restaurant.cuisine) {
    sections.push({
      icon: <Phone className="w-4 h-4" />,
      content: restaurant.cuisine,
    });
  }

  return (
    <GenericCard
      icon={<UtensilsCrossed className="w-6 h-6 text-orange-600" />}
      iconBgColor="bg-orange-100"
      title={restaurant.name}
      subtitle={restaurant.cuisine || "N/A"}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(restaurant) : undefined}
          onDelete={onDelete ? () => onDelete(restaurant) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Restaurants data view with table and grid rendering
 */
export const RestaurantsDataView: React.FC<RestaurantsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
  handleStatusToggle,
}) => {
  const tableColumns = useMemo(
    () => getRestaurantTableColumns({ handleStatusToggle }),
    [handleStatusToggle]
  );

  return (
    <GenericDataView<Restaurant>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={tableColumns}
      gridColumns={restaurantGridColumns}
      getItemId={(restaurant) => restaurant.id}
      renderCard={(restaurant, onClick) => (
        <RestaurantCard
          restaurant={restaurant}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No restaurants found"
    />
  );
};
