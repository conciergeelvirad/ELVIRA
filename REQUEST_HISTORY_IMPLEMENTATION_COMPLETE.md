# Request History Implementation - Complete ✅

**Date:** October 15, 2025  
**Status:** ✅ COMPLETE - Fully functional with database integration

---

## 📋 Overview

Complete implementation of the Request History feature for guest orders. Displays all shop orders, dine-in orders (restaurant bookings & room service), and amenity requests with full CRUD operations.

---

## 🎯 Features Implemented

### Core Features

- ✅ **Unified Order Display** - Shows all order types in one view
- ✅ **Grouped by Date** - Orders organized chronologically
- ✅ **Expandable Details** - Click to see order items and details
- ✅ **Status Badges** - Color-coded status indicators
- ✅ **Cancel Functionality** - Cancel pending orders only
- ✅ **Restaurant Names** - Shows restaurant name for bookings
- ✅ **Compact Design** - Reduced padding, smaller text, efficient use of space
- ✅ **Real-time Updates** - Query invalidation after cancel

### Database Integration

- ✅ Fetches from 3 tables: `shop_orders`, `dine_in_orders`, `amenity_requests`
- ✅ Includes relationships: products, menu items, amenities, restaurants
- ✅ Status update mutations for cancellations
- ✅ Type-safe transformations with proper error handling

---

## 📁 File Structure

```
src/pages/Guests/components/RequestHistory/
├── types/
│   └── index.ts                      # TypeScript types (OrderStatus, UnifiedOrder, etc.)
├── hooks/
│   ├── useRequestHistory.ts          # Main data fetching hook
│   └── index.ts                      # Hook exports
├── components/
│   ├── OrderCard.tsx                 # Main order display (compact, with cancel)
│   ├── OrderStatusBadge.tsx          # Status badge component
│   ├── OrderTypeIcon.tsx             # Type icon component
│   ├── EmptyHistory.tsx              # Empty state
│   ├── LoadingHistory.tsx            # Loading state
│   └── index.ts                      # Component exports
└── index.ts                          # Module main export

src/pages/Guests/components/shared/
└── RequestHistoryModal.tsx           # Main modal with cancel mutation
```

---

## 🎨 Design Specifications

### Compact Layout

- **Header Padding:** 12px (reduced from 16px)
- **Text Sizes:**
  - Title: 14px (sm)
  - Subtitle: 12px (xs)
  - Details: 12px (xs)
- **Icon Removal:** No type icons, removed Calendar/Clock/Users icons
- **Spacing:** 8px gaps, tighter borders

### Status Colors

- **Pending:** Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Confirmed:** Blue (`bg-blue-100`, `text-blue-800`)
- **In Progress:** Purple (`bg-purple-100`, `text-purple-800`)
- **Completed:** Green (`bg-green-100`, `text-green-800`)
- **Cancelled:** Red (`bg-red-100`, `text-red-800`)

---

## 🔧 Technical Implementation

### TypeScript Types

```typescript
export type OrderType = "shop" | "dine_in" | "amenity";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ShopOrder extends BaseOrder {
  type: "shop";
  total_price: number;
  delivery_date: string;
  delivery_time?: string | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image_url?: string | null;
  }>;
}

export interface DineInOrder extends BaseOrder {
  type: "dine_in";
  order_type: "restaurant_booking" | "room_service";
  total_price: number;
  restaurant_name?: string | null; // NEW: Shows restaurant for bookings
  // ... booking/delivery fields
  items: Array<{ name: string; quantity: number; price: number }>;
}

export interface AmenityRequest extends BaseOrder {
  type: "amenity";
  amenity_name: string;
  category: string;
  request_date: string;
  request_time?: string | null;
}

export type UnifiedOrder = ShopOrder | DineInOrder | AmenityRequest;
```

### Data Fetching Hook

```typescript
export const useRequestHistory = ({ guestId, hotelId }: UseRequestHistoryProps) => {
  return useQuery({
    queryKey: ["request-history", guestId, hotelId],
    queryFn: async (): Promise<GroupedOrders[]> => {
      // Fetch all 3 order types in parallel
      const [shopOrders, dineInOrders, amenityRequests] = await Promise.all([...]);

      // Transform to unified format
      // Sort by created_at DESC
      // Group by date

      return grouped;
    },
    enabled: !!guestId && !!hotelId,
  });
};
```

### Cancel Mutation

```typescript
const cancelMutation = useMutation({
  mutationFn: async ({ orderId, orderType }) => {
    const tableName =
      orderType === "shop"
        ? "shop_orders"
        : orderType === "dine_in"
        ? "dine_in_orders"
        : "amenity_requests";

    const { error } = await supabase
      .from(tableName)
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["request-history"] });
  },
});
```

---

## 📊 Database Queries

### Shop Orders Query

```sql
SELECT
  id, created_at, status, total_price, delivery_date, delivery_time, special_instructions,
  shop_order_items(quantity, price_at_order, product:product_id(name, image_url))
FROM shop_orders
WHERE guest_id = ? AND hotel_id = ?
ORDER BY created_at DESC
```

### Dine-In Orders Query

