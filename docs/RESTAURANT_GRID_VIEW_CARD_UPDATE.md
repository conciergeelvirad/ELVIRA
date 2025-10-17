# Restaurant Dine-In Order Grid View Card Update

**Date:** October 17, 2025  
**Status:** ✅ Complete  
**Module:** Hotel Management - Restaurant Orders

## Overview

Updated the restaurant dine-in order grid view cards to match the hotel shop order pattern, providing visual consistency and improved information display across all order management sections.

## Changes Made

### DineInOrderCard Component Redesign

**Pattern Source:** `ShopOrderCard` from Hotel Shop

#### Before vs After

**BEFORE:**

```
┌──────────────────────────────────┐
│ [🍴]  N/A                        │
│       Room 105                   │
│                        Cancelled │
│                                  │
│ 📍 Table undefined               │
│ 🕐 15/10/2025, 08:20:35         │
│                                  │
│ [Edit] [Delete]                  │
└──────────────────────────────────┘
```

**AFTER:**

```
┌──────────────────────────────────┐
│ [105]  Dine-In Order            │
│        #486facfa       Cancelled │
│                                  │
│ 🍴 Items: Berliner Kartoffelsuppe │
│          +2 more                 │
│ 👤 Guest: John Doe               │
│ 📍 Type: Restaurant              │
│ 💵 Total: $24.50                 │
│ 🕐 Created: Oct 15, 2025         │
│                                  │
│ [Edit] [Delete]                  │
└──────────────────────────────────────┘
```

### Key Improvements

#### 1. Icon Area - Room Number Badge

**Before:**

```tsx
icon={<UtensilsCrossed className="w-6 h-6 text-green-600" />}
iconBgColor="bg-green-100"
```

**After:**

```tsx
icon={
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-lg font-bold text-green-600">{roomNumber}</span>
  </div>
}
iconBgColor="bg-green-100"
```

**Benefits:**

- ✅ Room number immediately visible
- ✅ Consistent with Shop Orders (blue badge) and Guest Management pattern
- ✅ Green color maintains restaurant theme
- ✅ Bold, large text for easy identification

#### 2. Header - Order Type & ID

**Before:**

```tsx
title={guestName}
subtitle={`Room ${roomNumber}`}
```

**After:**

