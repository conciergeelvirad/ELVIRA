// Shop components barrel export

// Product components
export { ProductsDataView } from "./products/ProductsDataView";
export { ProductDetail } from "./products/ProductDetail";
export {
  getTableColumns as getProductTableColumns,
  getGridColumns as getProductGridColumns,
  enhanceProduct,
  getDetailFields as getProductDetailFields,
} from "./products/ProductColumns";
export { PRODUCT_FORM_FIELDS } from "./products/ProductFormFields";

// Shop Order components
export { ShopOrdersDataView } from "./orders/ShopOrdersDataView";
export { ShopOrderDetail } from "./orders/ShopOrderDetail";
export {
  getTableColumns as getShopOrderTableColumns,
  getGridColumns as getShopOrderGridColumns,
  enhanceShopOrder,
  getDetailFields as getShopOrderDetailFields,
} from "./orders/ShopOrderColumns";
export { SHOP_ORDER_FORM_FIELDS } from "./orders/ShopOrderFormFields";

// Tab components
export { ProductsTab } from "./tabs/ProductsTab";
export { OrdersTab } from "./tabs/OrdersTab";
