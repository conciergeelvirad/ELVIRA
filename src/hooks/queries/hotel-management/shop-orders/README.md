# Shop Orders Module

This module provides comprehensive React Query hooks and utilities for managing guest shop orders with line items.

## Overview

The shop-orders module handles all shop order operations including:

- Order CRUD operations with transaction-style creation
- Order items management with product relationships
- Order status tracking (pending, completed, cancelled)
- Guest order history
- Revenue analytics and reporting
- Most ordered products analysis

## Structure

```
shop-orders/
├── shop-order.types.ts        # TypeScript type definitions
├── shop-order.constants.ts    # Query keys and constants
├── shop-order.transformers.ts # Data transformation utilities
├── useShopOrderQueries.ts     # React Query hooks
├── index.ts                   # Public exports
└── README.md                  # This file
```

## Types

### Core Types

- `ShopOrder` - Complete shop order record from database
- `ShopOrderItem` - Individual order line item
- `ShopOrderInsert` - Data required to create a new order
- `ShopOrderItemInsert` - Data required to create an order item
- `ShopOrderUpdate` - Partial order data for updates

### Extended Types

- `ExtendedShopOrder` - Order with related items, products, and guest info

### Operation Types

- `ShopOrderCreationData` - Creation operation with order and items
- `ShopOrderUpdateData` - Update operation with ID, updates, and hotelId
- `ShopOrderStatusUpdateData` - Status update operation
- `ShopOrderDeletionData` - Deletion operation with ID and hotelId

## Query Hooks

### Fetching Data

#### `useShopOrders(hotelId: string)`

Fetches all shop orders for a specific hotel with related data.

```typescript
const { data: orders, isLoading } = useShopOrders(hotelId);
```

#### `useShopOrderById(orderId: string | undefined)`

Fetches a single shop order by ID with related data.

```typescript
const { data: order } = useShopOrderById(orderId);
```

### Mutations

#### `useCreateShopOrder()`

Creates a new shop order with items using transaction-style approach.

```typescript
const createOrder = useCreateShopOrder();

await createOrder.mutateAsync({
  order: {
    hotel_id: hotelId,
    guest_id: guestId,
    delivery_date: "2024-01-15",
    delivery_time: "14:00",
    total_price: 45.5,
    status: "pending",
  },
  items: [
    {
      product_id: productId1,
      quantity: 2,
      unit_price: 15.0,
      subtotal: 30.0,
    },
    {
      product_id: productId2,
      quantity: 1,
      unit_price: 15.5,
      subtotal: 15.5,
    },
  ],
});
```

#### `useUpdateShopOrder()`

Updates an existing shop order.

```typescript
const updateOrder = useUpdateShopOrder();

await updateOrder.mutateAsync({
  id: orderId,
  updates: {
    delivery_date: "2024-01-16",
    special_instructions: "Please deliver to room",
  },
  hotelId: hotelId,
});
```

#### `useUpdateShopOrderStatus()`

Updates shop order status (convenience hook).

```typescript
const updateStatus = useUpdateShopOrderStatus();

await updateStatus.mutateAsync({
  id: orderId,
  status: "completed",
  hotelId: hotelId,
});
```

#### `useDeleteShopOrder()`

Deletes a shop order (CASCADE deletes items automatically).

```typescript
const deleteOrder = useDeleteShopOrder();

await deleteOrder.mutateAsync({
  id: orderId,
  hotelId: hotelId,
});
```

## Transformer Functions

### Filtering

- `filterOrdersByStatus(orders, status)` - Filter by status
- `filterOrdersByGuest(orders, guestId)` - Filter by guest
- `filterOrdersByRoom(orders, roomNumber)` - Filter by room
- `filterOrdersByDateRange(orders, startDate, endDate)` - Filter by date range
- `filterOrdersByMinAmount(orders, minAmount)` - Filter by minimum price
- `filterPendingOrders(orders)` - Get pending orders only
- `filterCompletedOrders(orders)` - Get completed orders only
- `filterCancelledOrders(orders)` - Get cancelled orders only
- `searchOrders(orders, query)` - Search by guest name/room

### Sorting

- `sortOrdersByDateDesc(orders)` - Sort by date (newest first)
- `sortOrdersByDateAsc(orders)` - Sort by date (oldest first)
- `sortOrdersByAmountDesc(orders)` - Sort by price (highest first)
- `sortOrdersByAmountAsc(orders)` - Sort by price (lowest first)
- `sortOrdersByGuestName(orders)` - Sort by guest name
- `sortOrdersByRoom(orders)` - Sort by room number
- `sortOrdersByStatus(orders)` - Sort by status (pending → completed → cancelled)

### Grouping

- `groupOrdersByStatus(orders)` - Group by status
- `groupOrdersByGuest(orders)` - Group by guest ID
- `groupOrdersByDate(orders)` - Group by date (YYYY-MM-DD)

### Data Extraction

