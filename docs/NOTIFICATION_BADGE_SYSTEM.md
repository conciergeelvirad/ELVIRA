# Notification Badge System Implementation

## Overview

This implementation adds real-time notification badges to the hotel dashboard sidebar menu. The badges display the count of pending orders/requests from three main areas:

- **Shop Orders** (guest_shop_orders → shop_orders table)
- **Dine-in Orders** (dine_in_orders table)
- **Amenity Requests** (amenity_requests table)

## Components Created/Modified

### 1. **NotificationBadge Component**

**Location:** `src/components/common/NotificationBadge.tsx`

A reusable badge component that displays notification counts.

**Features:**

- Auto-hides when count is 0
- Shows "99+" for counts over 99
- Three variants: primary (blue), danger (red), success (green)
- Two sizes: small (sm) and medium (md)
- Smooth fade-in animation

**Usage:**

```tsx
<NotificationBadge count={5} variant="danger" size="sm" />
```

### 2. **NavigationItem Type Extension**

**Location:** `src/types/navigation.ts`

Added `badgeCount?: number` field to the NavigationItem interface to support badge counts on menu items.

### 3. **SidebarButton Component**

**Location:** `src/components/common/ui/SidebarButton.tsx`

**Changes:**

- Added `badgeCount` prop
- Renders NotificationBadge when count > 0
- Badge positioned inline when sidebar is expanded
- Badge positioned top-right when sidebar is collapsed

### 4. **GenericSidebar Component**

**Location:** `src/components/layout/GenericSidebar.tsx`

**Changes:**

- Passes `badgeCount` from navigation items to SidebarButton components

### 5. **useHotelNotifications Hook**

**Location:** `src/hooks/queries/hotel-management/notifications/useHotelNotifications.ts`

**Purpose:** Fetches and tracks pending order counts with real-time updates.

**Features:**

- Queries three tables for pending items (status = 'pending')
- Returns individual counts and total pending
- Real-time Supabase subscriptions for instant updates
- Automatic refetch every 30 seconds as fallback
- Invalidates React Query cache on database changes

**Returns:**

```typescript
interface HotelNotificationCounts {
  shopOrders: number;
  dineInOrders: number;
  amenityRequests: number;
  totalPending: number;
}
```

**Real-time Subscriptions:**

- Listens to INSERT, UPDATE, DELETE events on all three tables
- Filters by hotel_id
- Automatically updates badge counts when:
  - New orders are created
  - Order status changes
  - Orders are deleted

### 6. **HotelDashboard Integration**

**Location:** `src/pages/Hotel/HotelDashboard.tsx`

**Changes:**

- Imports `useHotelNotifications` hook
- Fetches notification counts using hotel_id
- Maps counts to navigation items:
  - `hotel-shop` → shopOrders count
  - `hotel-restaurant` → dineInOrders count
  - `amenities` → amenityRequests count

## How It Works

### Data Flow

1. **HotelDashboard** fetches notification counts using `useHotelNotifications(hotelId)`
2. Counts are mapped to specific navigation items
3. **GenericSidebar** receives navigation items with badge counts
4. **SidebarButton** displays **NotificationBadge** for items with count > 0

### Real-time Updates

1. Guest creates a new shop order (status: pending)
2. Supabase triggers postgres_changes event
3. Subscription handler invalidates React Query cache
4. Hook refetches counts from database
5. Badge updates instantly in the UI

### Database Queries

All queries filter by:

- `hotel_id = {current_hotel_id}`
- `status = 'pending'`

Tables monitored:

```sql
-- Shop orders
SELECT COUNT(*) FROM shop_orders
WHERE hotel_id = ? AND status = 'pending';

-- Dine-in orders
SELECT COUNT(*) FROM dine_in_orders
WHERE hotel_id = ? AND status = 'pending';

-- Amenity requests
SELECT COUNT(*) FROM amenity_requests
WHERE hotel_id = ? AND status = 'pending';
```

## Badge Behavior

### Expanded Sidebar

- Badge appears inline next to menu label
- Red danger variant for visibility
- Small size (18px height)

### Collapsed Sidebar

- Badge appears top-right of icon
- Positioned absolutely with -top-1 -right-1
- Same red danger variant and small size

### Badge Display Logic

- **count = 0**: Hidden
- **1 ≤ count ≤ 99**: Shows actual number
- **count > 99**: Shows "99+"

## Performance Considerations

1. **React Query Caching**

   - Stale time: 10 seconds
   - Cache invalidation on real-time events

2. **Subscription Efficiency**

   - One subscription per table
   - Filtered by hotel_id at database level
   - Automatic cleanup on component unmount

3. **Fallback Polling**
   - 30-second interval as backup
   - Ensures counts stay updated even if subscriptions fail

## Future Enhancements

Potential improvements:

1. Add notification badge to chat management for unread messages
2. Sound/visual notification when new orders arrive
3. Toast notifications for urgent orders
4. Badge animation when count increases
5. Click badge to filter pending items directly

## Testing

To test the implementation:

1. **Create a pending shop order** as a guest

   - Navigate to guest dashboard → Shop
   - Add items to cart and place order
   - Check hotel dashboard sidebar → "Shop" should show badge

2. **Create a pending dine-in order** as a guest

   - Navigate to guest dashboard → Dine In
   - Place a restaurant reservation or room service order
   - Check hotel dashboard sidebar → "Restaurant" should show badge

3. **Create a pending amenity request** as a guest

   - Navigate to guest dashboard → Amenities
   - Request an amenity
   - Check hotel dashboard sidebar → "Amenities" should show badge

4. **Test real-time updates**

   - Keep hotel dashboard open
   - In another browser/incognito, create orders as guest
   - Watch badges update instantly (within 1-2 seconds)

5. **Test badge disappearance**
   - Change order status from "pending" to "completed" in hotel dashboard
   - Badge count should decrease immediately

## Troubleshooting

**Badges not showing:**

- Check that `hotelStaff?.hotel_id` is defined
- Verify orders exist with status = 'pending' in database
- Check browser console for query errors

**Badges not updating in real-time:**

- Verify Supabase real-time is enabled for tables
- Check network tab for websocket connections
- Confirm RLS policies allow hotel staff to access orders

**Wrong counts:**

- Verify hotel_id matches between staff and orders
- Check that status field is lowercase 'pending'
- Inspect React Query DevTools to see cached data

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── NotificationBadge.tsx          (NEW)
│   │   ├── index.ts                       (MODIFIED - export badge)
│   │   └── ui/
│   │       └── SidebarButton.tsx         (MODIFIED - added badgeCount)
│   └── layout/
│       └── GenericSidebar.tsx            (MODIFIED - pass badgeCount)
├── hooks/
│   └── queries/
│       └── hotel-management/
│           └── notifications/             (NEW FOLDER)
│               ├── index.ts               (NEW)
│               └── useHotelNotifications.ts (NEW)
├── pages/
│   └── Hotel/
│       └── HotelDashboard.tsx            (MODIFIED - use notifications)
└── types/
    └── navigation.ts                     (MODIFIED - added badgeCount field)
```

## Summary

This implementation provides a complete notification system for the hotel dashboard sidebar with:

- ✅ Real-time badge updates via Supabase subscriptions
- ✅ Clean, reusable component architecture
- ✅ Type-safe TypeScript implementation
- ✅ Optimized performance with React Query caching
- ✅ Graceful fallback with polling
- ✅ Responsive design (collapsed/expanded sidebar)
- ✅ Automatic cleanup and error handling
