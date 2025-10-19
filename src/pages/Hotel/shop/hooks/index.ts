/**
 * Shop Hooks Module
 *
 * Centralized exports for all shop-related hooks:
 * - CRUD operations for products and shop orders
 * - Page data fetching and subscriptions
 * - Page content generation
 */

export { useProductCRUD } from "./useProductCRUD";
export type { EnhancedProduct } from "./useProductCRUD";

export { useShopOrderCRUD } from "./useShopOrderCRUD";
export type { EnhancedShopOrder } from "./useShopOrderCRUD";

export { useShopPageData } from "./useShopPageData";
export { useShopPageContent } from "./useShopPageContent";
