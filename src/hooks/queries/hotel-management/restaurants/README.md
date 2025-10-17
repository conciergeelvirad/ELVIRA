# Restaurants Query Module

Comprehensive query hooks and utilities for managing restaurant, menu, and dine-in order data.

## Overview

This module provides React Query hooks for restaurant CRUD operations, menu item fetching, and dine-in order management. It includes utilities for filtering, sorting, grouping, and formatting restaurant and order data.

## Structure

```
restaurants/
├── restaurant.types.ts           # TypeScript type definitions
├── restaurant.constants.ts       # Query keys and constants
├── restaurant.transformers.ts    # Data transformation utilities (40+ functions)
├── useRestaurantQueries.ts       # React Query hooks
├── index.ts                      # Barrel exports
└── README.md                     # This file
```

## Type Definitions

### Core Types

- `Restaurant` - Base restaurant record
- `RestaurantInsert` - Data shape for creating restaurants
- `RestaurantUpdate` - Partial data shape for updates
- `MenuItem` - Menu item structure with all details
- `DineInOrder` - Base order record
- `DineInOrderWithDetails` - Order with items, guest, and restaurant relationships

### Helper Types

- `RestaurantCreateData` - Creation operation payload
- `RestaurantUpdateData` - Update operation payload
- `RestaurantDeletionData` - Deletion operation payload

## Query Hooks

### Restaurant Operations

#### `useRestaurants(hotelId: string)`

Fetches all restaurants for a hotel.

```typescript
const { data: restaurants, isLoading } = useRestaurants(hotelId);
```

#### `useRestaurantById(restaurantId?: string)`

Fetches a single restaurant by ID.

```typescript
const { data: restaurant } = useRestaurantById(restaurantId);
```

#### `useCreateRestaurant()`

Creates a new restaurant.

```typescript
const createRestaurant = useCreateRestaurant();

createRestaurant.mutate({
  data: {
    name: "Italian Kitchen",
    description: "Authentic Italian cuisine",
    cuisine: "Italian",
    food_types: ["Pizza", "Pasta"],
    is_active: true,
  },
  hotelId,
});
```

#### `useUpdateRestaurant()`

Updates an existing restaurant.

```typescript
const updateRestaurant = useUpdateRestaurant();

updateRestaurant.mutate({
  id: restaurantId,
  data: {
    name: "Updated Name",
    is_active: false,
  },
  hotelId,
});
```

#### `useDeleteRestaurant()`

Deletes a restaurant.

```typescript
const deleteRestaurant = useDeleteRestaurant();

deleteRestaurant.mutate({ id: restaurantId, hotelId });
```

### Menu & Orders

#### `useRestaurantMenuItems(restaurantId: string)`

Fetches menu items for a restaurant.

```typescript
const { data: menuItems } = useRestaurantMenuItems(restaurantId);
```

#### `useRestaurantDineInOrders(hotelId: string)`

Fetches dine-in orders with full relationships (items, guest, restaurant).

```typescript
const { data: orders } = useRestaurantDineInOrders(hotelId);
```

## Transformer Utilities

### Restaurant Transformers (5 functions)

**Filtering:**

- `filterActiveRestaurants(restaurants)` - Active only
- `searchRestaurants(restaurants, searchTerm)` - By name/description/cuisine
- `filterRestaurantsByCuisine(restaurants, cuisineType)` - By cuisine

**Sorting:**

- `sortRestaurantsByName(restaurants)` - Alphabetically
- `sortRestaurantsByDate(restaurants)` - Newest first

**Data Extraction:**

- `getUniqueCuisineTypes(restaurants)` - Unique cuisines
- `getRestaurantCounts(restaurants)` - Active/inactive counts

### Menu Item Transformers (11 functions)

**Filtering:**

- `filterAvailableMenuItems(items)` - Available only
- `filterMenuItemsByCategory(items, category)` - By category
- `searchMenuItems(items, searchTerm)` - By name/description
- `filterMenuItemsByServiceType(items, serviceType)` - By service type
- `filterMenuItemsBySpecialType(items, specialType)` - By special type

**Sorting:**

- `sortMenuItemsByName(items)` - Alphabetically
- `sortMenuItemsByPrice(items)` - Lowest first
- `sortMenuItemsByCategory(items)` - By category

**Grouping:**

- `groupMenuItemsByCategory(items)` - Groups by category
- `groupMenuItemsByAvailability(items)` - Available/unavailable

**Data Extraction:**

- `getUniqueCategories(items)` - Unique categories
- `getAverageMenuPrice(items)` - Average price
- `getMenuPriceRange(items)` - Min/max price

### Dine-In Order Transformers (10 functions)

**Filtering:**

- `filterOrdersByStatus(orders, status)` - By status
- `filterOrdersByRestaurant(orders, restaurantId)` - By restaurant
- `filterOrdersByGuest(orders, guestId)` - By guest
- `searchOrders(orders, searchTerm)` - By guest/restaurant name

**Sorting:**

- `sortOrdersByDate(orders)` - Newest first
- `sortOrdersByStatus(orders)` - By status order

**Grouping:**

- `groupOrdersByStatus(orders)` - Groups by status
- `groupOrdersByRestaurant(orders)` - Groups by restaurant

**Data Extraction:**

- `getOrderCountsByStatus(orders)` - Counts per status

**Formatting:**

