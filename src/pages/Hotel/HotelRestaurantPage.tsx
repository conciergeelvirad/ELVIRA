import { TabPage, LoadingState, EmptyState } from "../../components/common";
import { useRestaurantPageData } from "./hooks/restaurant/useRestaurantPageData";
import { useRestaurantPageContent } from "./hooks/restaurant/useRestaurantPageContent";
import {
  useRestaurantCRUD,
  useMenuItemCRUD,
  useDineInOrderCRUD,
} from "./hooks/restaurant";
import { RESTAURANT_FORM_FIELDS } from "./components/restaurant/restaurant/RestaurantFormFields";
import { MENU_ITEM_FORM_FIELDS } from "./components/restaurant/menu-items/MenuItemFormFields";
import { DINE_IN_ORDER_FORM_FIELDS } from "./components/restaurant/dine-in-orders/DineInOrderComponents";

export const HotelRestaurantPage = () => {
  const {
    hotelId,
    hotelStaff,
    staffError,
    safeHotelId,
    restaurants,
    menuItems,
    dineInOrders,
    restaurantsLoading,
    menuItemsLoading,
    ordersLoading,
  } = useRestaurantPageData();

  const restaurantCRUD = useRestaurantCRUD({
    initialRestaurants: restaurants,
    formFields: RESTAURANT_FORM_FIELDS,
  });

  const menuItemCRUD = useMenuItemCRUD({
    initialMenuItems: menuItems,
    formFields: MENU_ITEM_FORM_FIELDS,
  });

  const dineInOrderCRUD = useDineInOrderCRUD({
    initialOrders: dineInOrders,
    formFields: DINE_IN_ORDER_FORM_FIELDS,
    hotelId: hotelId || "",
  });

  // Call hooks before any conditional returns
  const tabs = useRestaurantPageContent({
    restaurantsLoading,
    restaurantCRUD,
    menuItemCRUD,
    dineInOrderCRUD,
    safeHotelId,
    restaurants,
  });

  if (restaurantsLoading || menuItemsLoading || ordersLoading) {
    return <LoadingState message="Loading restaurant data..." />;
  }

  if (staffError || !hotelId || !hotelStaff) {
    return <EmptyState message="Unable to load staff data" />;
  }

  return (
    <TabPage
      title="Restaurant Management"
      tabs={tabs}
      defaultTab="restaurants"
    />
  );
};