- `getTotalRevenue(orders)` - Calculate total revenue
- `getTotalItemCount(orders)` - Get total items across all orders
- `getOrderCountsByStatus(orders)` - Count orders per status
- `getAverageOrderValue(orders)` - Calculate average order value
- `getRevenueByStatus(orders)` - Get revenue breakdown by status
- `getMostOrderedProducts(orders, limit?)` - Get top products by quantity
- `getUniqueGuestIds(orders)` - Get unique guest IDs
- `getOrderStatistics(orders)` - Get comprehensive order statistics

### Formatting

- `formatOrderAmount(amount)` - Format price with currency
- `formatOrderDate(dateString)` - Format order date
- `formatOrderStatus(status)` - Format status for display
- `getOrderStatusColor(status)` - Get status color for UI
- `formatGuestName(order)` - Format guest name from order
- `formatOrderSummary(order)` - Create order summary string
- `formatOrderItems(order)` - Format items list

## Usage Examples

### Order Management Dashboard

```typescript
import {
  useShopOrders,
  filterOrdersByStatus,
  sortOrdersByDateDesc,
  getOrderStatistics,
} from "@/hooks/queries/hotel-management/shop-orders";

function OrderDashboard() {
  const { data: orders } = useShopOrders(hotelId);

  const pendingOrders = filterOrdersByStatus(orders || [], "pending");
  const recentOrders = sortOrdersByDateDesc(orders || []);
  const stats = getOrderStatistics(orders || []);

  return (
    <div>
      <h3>Order Statistics</h3>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Total Revenue: ${stats.totalRevenue.toFixed(2)}</p>
      <p>Average Order Value: ${stats.averageOrderValue.toFixed(2)}</p>
      <p>Pending: {stats.pendingOrders}</p>
      <p>Completed: {stats.completedOrders}</p>
    </div>
  );
}
```

### Creating Orders

```typescript
import {
  useCreateShopOrder,
  type ShopOrderCreationData,
} from "@/hooks/queries/hotel-management/shop-orders";

function CreateOrderForm() {
  const createOrder = useCreateShopOrder();

  const handleSubmit = async (formData) => {
    const orderData: ShopOrderCreationData = {
      order: {
        hotel_id: hotelId,
        guest_id: formData.guestId,
        delivery_date: formData.deliveryDate,
        total_price: calculateTotal(formData.items),
        status: "pending",
      },
      items: formData.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.quantity * item.price,
      })),
    };

    await createOrder.mutateAsync(orderData);
  };

  // Form rendering...
}
```

### Order Status Management

```typescript
import {
  useShopOrders,
  useUpdateShopOrderStatus,
  filterPendingOrders,
} from '@/hooks/queries/hotel-management/shop-orders';

function PendingOrdersList() {
  const { data: orders } = useShopOrders(hotelId);
  const updateStatus = useUpdateShopOrderStatus();

  const pendingOrders = filterPendingOrders(orders || []);

  const handleComplete = async (orderId: string) => {
    await updateStatus.mutateAsync({
      id: orderId,
      status: 'completed',
      hotelId: hotelId,
    });
  };

  return (
    // Render pending orders with complete button...
  );
}
```

### Revenue Analytics

```typescript
import {
  useShopOrders,
  getTotalRevenue,
  getRevenueByStatus,
  getMostOrderedProducts,
  filterOrdersByDateRange,
} from "@/hooks/queries/hotel-management/shop-orders";

function RevenueReport() {
  const { data: orders } = useShopOrders(hotelId);

  // Get this month's orders
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthOrders = filterOrdersByDateRange(
    orders || [],
    startOfMonth,
    new Date()
  );

  const monthRevenue = getTotalRevenue(monthOrders);
  const revenueByStatus = getRevenueByStatus(monthOrders);
  const topProducts = getMostOrderedProducts(monthOrders, 5);

  return (
    <div>
      <h3>Monthly Revenue: ${monthRevenue.toFixed(2)}</h3>

      <h4>Revenue by Status</h4>
      <p>Pending: ${revenueByStatus.pending?.toFixed(2) || 0}</p>
      <p>Completed: ${revenueByStatus.completed?.toFixed(2) || 0}</p>

      <h4>Top 5 Products</h4>
      {topProducts.map((product) => (
        <p key={product.productId}>
          {product.productName}: {product.quantity} units
        </p>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Transaction Creation**: Orders are created with transaction-style approach (rollback on error)
2. **Status Tracking**: Use status updates to track order lifecycle
3. **CASCADE Delete**: Order items are automatically deleted when order is deleted
4. **Price Calculation**: Always calculate total_price as sum of all item subtotals
5. **Guest Association**: Orders must be associated with a guest
6. **Date Handling**: Use delivery_date for scheduling deliveries
7. **Analytics**: Use transformer functions for reporting and analytics
8. **Status Colors**: Use `getOrderStatusColor()` for consistent UI

## Related Modules

- **products**: Shop orders reference products through order items
- **guests**: Orders are associated with specific guests

## Notes

- Orders use CASCADE delete for items (items deleted automatically)
- total_price field stores the order total (not total_amount)
- Status values: 'pending', 'completed', 'cancelled'
- created_at can be null in database (handle appropriately)
- Order creation uses transaction-style: create order → create items → rollback on error
- Items reference products by product_id
