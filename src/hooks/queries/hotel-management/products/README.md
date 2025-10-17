# Products Module

This module provides comprehensive React Query hooks and utilities for managing hotel shop products and inventory.

## Overview

The products module handles all product/inventory operations including:

- Product CRUD operations
- Category management
- Mini bar product handling
- Stock tracking and management
- Price management
- Inventory value calculations

## Structure

```
products/
├── product.types.ts        # TypeScript type definitions
├── product.constants.ts    # Query keys and constants
├── product.transformers.ts # Data transformation utilities
├── useProductQueries.ts    # React Query hooks
├── index.ts               # Public exports
└── README.md             # This file
```

## Types

### Core Types

- `Product` - Complete product record from database
- `ProductInsert` - Data required to create a new product
- `ProductUpdate` - Partial product data for updates

### Operation Types

- `ProductUpdateData` - Update operation with ID and updates
- `ProductDeletionData` - Deletion operation with ID

## Query Hooks

### Fetching Data

#### `useProducts(hotelId: string)`

Fetches all active products for a specific hotel.

```typescript
const { data: products, isLoading } = useProducts(hotelId);
```

#### `useProductDetails(id: string | undefined)`

Fetches a single product by ID.

```typescript
const { data: product } = useProductDetails(productId);
```

#### `useProductCategories(hotelId: string)`

Fetches unique product categories for a hotel.

```typescript
const { data: categories } = useProductCategories(hotelId);
```

#### `useMiniBarProducts(hotelId: string)`

Fetches only mini bar products for a hotel.

```typescript
const { data: miniBarProducts } = useMiniBarProducts(hotelId);
```

### Mutations

#### `useCreateProduct()`

Creates a new product.

```typescript
const createProduct = useCreateProduct();

await createProduct.mutateAsync({
  hotel_id: hotelId,
  name: "Coca Cola",
  category: "Beverages",
  price: 2.5,
  stock_quantity: 100,
  mini_bar: true,
  is_active: true,
});
```

#### `useUpdateProduct()`

Updates an existing product.

```typescript
const updateProduct = useUpdateProduct();

await updateProduct.mutateAsync({
  id: productId,
  updates: {
    name: "Coca Cola Zero",
    price: 2.75,
    stock_quantity: 80,
  },
});
```

#### `useDeleteProduct()`

Soft deletes a product (sets is_active to false).

```typescript
const deleteProduct = useDeleteProduct();

await deleteProduct.mutateAsync({ id: productId });
```

## Transformer Functions

### Filtering

- `filterActiveProducts(products)` - Get only active products
- `filterProductsByCategory(products, category)` - Filter by category
- `filterMiniBarProducts(products)` - Get mini bar products only
- `filterProductsByPriceRange(products, min, max)` - Filter by price range
- `filterProductsInStock(products)` - Get products with stock > 0
- `filterLowStockProducts(products, threshold?)` - Get low stock products
- `searchProducts(products, query)` - Search by name/category

### Sorting

- `sortProductsByName(products)` - Sort alphabetically
- `sortProductsByPrice(products)` - Sort by price ascending
- `sortProductsByPriceDesc(products)` - Sort by price descending
- `sortProductsByStock(products)` - Sort by stock quantity
- `sortProductsByCategory(products)` - Sort by category
- `sortProductsByDate(products)` - Sort by creation date

### Grouping

- `groupProductsByCategory(products)` - Group into categories
- `groupProductsByAvailability(products)` - Group by in stock/out of stock
- `groupProductsByMiniBar(products)` - Group by mini bar status

### Data Extraction

- `getUniqueCategories(products)` - Get unique category list
- `getAverageProductPrice(products)` - Calculate average price
- `getProductPriceRange(products)` - Get min/max prices
- `getProductCountsByCategory(products)` - Count products per category
- `getTotalInventoryValue(products)` - Calculate total inventory value
- `getProductAvailabilityCounts(products)` - Count in stock/out of stock

### Formatting