```tsx
title="Dine-In Order"
subtitle={`#${order.id.slice(0, 8)}`}
```

**Benefits:**

- ✅ Clear order type identification
- ✅ Short order ID for reference
- ✅ Matches shop order pattern
- ✅ Guest name moved to sections for better organization

#### 3. Information Sections - Comprehensive Data

**Before (2 sections):**

- Table number (if exists)
- Created date/time

**After (5+ sections):**

```tsx
[
  {
    icon: <UtensilsCrossed />,
    content: "Items: Berliner Kartoffelsuppe +2 more",
  },
  {
    icon: <User />,
    content: "Guest: John Doe",
  },
  {
    icon: <MapPin />,
    content: "Type: Room Service / Restaurant",
  },
  {
    icon: <DollarSign />,
    content: "Total: $24.50", // Green, bold
  },
  {
    icon: <Clock />,
    content: "Created: Oct 15, 2025",
  },
];
```

**Benefits:**

- ✅ Shows first menu item name
- ✅ Item count indicator (+X more)
- ✅ Guest name with proper formatting (first + last)
- ✅ Order type (Room Service vs Restaurant)
- ✅ Total price prominently displayed in green
- ✅ Clean, formatted date

### Code Structure

```tsx
const DineInOrderCard: React.FC<{
  order: DineInOrder & {
    items?: Array<{
      menu_item: { name: string; image_url?: string; price: number };
      quantity?: number;
    }>;
    guest?: {
      room_number?: string;
      guest_name?: string;
      guest_personal_data?: { first_name: string; last_name: string };
    };
  };
  onClick: () => void;
  onEdit?: (order: DineInOrder) => void;
  onDelete?: (order: DineInOrder) => void;
}> = ({ order, onClick, onEdit, onDelete }) => {
  // Extract and format data
  const items = order.items || [];
  const firstItem = items[0];
  const menuItemName = firstItem?.menu_item?.name || "Order Items";
  const itemCount = items.length;

  const guest = order.guest;
  const personalData = guest?.guest_personal_data;
  const guestName = personalData
    ? `${personalData.first_name} ${personalData.last_name}`
    : guest?.guest_name || "Unknown Guest";
  const roomNumber = guest?.room_number || "N/A";

  // Calculate total
  const total = items.reduce((sum: number, item: any) => {
    const quantity = item.quantity || 1;
    const price = item.menu_item.price || 0;
    return sum + quantity * price;
  }, 0);

  // Format date
  const createdDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Determine order type
  const isRoomService = order.service_type === "room_service";
  const orderTypeLabel = isRoomService ? "Room Service" : "Restaurant";

  // Build sections with icons and content
  const sections = [
    // Items section
    {
      icon: <UtensilsCrossed className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Items:</span> {menuItemName}
          {itemCount > 1 && (
            <span className="text-gray-500"> +{itemCount - 1} more</span>
          )}
        </>
      ),
    },
    // Guest section
    {
      icon: <User className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Guest:</span> {guestName}
        </>
      ),
    },
    // Order type section
    {
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Type:</span> {orderTypeLabel}
        </>
      ),
    },
  ];

  // Add total if available
  const orderTotal = (order as any).total_price || total;
  if (orderTotal > 0) {
    sections.push({
      icon: <DollarSign className="w-4 h-4" />,
      content: (
        <>
          <span className="font-medium">Total:</span>{" "}
          <span className="text-green-600 font-semibold">
            ${orderTotal.toFixed(2)}
          </span>
        </>
      ),
    });
  }

  // Add created date
  sections.push({
    icon: <Clock className="w-4 h-4" />,
    content: (
      <>
        <span className="font-medium">Created:</span> {createdDate}
      </>
    ),
  });

  return (
    <GenericCard
      icon={/* Room number badge */}
      iconBgColor="bg-green-100"
      title="Dine-In Order"
      subtitle={`#${order.id.slice(0, 8)}`}
      badge={/* Status badge */}
      sections={sections}
      footer={<CardActionFooter />}
      onClick={onClick}
    />
  );
};
```

## Visual Design Elements

### Color Scheme

- **Icon Background:** `bg-green-100` (light green, restaurant theme)
- **Room Number:** `text-green-600` (bold green, matches icon theme)
- **Total Price:** `text-green-600` (emphasis on monetary value)
- **Item Count:** `text-gray-500` (subtle secondary info)

### Typography

- **Room Number:** `text-lg font-bold` (large, prominent)
- **Section Labels:** `font-medium` (clear hierarchy)
- **Total Price:** `font-semibold` (emphasis)
- **Item Count:** Normal weight (secondary information)

### Icons

- 🍴 **UtensilsCrossed** - Menu items
- 👤 **User** - Guest information
- 📍 **MapPin** - Order type/location
- 💵 **DollarSign** - Total price
- 🕐 **Clock** - Created date

## Data Processing

### Guest Name Resolution

```tsx
const personalData = guest?.guest_personal_data;
const guestName = personalData
  ? `${personalData.first_name} ${personalData.last_name}`
  : guest?.guest_name || "Unknown Guest";
```

**Priority:**

1. First name + Last name from `guest_personal_data`
2. Fallback to `guest_name`
3. Default to "Unknown Guest"

### Item Count Display

```tsx
<span className="font-medium">Items:</span> {menuItemName}
{itemCount > 1 && (
  <span className="text-gray-500"> +{itemCount - 1} more</span>
)}
```

**Examples:**

- 1 item: "Items: Berliner Kartoffelsuppe"
- 3 items: "Items: Berliner Kartoffelsuppe +2 more"

### Total Calculation

```tsx
const total = items.reduce((sum: number, item: any) => {
  const quantity = item.quantity || 1;
  const price = item.menu_item.price || 0;
  return sum + quantity * price;
}, 0);

