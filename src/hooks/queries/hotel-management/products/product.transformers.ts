/**
 * Product Transformer Utilities
 *
 * Utility functions for transforming, filtering, sorting, and formatting product data.
 */

import type { Product } from "./product.types";

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filters active products
 */
export const filterActiveProducts = (products: Product[]): Product[] => {
  return products.filter((product) => product.is_active);
};

/**
 * Filters products by category
 */
export const filterProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  return products.filter((product) => product.category === category);
};

/**
 * Filters mini bar products
 */
export const filterMiniBarProducts = (products: Product[]): Product[] => {
  return products.filter((product) => product.mini_bar);
};

/**
 * Filters products by price range
 */
export const filterProductsByPriceRange = (
  products: Product[],
  minPrice: number,
  maxPrice: number
): Product[] => {
  return products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
};

/**
 * Filters products with stock available
 */
export const filterProductsInStock = (products: Product[]): Product[] => {
  return products.filter((product) => (product.stock_quantity || 0) > 0);
};

/**
 * Filters products with low stock (below threshold)
 */
export const filterLowStockProducts = (
  products: Product[],
  threshold: number = 10
): Product[] => {
  return products.filter(
    (product) =>
      product.stock_quantity !== null &&
      product.stock_quantity > 0 &&
      product.stock_quantity <= threshold
  );
};

/**
 * Searches products by name or description
 */
export const searchProducts = (
  products: Product[],
  searchTerm: string
): Product[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return products;

  return products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    return (
      name.includes(term) ||
      description.includes(term) ||
      category.includes(term)
    );
  });
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sorts products by name (alphabetically)
 */
export const sortProductsByName = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Sorts products by price (lowest first)
 */
export const sortProductsByPrice = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.price - b.price);
};

/**
 * Sorts products by price (highest first)
 */
export const sortProductsByPriceDesc = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => b.price - a.price);
};

/**
 * Sorts products by stock quantity (lowest first)
 */
export const sortProductsByStock = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const stockA = a.stock_quantity || 0;
    const stockB = b.stock_quantity || 0;
    return stockA - stockB;
  });
};

/**
 * Sorts products by category
 */
export const sortProductsByCategory = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.category.localeCompare(b.category));
};

/**
 * Sorts products by creation date (newest first)
 */
export const sortProductsByDate = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
};

// ============================================================================
// Grouping Utilities
// ============================================================================

/**
 * Groups products by category
 */
export const groupProductsByCategory = (
  products: Product[]
): Record<string, Product[]> => {
  return products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
};

/**
 * Groups products by availability
 */
export const groupProductsByAvailability = (
  products: Product[]
): { available: Product[]; unavailable: Product[] } => {
  return products.reduce(
    (acc, product) => {
      if (product.is_active && (product.stock_quantity || 0) > 0) {
        acc.available.push(product);
      } else {
        acc.unavailable.push(product);
      }
      return acc;
    },
    { available: [], unavailable: [] } as {
      available: Product[];
      unavailable: Product[];
    }
  );
};

/**
 * Groups products by mini bar status
 */
export const groupProductsByMiniBar = (
  products: Product[]
): { miniBar: Product[]; regular: Product[] } => {
  return products.reduce(
    (acc, product) => {
      if (product.mini_bar) {
        acc.miniBar.push(product);
      } else {
        acc.regular.push(product);
      }
      return acc;
    },
    { miniBar: [], regular: [] } as { miniBar: Product[]; regular: Product[] }
  );
};

// ============================================================================
// Data Extraction Utilities
// ============================================================================

/**
 * Gets unique product categories
 */
export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories).sort();
};

/**
 * Calculates average product price
 */
export const getAverageProductPrice = (products: Product[]): number => {
  if (products.length === 0) return 0;
  const total = products.reduce((sum, product) => sum + product.price, 0);
  return Math.round((total / products.length) * 100) / 100;
};

/**
 * Gets price range of products
 */
export const getProductPriceRange = (
  products: Product[]
): { min: number; max: number } => {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

/**
 * Gets product counts by category
 */
export const getProductCountsByCategory = (
  products: Product[]
): Record<string, number> => {
  return products.reduce((acc, product) => {
    const category = product.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Gets total inventory value
 */
export const getTotalInventoryValue = (products: Product[]): number => {
  return products.reduce((sum, product) => {
    const stock = product.stock_quantity || 0;
    return sum + product.price * stock;
  }, 0);
};

/**
 * Gets products count by availability
 */
export const getProductAvailabilityCounts = (
  products: Product[]
): {
  active: number;
  inactive: number;
  inStock: number;
  outOfStock: number;
} => {
  return products.reduce(
    (acc, product) => {
      if (product.is_active) acc.active++;
      else acc.inactive++;

      if ((product.stock_quantity || 0) > 0) acc.inStock++;
      else acc.outOfStock++;

      return acc;
    },
    { active: 0, inactive: 0, inStock: 0, outOfStock: 0 }
  );
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Formats price for display
 */
export const formatProductPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Formats stock status
 */
export const formatStockStatus = (stockQuantity: number | null): string => {
  if (stockQuantity === null) return "N/A";
  if (stockQuantity === 0) return "Out of Stock";
  if (stockQuantity <= 10) return `Low Stock (${stockQuantity})`;
  return `In Stock (${stockQuantity})`;
};

/**
 * Formats product summary
 */
export const formatProductSummary = (product: Product): string => {
  const price = formatProductPrice(product.price);
  const stock = formatStockStatus(product.stock_quantity);
  return `${product.name} - ${price} (${stock})`;
};

/**
 * Gets stock status color
 */
export const getStockStatusColor = (stockQuantity: number | null): string => {
  if (stockQuantity === null) return "gray";
  if (stockQuantity === 0) return "red";
  if (stockQuantity <= 10) return "yellow";
  return "green";
};

/**
 * Checks if product is available for purchase
 */
export const isProductAvailable = (product: Product): boolean => {
  return product.is_active && (product.stock_quantity || 0) > 0;
};
