/**
 * Menu Item Columns Configuration
 *
 * Defines table columns, grid columns, and detail fields for menu items.
 */

import { Menu, Tag, DollarSign } from "lucide-react";
import { StatusBadge, ItemWithImage } from "../../../../../components/common";
import { Column } from "../../../../../types/table";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";

// Helper to get the primary badge from special_type array
const getPrimaryBadge = (item: MenuItem): string | undefined => {
  if (item.special_type && item.special_type.length > 0) {
    // Priority: Chef Special > Recommended > Dish of Day
    if (item.special_type.includes("Chef Special")) return "CHEF SPECIAL";
    if (item.special_type.includes("Recommended")) return "RECOMMENDED";
    if (item.special_type.includes("Dish of Day")) return "DISH OF DAY";
    return item.special_type[0]?.toUpperCase();
  }
  return undefined;
};

// Helper to get restaurant names from IDs
const getRestaurantNames = (
  restaurantIds: string[] | null,
  restaurants: Restaurant[]
): string => {
  if (!restaurantIds || restaurantIds.length === 0) {
    return "All Restaurants";
  }

  const names = restaurantIds
    .map((id) => {
      const restaurant = restaurants.find((r) => r.id === id);
      return restaurant?.name || null;
    })
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Unknown";
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  restaurants: Restaurant[];
  currency?: string;
}

// TABLE COLUMNS
export const getMenuItemTableColumns = ({
  handleStatusToggle,
  restaurants,
  currency = "$",
}: GetColumnsOptions): Column<MenuItem>[] => [
  {
    key: "item",
    header: "ITEM",
    accessor: (item) => (
      <ItemWithImage
        imageUrl={item.image_url}
        title={item.name}
        description={item.description}
        fallbackIcon={<Menu className="w-5 h-5" />}
        isRecommended={item.hotel_recommended || false}
        badge={getPrimaryBadge(item)}
      />
    ),
  },
  { key: "category", header: "CATEGORY", accessor: "category" },
  {
    key: "restaurants",
    header: "RESTAURANTS",
    accessor: (item) => (
      <div className="text-sm text-gray-700">
        {getRestaurantNames(item.restaurant_ids, restaurants)}
      </div>
    ),
  },
  {
    key: "price",
    header: "PRICE",
    accessor: (item) => `${currency}${item.price.toFixed(2)}`,
  },
  {
    key: "is_active",
    header: "STATUS",
    accessor: (item) => (
      <div
        onClick={(e) => {
          e.stopPropagation();
          console.log("🖱️ MENU ITEM STATUS BADGE CLICKED:", {
            itemId: item.id,
            currentStatus: item.is_active,
            newStatus: !item.is_active,
            item: item.name,
          });
          handleStatusToggle(item.id, !item.is_active);
        }}
        className="cursor-pointer"
      >
        <StatusBadge
          status={item.is_active ? "active" : "inactive"}
          size="sm"
        />
      </div>
    ),
  },
];

// GRID COLUMNS
export const menuItemGridColumns = [
  { key: "name", label: "Item" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
];

// DETAIL FIELDS
export const menuItemDetailFields = [
  {
    key: "name",
    label: "Item Name",
    icon: Menu,
    accessor: (item: MenuItem) => item.name,
  },
  {
    key: "category",
    label: "Category",
    icon: Tag,
    accessor: (item: MenuItem) => item.category,
  },
  {
    key: "price",
    label: "Price",
    icon: DollarSign,
    accessor: (item: MenuItem) => `$${item.price.toFixed(2)}`,
  },
  {
    key: "description",
    label: "Description",
    accessor: (item: MenuItem) => item.description || "N/A",
  },
  {
    key: "is_active",
    label: "Available",
    accessor: (item: MenuItem) => (
      <StatusBadge
        status={item.is_active ? "active" : "inactive"}
        label={item.is_active ? "Yes" : "No"}
      />
    ),
  },
];
