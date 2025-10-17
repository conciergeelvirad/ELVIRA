/**
 * Products Module
 *
 * Centralized exports for product/shop inventory management functionality.
 */

// Type exports
export type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductUpdateData,
  ProductDeletionData,
} from "./product.types";

// Constants exports
export { productKeys, DEFAULT_HOTEL_ID } from "./product.constants";

// Transformer exports
export {
  // Filtering
  filterActiveProducts,
  filterProductsByCategory,
  filterMiniBarProducts,
  filterProductsByPriceRange,
  filterProductsInStock,
  filterLowStockProducts,
  searchProducts,

  // Sorting
  sortProductsByName,
  sortProductsByPrice,
  sortProductsByPriceDesc,
  sortProductsByStock,
  sortProductsByCategory,
  sortProductsByDate,

  // Grouping
  groupProductsByCategory,
  groupProductsByAvailability,
  groupProductsByMiniBar,

  // Data extraction
  getUniqueCategories,
  getAverageProductPrice,
  getProductPriceRange,
  getProductCountsByCategory,
  getTotalInventoryValue,
  getProductAvailabilityCounts,

  // Formatting
  formatProductPrice,
  formatStockStatus,
  formatProductSummary,
  getStockStatusColor,
  isProductAvailable,
} from "./product.transformers";

// Query hook exports
export {
  useProducts,
  useProductDetails,
  useProductCategories,
  useMiniBarProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./useProductQueries";
