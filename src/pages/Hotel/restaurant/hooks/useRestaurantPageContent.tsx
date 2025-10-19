import type { TabConfig } from "../../../../components/common/layout";
import { UtensilsCrossed, MenuIcon, Clock } from "lucide-react";
import {
  RestaurantsTab,
  MenuItemsTab,
  DineInOrdersTab,
  getRestaurantTableColumns,
  restaurantGridColumns,
} from "../components";
import type { useRestaurantCRUD } from "./useRestaurantCRUD";
import type { useMenuItemCRUD } from "./useMenuItemCRUD";
import type { useDineInOrderCRUD } from "./useDineInOrderCRUD";
import type { Restaurant } from "../../../../hooks/queries/hotel-management/restaurants";
import { useMemo } from "react";

interface UseRestaurantPageContentProps {
  restaurantsLoading: boolean;
  restaurantCRUD: ReturnType<typeof useRestaurantCRUD>;
  menuItemCRUD: ReturnType<typeof useMenuItemCRUD>;
  dineInOrderCRUD: ReturnType<typeof useDineInOrderCRUD>;
  safeHotelId: string;
  restaurants: Restaurant[];
}

/**
 * Custom hook for generating restaurant page tab content
 *
 * This hook encapsulates:
 * - Tab content generation with proper props
 * - Tab configuration array
 *
 * @param props - Loading states, CRUD handlers, and data
 * @returns Array of tab configurations ready for TabPage component
 */
export const useRestaurantPageContent = ({
  restaurantsLoading,
  restaurantCRUD,
  menuItemCRUD,
  dineInOrderCRUD,
  safeHotelId,
  restaurants,
}: UseRestaurantPageContentProps): TabConfig[] => {
  // Generate table columns with status toggle handler
  const restaurantTableColumns = useMemo(
    () =>
      getRestaurantTableColumns({
        handleStatusToggle: restaurantCRUD.handleStatusToggle,
      }),
    [restaurantCRUD.handleStatusToggle]
  );

  // Return tab configuration array directly without deep memoization
  // React is efficient enough to handle this, and memoizing CRUD objects causes infinite loops
  return [
    {
      id: "restaurants",
      label: "Restaurants",
      icon: UtensilsCrossed,
      content: (
        <RestaurantsTab
          isLoading={restaurantsLoading}
          crud={restaurantCRUD}
          tableColumns={restaurantTableColumns}
          gridColumns={restaurantGridColumns}
        />
      ),
    },
    {
      id: "menu-items",
      label: "Menu Items",
      icon: MenuIcon,
      content: (
        <MenuItemsTab hotelId={safeHotelId} menuItemCRUD={menuItemCRUD} />
      ),
    },
    {
      id: "dine-in-orders",
      label: "Dine-In Orders",
      icon: Clock,
      content: (
        <DineInOrdersTab
          hotelId={safeHotelId}
          restaurants={restaurants}
          dineInOrderCRUD={dineInOrderCRUD}
        />
      ),
    },
  ];
};
