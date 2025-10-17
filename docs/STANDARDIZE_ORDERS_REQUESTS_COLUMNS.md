# Standardize Orders and Requests Tab Columns - October 17, 2025

## Summary

Standardized all Orders and Requests tabs across Amenities, Shop, and Restaurant pages to display consistent columns: Order/Request ID, Item Picture, Guest Name, Room Number, Title/Description, Status, and Creation Date.

## Changes Made

### 1. Amenity Requests Tab

**File**: `src/pages/Hotel/components/amenities/requests/AmenityRequestColumns.tsx`

**New Columns**:

- ✅ **Request ID** - Shows request ID with icon (#12345678)
- ✅ **Amenity** - Shows amenity image and name using `ItemWithImage` component
- ✅ **Guest** - Displays guest full name from `guest_personal_data`
- ✅ **Room** - Shows guest room number
- ✅ **Status** - Uses `StatusBadge` with proper color mapping
- ✅ **Created** - Shows creation date in readable format

**Type**: Uses `ExtendedAmenityRequest` with joined `amenities` and `guests` data

### 2. Shop Orders Tab

**File**: `src/pages/Hotel/components/shop/orders/ShopOrderColumns.tsx`

**New Columns**:

- ✅ **Order ID** - Shows order ID with package icon (#12345678)
- ✅ **Items** - Shows first product image and name, with "+X more items" if multiple
- ✅ **Guest** - Displays guest full name from `guest_personal_data`
- ✅ **Room** - Shows guest room number
- ✅ **Status** - Uses `StatusBadge` with proper color mapping
- ✅ **Created** - Shows creation date in readable format

**Type**: Uses `ExtendedShopOrder` with joined `shop_order_items`, `product`, and `guests` data

### 3. Dine-In Orders Tab

**File**: `src/pages/Hotel/components/restaurant/dine-in-orders/DineInOrderComponents.tsx`

**New Columns**:

- ✅ **Order ID** - Shows order ID with utensils icon (#12345678)
- ✅ **Items** - Shows first menu item image and name, with "+X more items" if multiple
- ✅ **Guest** - Displays guest full name from `guest_personal_data`
- ✅ **Room** - Shows guest room number
- ✅ **Status** - Uses `StatusBadge` with proper color mapping
- ✅ **Created** - Shows creation date in readable format

**Type**: Uses `DineInOrderWithDetails` with joined `items`, `menu_item`, and `guest` data

## Pattern Reuse

### Common Components Used:

1. **`ItemWithImage`** - Reusable component for displaying items with images (Amenities & Shop)
2. **`StatusBadge`** - Consistent status display across all tabs
3. **Column Helper Functions** - `mapOrderStatus()` / `mapRequestStatus()` for status mapping

### Consistent Data Structure:

All tabs now follow the same pattern:

```typescript
{
  key: "column_key",
  header: "COLUMN TITLE",
  sortable: true/false,
  render/accessor: (value, item) => <Component />
}
```

### Status Mapping:

Consistent status mapping to badge colors:

- **Completed/Approved** → Green (completed)
- **Pending** → Yellow (pending)
- **Cancelled/Rejected** → Red (cancelled)
- **Other** → Gray (default)

## Data Requirements

### Database Queries Must Include:

All three pages now require extended data with proper joins:

**Amenity Requests**:

- `amenities!inner(id, name, image_url)`
- `guests!inner(id, room_number, guest_personal_data(first_name, last_name))`

**Shop Orders**:

- `shop_order_items(product(id, name, image_url))`
- `guests(id, room_number, guest_personal_data(first_name, last_name))`

**Dine-In Orders**:

- `items(menu_item(id, name, image_url))`
- `guest(id, room_number, guest_personal_data(first_name, last_name))`

## Benefits

1. **Consistency** - All orders/requests tabs now look and function the same way
2. **Better UX** - Visual item previews make it easier to identify orders at a glance
3. **Complete Information** - All relevant data visible without clicking into details
4. **Maintainability** - Reusable patterns and components reduce code duplication
5. **Professional Look** - Consistent styling with proper badges and formatting

## Visual Layout

Each row now displays:

```
[ID Icon] | [Item Image + Name] | [Guest Name] | [Room] | [Status Badge] | [Date]
```

Example:

```
📦 #1234... | [IMG] Product Name   | John Smith | 101 | 🟢 COMPLETED | Oct 17, 2025
              +2 more items
```

## Grid View Updates

Grid columns also updated to show:

- Request/Order ID
- Guest Name (from joined data)
- Status Badge (consistent styling)

## Testing Recommendations

1. Verify all tabs load data correctly with proper joins
2. Check that item images display correctly or show fallback icons
3. Confirm guest names display properly from `guest_personal_data`
4. Test sorting functionality on all sortable columns
5. Verify status badges show correct colors
6. Check date formatting displays correctly