- `formatProductPrice(price)` - Format price with currency
- `formatStockStatus(quantity)` - Get stock status label
- `formatProductSummary(product)` - Create product summary string
- `getStockStatusColor(quantity, lowStockThreshold?)` - Get status color
- `isProductAvailable(product)` - Check if product is available

## Usage Examples

### Product Management Dashboard

```typescript
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  filterActiveProducts,
  sortProductsByName,
  groupProductsByCategory,
} from '@/hooks/queries/hotel-management/products';

function ProductManagement() {
  const { data: products } = useProducts(hotelId);
  const createProduct = useCreateProduct();

  // Get active products sorted by name
  const activeProducts = sortProductsByName(
    filterActiveProducts(products || [])
  );

  // Group by category for display
  const categorizedProducts = groupProductsByCategory(activeProducts);

  return (
    // Render products...
  );
}
```

### Mini Bar Inventory

```typescript
import {
  useMiniBarProducts,
  filterLowStockProducts,
  getTotalInventoryValue,
} from '@/hooks/queries/hotel-management/products';

function MiniBarInventory() {
  const { data: miniBarProducts } = useMiniBarProducts(hotelId);

  // Get low stock mini bar items
  const lowStockItems = filterLowStockProducts(miniBarProducts || [], 10);

  // Calculate total mini bar inventory value
  const inventoryValue = getTotalInventoryValue(miniBarProducts || []);

  return (
    // Render mini bar inventory...
  );
}
```

### Product Search and Filtering

```typescript
import {
  useProducts,
  searchProducts,
  filterProductsByPriceRange,
  sortProductsByPrice,
} from '@/hooks/queries/hotel-management/products';

function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const { data: products } = useProducts(hotelId);

  // Apply search and filters
  let filtered = searchProducts(products || [], searchQuery);
  filtered = filterProductsByPriceRange(
    filtered,
    priceRange.min,
    priceRange.max
  );
  filtered = sortProductsByPrice(filtered);

  return (
    // Render filtered products...
  );
}
```

### Inventory Analytics

```typescript
import {
  useProducts,
  getProductCountsByCategory,
  getAverageProductPrice,
  getProductAvailabilityCounts,
  filterLowStockProducts,
} from "@/hooks/queries/hotel-management/products";

function InventoryAnalytics() {
  const { data: products } = useProducts(hotelId);

  const categoryStats = getProductCountsByCategory(products || []);
  const avgPrice = getAverageProductPrice(products || []);
  const availCounts = getProductAvailabilityCounts(products || []);
  const lowStockItems = filterLowStockProducts(products || []);

  return (
    <div>
      <h3>Inventory Overview</h3>
      <p>Average Price: {formatProductPrice(avgPrice)}</p>
      <p>In Stock: {availCounts.inStock}</p>
      <p>Out of Stock: {availCounts.outOfStock}</p>
      <p>Low Stock Alerts: {lowStockItems.length}</p>

      <h4>Products by Category</h4>
      {Object.entries(categoryStats).map(([category, count]) => (
        <p key={category}>
          {category}: {count}
        </p>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Stock Management**: Always check stock levels before allowing purchases
2. **Price Formatting**: Use `formatProductPrice()` for consistent display
3. **Soft Delete**: Products are soft deleted (is_active = false), not permanently removed
4. **Mini Bar**: Use `useMiniBarProducts()` for mini bar specific operations
5. **Categories**: Keep category names consistent across products
6. **Low Stock Alerts**: Set appropriate threshold based on product demand
7. **Inventory Value**: Track regularly for financial reporting
8. **Search**: Combine search with filters for better UX

## Related Modules

- **shop-orders**: Uses products for order items
- **guests**: Products can be assigned to guest rooms (mini bar)

## Notes

- Products use soft delete pattern (is_active flag)
- Stock quantity should be updated when orders are created
- Mini bar products are typically assigned to guest rooms
- Price is stored as numeric value (not formatted string)
- Category filtering is case-sensitive
- Low stock threshold defaults to 10 units
