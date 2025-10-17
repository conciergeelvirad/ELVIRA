/**
 * Restaurant Columns Configuration
 *
 * Defines column configurations for restaurant table/grid views and detail fields.
 */

import { UtensilsCrossed, MapPin, Clock, Phone } from "lucide-react";
import type { Column } from "../../../../../types/table";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";
import { StatusBadge } from "../../../../../components/common";

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
}

/**
 * Table columns for restaurants
 */
export const getRestaurantTableColumns = ({
  handleStatusToggle,
}: GetColumnsOptions): Column<Restaurant>[] => [
  {
    key: "name",
    header: "Restaurant Name",
    accessor: "name",
  },
  {
    key: "cuisine",
    header: "Cuisine",
    accessor: "cuisine",
  },
  {
    key: "description",
    header: "Location",
    accessor: (restaurant) => restaurant.description || "N/A",
  },
  {
    key: "created_at",
    header: "Contact",
    accessor: () => "N/A",
  },
  {
    key: "is_active",
    header: "Status",
    accessor: (restaurant) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          console.log("🖱️ RESTAURANT STATUS BADGE CLICKED:", {
            restaurantId: restaurant.id,
            currentStatus: restaurant.is_active,
            newStatus: !restaurant.is_active,
            restaurant: restaurant.name,
          });
          handleStatusToggle(restaurant.id, !restaurant.is_active);
        }}
        className="cursor-pointer"
      >
        <StatusBadge
          status={restaurant.is_active ? "active" : "inactive"}
          size="sm"
        />
      </div>
    ),
  },
];

/**
 * Grid columns for restaurants (card view)
 */
export const restaurantGridColumns = [
  { key: "restaurant_name", label: "Restaurant" },
  { key: "cuisine", label: "Cuisine" },
  { key: "location", label: "Location" },
  { key: "is_active", label: "Status" },
];

/**
 * Detail view fields for restaurant modal
 */
export const restaurantDetailFields = [
  {
    key: "name",
    label: "Restaurant Name",
    icon: UtensilsCrossed,
    accessor: (restaurant: Restaurant) => restaurant.name || "N/A",
  },
  {
    key: "cuisine",
    label: "Cuisine",
    icon: UtensilsCrossed,
    accessor: (restaurant: Restaurant) => restaurant.cuisine || "N/A",
  },
  {
    key: "description",
    label: "Description",
    icon: MapPin,
    accessor: (restaurant: Restaurant) => restaurant.description || "N/A",
  },
  {
    key: "contact_number",
    label: "Contact Number",
    icon: Phone,
    accessor: (restaurant: Restaurant) => restaurant.contact_number || "N/A",
  },
  {
    key: "description",
    label: "Description",
    accessor: (restaurant: Restaurant) => restaurant.description || "N/A",
  },
  {
    key: "is_active",
    label: "Status",
    accessor: (restaurant: Restaurant) => (
      <StatusBadge
        status={restaurant.is_active ? "active" : "inactive"}
        label={restaurant.is_active ? "Active" : "Inactive"}
      />
    ),
  },
  {
    key: "created_at",
    label: "Created",
    icon: Clock,
    accessor: (restaurant: Restaurant) => {
      if (!restaurant.created_at) return "N/A";
      return new Date(restaurant.created_at).toLocaleString();
    },
  },
];