- `formatPrice(price)` - Currency formatting
- `formatRestaurantSummary(restaurant)` - Summary string
- `formatOrderSummary(order)` - Order summary
- `getOrderStatusColor(status)` - Badge color

## Usage Examples

### Display Active Restaurants

```typescript
import {
  useRestaurants,
  filterActiveRestaurants,
  sortRestaurantsByName,
} from "@/hooks/queries/hotel-management/restaurants";

function RestaurantList({ hotelId }: { hotelId: string }) {
  const { data: restaurants = [] } = useRestaurants(hotelId);

  const activeRestaurants = useMemo(() => {
    const active = filterActiveRestaurants(restaurants);
    return sortRestaurantsByName(active);
  }, [restaurants]);

  return (
    <div>
      {activeRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
```

### Menu with Categories

```typescript
import {
  useRestaurantMenuItems,
  groupMenuItemsByCategory,
  filterAvailableMenuItems,
} from "@/hooks/queries/hotel-management/restaurants";

function RestaurantMenu({ restaurantId }: { restaurantId: string }) {
  const { data: menuItems = [] } = useRestaurantMenuItems(restaurantId);

  const categorizedMenu = useMemo(() => {
    const available = filterAvailableMenuItems(menuItems);
    return groupMenuItemsByCategory(available);
  }, [menuItems]);

  return (
    <div>
      {Object.entries(categorizedMenu).map(([category, items]) => (
        <section key={category}>
          <h3>{category}</h3>
          {items.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
}
```

### Order Dashboard

```typescript
import {
  useRestaurantDineInOrders,
  groupOrdersByStatus,
  getOrderCountsByStatus,
  formatOrderSummary,
} from "@/hooks/queries/hotel-management/restaurants";

function OrderDashboard({ hotelId }: { hotelId: string }) {
  const { data: orders = [] } = useRestaurantDineInOrders(hotelId);

  const groupedOrders = groupOrdersByStatus(orders);
  const statusCounts = getOrderCountsByStatus(orders);

  return (
    <div>
      <h2>Orders by Status</h2>
      {Object.entries(groupedOrders).map(([status, statusOrders]) => (
        <div key={status}>
          <h3>
            {status} ({statusCounts[status]})
          </h3>
          {statusOrders.map((order) => (
            <div key={order.id}>{formatOrderSummary(order)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Create Restaurant with Validation

```typescript
import {
  useCreateRestaurant,
  DEFAULT_HOTEL_ID,
} from "@/hooks/queries/hotel-management/restaurants";

function CreateRestaurantForm() {
  const createRestaurant = useCreateRestaurant();

  const handleSubmit = (formData: FormData) => {
    createRestaurant.mutate(
      {
        data: {
          name: formData.name,
          description: formData.description,
          cuisine: formData.cuisine,
          food_types: formData.foodTypes,
          is_active: true,
        },
        hotelId: DEFAULT_HOTEL_ID,
      },
      {
        onSuccess: () => {
          toast.success("Restaurant created successfully");
          closeModal();
        },
        onError: (error) => {
          toast.error("Failed to create restaurant");
        },
      }
    );
  };

  return <RestaurantForm onSubmit={handleSubmit} />;
}
```

## Database Schema

### `restaurants` table

- `id` (uuid, primary key)
- `hotel_id` (uuid, foreign key)
- `name` (text, required)
- `description` (text, nullable)
- `cuisine` (text)
- `food_types` (text[], nullable)
- `is_active` (boolean)
- `created_by` (uuid, foreign key)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `menu_items` table

- `id` (uuid, primary key)
- `hotel_id` (uuid, foreign key)
- `name` (text)
- `description` (text, nullable)
- `category` (text)
- `price` (numeric)
- `service_type` (text[], nullable)
- `special_type` (text[], nullable)
- `restaurant_ids` (uuid[])
- `is_available` (boolean)
- `image_url` (text, nullable)
- Timestamps and audit fields

### `dine_in_orders` table with relationships

The `useRestaurantDineInOrders` hook returns orders with:

- Order details (status, timestamps, etc.)
- Nested `items` array with menu item details
- `guest` object with guest information
- `restaurant` object with restaurant details

## Query Key Structure

```typescript
{
  all: ['restaurants'],
  lists: () => ['restaurants', 'list'],
  list: (filters) => ['restaurants', 'list', filters],
  details: () => ['restaurants', 'detail'],
  detail: (id) => ['restaurants', 'detail', id],
  menuItems: () => ['restaurants', 'menu-items'],
  menuItemsList: (restaurantId) => ['restaurants', 'menu-items', restaurantId],
  dineInOrders: () => ['restaurants', 'dine-in-orders'],
  dineInOrdersList: (hotelId) => ['restaurants', 'dine-in-orders', hotelId],
}
```

## Best Practices

1. **Use Transformers**: Keep business logic in transformers, not components
2. **Memoize Filtered Data**: Use `useMemo` for expensive operations
3. **Handle Loading States**: Always display loading indicators
4. **Type Safety**: Leverage TypeScript for all operations
5. **Cache Invalidation**: Mutations automatically invalidate relevant queries
6. **Menu Items**: Note that menu items use `restaurant_ids` array for multi-restaurant support

## Related Modules

- Components: `RestaurantTable`, `RestaurantMenuTable`, `DineInOrdersTable`
- Pages: `HotelRestaurantPage`