```sql
SELECT
  id, created_at, status, order_type, total_price, special_instructions,
  reservation_date, reservation_time, number_of_guests,
  delivery_date, delivery_time,
  restaurant:restaurant_id(name),  -- NEW: Restaurant name
  dine_in_order_items(quantity, price_at_order, menu_item:menu_item_id(name))
FROM dine_in_orders
WHERE guest_id = ? AND hotel_id = ?
ORDER BY created_at DESC
```

### Amenity Requests Query

```sql
SELECT
  id, created_at, status, request_date, request_time, special_instructions,
  amenities!inner(name, category)
FROM amenity_requests
WHERE guest_id = ? AND hotel_id = ?
ORDER BY created_at DESC
```

---

## 🎯 Key Features Explained

### 1. Compact Design

- Reduced all padding from 16px → 12px
- Text sizes: 14px title, 12px subtitle/details
- Removed decorative icons (Calendar, Clock, Users)
- Tighter spacing throughout
- Single-line subtitle with date inline

### 2. Restaurant Name Display

- Fetches `restaurant:restaurant_id(name)` in query
- Displays restaurant name as title for bookings: "La Pergola" instead of "Restaurant Booking"
- Falls back to "Restaurant Booking" if no name
- Room service shows "Room Service"

### 3. Icon Removal

- Removed OrderTypeIcon component usage
- Removed Calendar, Clock, Users icons from details
- Clean text-only display
- Information presented with labels: "Date:", "Time:", "Guests:"

### 4. Cancel Only When Pending

```typescript
const canCancel = order.status === "pending" && onCancel;

{
  canCancel && (
    <button onClick={handleCancelClick}>
      <X className="w-4 h-4 text-red-600" />
    </button>
  );
}
```

- X button appears only for pending orders
- Confirmation dialog before cancel
- Updates status to "cancelled"
- Refreshes query to show updated status

---

## 🔄 Data Flow

```
1. User opens RequestHistoryModal
   ↓
2. useRequestHistory hook fetches all orders
   ↓
3. Transform and group by date
   ↓
4. Render OrderCard for each order
   ↓
5. User clicks cancel (if pending)
   ↓
6. Confirmation dialog
   ↓
7. cancelMutation updates status
   ↓
8. Query invalidated and refetched
   ↓
9. UI updates with new status
```

---

## 🎨 UI States

### Loading State

```tsx
<LoadingHistory />
// Shows spinner with "Loading your request history..."
```

### Empty State

```tsx
<EmptyHistory />
// Shows clock icon with "No Request History" message
```

### Error State

```tsx
<div className="text-center py-12">
  <p className="text-red-600">Failed to load request history</p>
  <p className="text-sm text-gray-500">Please try again later</p>
</div>
```

### Success State

- Orders grouped by date
- Sticky date headers
- Expandable order cards
- Cancel button for pending orders

---

## 📱 Responsive Design

- **Mobile:** Full-screen modal, slide-up animation
- **Desktop:** Centered modal with max-width: 672px
- **Scrolling:** Fixed header/footer, scrollable content
- **Touch:** Proper tap targets (48px minimum)

---

## ✅ All Requirements Met

1. ✅ **More Compact** - Reduced padding, smaller text, efficient layout
2. ✅ **Restaurant Name** - Shows restaurant name for bookings from database
3. ✅ **Remove Icons** - All icons removed except status badge and expand/collapse
4. ✅ **Cancel Pending Only** - X button appears only for pending orders with confirmation

---

## 🚀 Usage Example

```tsx
import { RequestHistoryModal } from "@/pages/Guests/components/shared/RequestHistoryModal";

function GuestDashboard() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { session } = useAuth();

  return (
    <>
      <button onClick={() => setIsHistoryOpen(true)}>
        View Request History
      </button>

      <RequestHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        guestId={session.user.id}
      />
    </>
  );
}
```

---

## 🧪 Testing Checklist

- ✅ Displays shop orders with delivery info
- ✅ Displays restaurant bookings with restaurant name
- ✅ Displays room service orders with delivery info
- ✅ Displays amenity requests with category
- ✅ Groups orders by date correctly
- ✅ Expands/collapses order details
- ✅ Shows correct status badges
- ✅ Cancel button only shows for pending orders
- ✅ Cancel confirmation dialog works
- ✅ Status updates after cancel
- ✅ Loading state displays correctly
- ✅ Empty state displays correctly
- ✅ Error state displays correctly
- ✅ Modal closes properly
- ✅ Body scroll prevented when open

---

## 📝 Notes

- No subtotal/tax fields in `dine_in_orders` table (only `total_price`)
- Restaurant name is optional (may be null for room service)
- All TypeScript types use `unknown` casting to avoid `any` linting errors
- Cancel mutation targets correct table based on order type
- Query invalidation ensures UI stays in sync with database

---

## 🎉 Implementation Complete

All 4 requested features have been successfully implemented:

1. **Compact design** - Smaller, tighter, more efficient
2. **Restaurant names** - Fetched from database and displayed
3. **No icons** - Clean text-only interface
4. **Cancel pending only** - Smart cancel button with confirmation

The Request History feature is now production-ready! 🚀
