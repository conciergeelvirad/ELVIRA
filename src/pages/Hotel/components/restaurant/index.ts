// Restaurant components barrel export

// Restaurant components
export { RestaurantsDataView } from "./restaurant/RestaurantsDataView";
export { RestaurantDetail } from "./restaurant/RestaurantDetail";
export { RESTAURANT_FORM_FIELDS } from "./restaurant/RestaurantFormFields";
export {
  getRestaurantTableColumns,
  restaurantGridColumns,
  restaurantDetailFields,
} from "./restaurant/RestaurantColumns";

// Menu Item components
export { MenuItemsDataView } from "./menu-items/MenuItemsDataView";
export { MenuItemDetail } from "./menu-items/MenuItemDetail";
export { MENU_ITEM_FORM_FIELDS } from "./menu-items/MenuItemFormFields";
export {
  getMenuItemTableColumns,
  menuItemGridColumns,
  menuItemDetailFields,
} from "./menu-items/MenuItemColumns";

// Dine-In Order components
export {
  DineInOrdersDataView,
  DineInOrderDetail,
} from "./dine-in-orders/DineInOrderComponents";
export {
  DINE_IN_ORDER_FORM_FIELDS,
  DINE_IN_ORDER_EDIT_FORM_FIELDS,
} from "./dine-in-orders/DineInOrderComponents";

// Tab components
export { RestaurantsTab } from "./tabs/RestaurantsTab";
export { MenuItemsTab } from "./tabs/MenuItemsTab";
export { DineInOrdersTab } from "./tabs/DineInOrdersTab";