const orderTotal = (order as any).total_price || total;
```

**Fallback Logic:**

1. Use stored `total_price` from order if available
2. Calculate from items if not stored
3. Only display if > 0

### Order Type Differentiation

```tsx
const isRoomService = order.service_type === "room_service";
const orderTypeLabel = isRoomService ? "Room Service" : "Restaurant";
```

**Display:**

- **Room Service:** Shows "Room Service"
- **Restaurant:** Shows "Restaurant"

## Pattern Consistency

### Comparison: Shop vs Restaurant Cards

| Feature           | Shop Orders     | Restaurant Orders | Match?     |
| ----------------- | --------------- | ----------------- | ---------- |
| Room number badge | ✅ Blue         | ✅ Green          | ✅ Pattern |
| Order type title  | "Shop Order"    | "Dine-In Order"   | ✅         |
| Short order ID    | #27068acd       | #486facfa         | ✅         |
| Items section     | ✅ Product name | ✅ Menu item name | ✅         |
| Item count        | ✅ +X more      | ✅ +X more        | ✅         |
| Guest section     | ✅ Full name    | ✅ Full name      | ✅         |
| Total section     | ✅ Green $X.XX  | ✅ Green $X.XX    | ✅         |
| Date format       | Oct 15, 2025    | Oct 15, 2025      | ✅         |
| Icon consistency  | ✅              | ✅                | ✅         |

**Result:** 100% pattern consistency achieved! ✅

## Files Modified

### 1. DineInOrderComponents.tsx

**Changes:**

- Completely rewrote `DineInOrderCard` component
- Added comprehensive data extraction logic
- Implemented section-based information display
- Added total calculation from items
- Added order type differentiation

**New Imports:**

```tsx
import {
  UtensilsCrossed,
  User,
  MapPin,
  Clock,
  DollarSign, // NEW
} from "lucide-react";
```

## Technical Notes

### Type Safety

```tsx
const DineInOrderCard: React.FC<{
  order: DineInOrder & {
    items?: Array<{...}>;
    guest?: {...};
  };
  // ...
}>
```

Extended the base `DineInOrder` type to include related data that comes from the query joins.

### Null Safety

All data access uses optional chaining and fallbacks:

```tsx
const roomNumber = guest?.room_number || "N/A";
const menuItemName = firstItem?.menu_item?.name || "Order Items";
```

### Conditional Rendering

Total price only shows if available:

```tsx
if (orderTotal > 0) {
  sections.push({...});
}
```

## Benefits

### User Experience

- ✅ **Instant Recognition:** Room number immediately visible
- ✅ **Complete Information:** All relevant order data at a glance
- ✅ **Visual Hierarchy:** Important info (total) stands out
- ✅ **Consistent Design:** Matches other modules
- ✅ **Professional Look:** Clean, organized layout

### Staff Workflow

- ✅ **Quick Identification:** Room number badge
- ✅ **Order Verification:** Item count and first item visible
- ✅ **Guest Reference:** Full guest name shown
- ✅ **Type Clarity:** Instant differentiation (Room Service vs Restaurant)
- ✅ **Total Visibility:** Price prominently displayed

### System Consistency

- ✅ **Pattern Reuse:** Same structure as Shop Orders
- ✅ **Unified Design:** Consistent across all order types
- ✅ **Maintainability:** Follows established patterns
- ✅ **Scalability:** Easy to extend with more sections

## Testing Checklist

- [x] Room number displays correctly
- [x] Order ID shows (first 8 characters)
- [x] First menu item name displays
- [x] Item count shows (+X more) when > 1
- [x] Guest full name displays correctly
- [x] Order type shows (Room Service / Restaurant)
- [x] Total price calculates and displays
- [x] Created date formats correctly
- [x] Status badge displays
- [x] Edit/Delete buttons work
- [x] Card click opens detail modal
- [x] Green theme consistent
- [x] Icons display correctly
- [x] Responsive layout works

## Related Documentation

- `SHOP_ORDER_DETAIL_ITEMS_LIST.md` - Shop order card reference
- `RESTAURANT_ORDER_MODAL_STANDARDIZATION.md` - Modal updates
- `RESTAURANT_ORDER_DETAIL_ENHANCEMENT.md` - Detail view updates
- `AMENITY_REQUESTS_STATUS_UPDATE_AND_GRID_VIEW.md` - Grid view pattern

## Conclusion

Successfully updated the restaurant dine-in order grid view cards to match the hotel shop pattern. The cards now provide comprehensive information in a clean, organized format with visual consistency across all order management sections.

All three order management modules (Amenities, Shop, Restaurant) now share the same:

- ✅ Grid card structure
- ✅ Room number badge pattern
- ✅ Information section layout
- ✅ Visual design language
- ✅ Data presentation format

This creates a unified, professional, and user-friendly hotel management system.

---

**Pattern Applied:** ✅ Shop Orders → Restaurant Orders  
**Consistency Status:** ✅ Complete across all modules  
**Visual Design:** ✅ Clean, professional, consistent
