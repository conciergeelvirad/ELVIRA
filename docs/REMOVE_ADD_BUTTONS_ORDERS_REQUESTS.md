# Remove Add Buttons from Orders and Requests Tabs - October 17, 2025

## Summary

Removed the "Add" buttons from Orders and Requests tabs across all hotel management pages, as these buttons are not necessary for these specific tabs.

## Changes Made

### 1. Amenities Page - Requests Tab

**File**: `src/pages/Hotel/components/amenities/tabs/RequestsTab.tsx`

- ✅ Removed "ADD REQUEST" button from SearchAndFilterBar
- ✅ Removed unused imports: `Plus` icon and `Button` component

### 2. Shop Page - Orders Tab

**File**: `src/pages/Hotel/components/shop/tabs/OrdersTab.tsx`

- ✅ Removed "ADD ORDER" button from SearchAndFilterBar
- ✅ Removed unused imports: `Plus` icon and `Button` component

### 3. Restaurant Page - Dine-In Orders Tab

**File**: `src/pages/Hotel/components/restaurant/tabs/DineInOrdersTab.tsx`

- ✅ Removed "Add Order" button from SearchAndFilterBar
- ✅ Removed unused imports: `Plus` icon and `Button` component

## Rationale

Orders and requests are typically created by guests through the guest interface, not manually added by hotel staff. Removing these "Add" buttons simplifies the interface and prevents staff from creating inappropriate entries.

## Impact

- **User Interface**: Cleaner, more focused toolbar in Orders and Requests tabs
- **Functionality**: No change to existing orders/requests viewing, editing, or deletion
- **Code Quality**: Reduced code by removing unused imports and unnecessary UI elements

## Pages Affected

1. **Hotel Admin** → **Amenities** → **Requests Tab**
2. **Hotel Admin** → **Hotel Shop** → **Orders Tab**
3. **Hotel Admin** → **Hotel Restaurant** → **Dine-In Orders Tab**

## Testing Recommendations

1. Verify that the SearchAndFilterBar displays correctly without the Add button
2. Confirm that search, filter, and view mode toggles still work
3. Ensure that existing edit and delete functionality remains intact
4. Check that the layout is properly aligned
