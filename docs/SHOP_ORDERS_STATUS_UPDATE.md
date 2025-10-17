# Shop Orders Status Update Enhancement

**Date**: October 17, 2025  
**Status**: ✅ COMPLETED

## Overview

Applied the same status update enhancements to Shop Orders as implemented for Amenity Requests, ensuring consistency across all order management sections.

## Changes Implemented

### 1. Clickable Status Badges for Quick Updates

**Feature**: Status badges in the Shop Orders table view are now clickable to quickly update the order status.

**Implementation**:

#### Updated ShopOrderColumns.tsx

```typescript
export const getTableColumns = (
  onStatusClick?: (order: ExtendedShopOrder) => void
): Column<ExtendedShopOrder>[] => {
  // ... columns
  {
    key: "status",
    header: "STATUS",
    render: (value, order) => (
      <StatusBadge
        status={mapOrderStatus(String(value))}
        label={String(value).toUpperCase()}
        variant="soft"
        onClick={onStatusClick ? () => onStatusClick(order) : undefined}
        clickable={!!onStatusClick}
      />
    ),
  },
}
```

#### Connected to Edit Modal

In `useShopPageContent.tsx`:

```typescript
const orderTableColumns = React.useMemo(
  () =>
    getShopOrderTableColumns((order) => {
      const orderData = order;
      shopOrderCRUD.formActions.setFormData(orderData);
      shopOrderCRUD.modalActions.openEditModal(orderData);
    }),
  [shopOrderCRUD]
);
```

### 2. Simplified Edit Experience

**Feature**: Separate form fields for create vs edit operations.

#### Created SHOP_ORDER_EDIT_FORM_FIELDS

**File**: `src/pages/Hotel/components/shop/orders/ShopOrderFormFields.tsx`

```typescript
// Full fields for creating new shop orders
export const SHOP_ORDER_FORM_FIELDS: FormFieldConfig[] = [
  // guest_id, delivery_date, delivery_time, total_price, status, special_instructions
];

// Only status field for editing existing orders
export const SHOP_ORDER_EDIT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "PROCESSING", label: "Processing" },
      { value: "COMPLETED", label: "Completed" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
  },
];
```

#### Updated OrdersTab Component

**File**: `src/pages/Hotel/components/shop/tabs/OrdersTab.tsx`

```typescript
import { SHOP_ORDER_FORM_FIELDS, SHOP_ORDER_EDIT_FORM_FIELDS } from "../index";

// In component render:
<CRUDModalContainer
  formFields={SHOP_ORDER_FORM_FIELDS}
  editFormFields={SHOP_ORDER_EDIT_FORM_FIELDS}
  // ... other props
/>;
```

### 3. Detail View Cleanup

**Removed from Detail View**:

- ❌ Guest ID (internal reference)

**Retained Fields**:

- ✅ Order ID
- ✅ Total Price
- ✅ Delivery Date
- ✅ Delivery Time
- ✅ Status
- ✅ Special Instructions
- ✅ Created Date/Time

**Updated getDetailFields**:

```typescript
export const getDetailFields = (order: ShopOrder) => [
  { label: "Order ID", value: `#${order.id.slice(0, 8)}` },
  // Guest ID removed
  { label: "Total Price", value: `$${order.total_price.toFixed(2)}` },
  // ... other fields
];
```

## Files Modified

1. **ShopOrderColumns.tsx**

   - Added `onStatusClick` parameter to `getTableColumns`
   - Made status badges clickable
   - Removed Guest ID from detail view

2. **ShopOrderFormFields.tsx**

   - Created separate `SHOP_ORDER_EDIT_FORM_FIELDS`
   - Maintains full `SHOP_ORDER_FORM_FIELDS` for creation

3. **shop/index.ts**

   - Exported `SHOP_ORDER_EDIT_FORM_FIELDS`

4. **OrdersTab.tsx**

   - Imported `SHOP_ORDER_EDIT_FORM_FIELDS`
   - Added `editFormFields` prop to `CRUDModalContainer`

5. **useShopPageContent.tsx**

   - Connected status badge click to edit modal
   - Pre-fills form data with current order
   - Updated `orderTableColumns` with callback

6. **ShopOrdersDataView.tsx**
   - Redesigned card component with room number avatar
   - Added product names and guest names display
   - Updated grid columns to show all relevant data

### 4. Enhanced Grid View with Room Number Avatar

**Feature**: Grid view now displays the same data as table view, with room number as avatar (matching Amenity Requests pattern).

**Updated Grid Columns**:

```typescript
const gridColumns: GridColumn[] = [
  { key: "id", label: "Order ID" },
  { key: "items", label: "Items" },
  { key: "guest", label: "Guest" },
  { key: "room_number", label: "Room" },
  { key: "total_price", label: "Total" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
];
```

**Card Component Updates**:

- **Icon/Avatar**: Displays room number in blue badge (like Guest Management)
- **Title**: "Shop Order"
- **Subtitle**: Order ID (shortened)
- **Sections**:
  - Product name with item count
  - Guest full name (from guest_personal_data)
  - Total price (green, prominent)
  - Created date
  - Delivery date (if available)

**Visual Consistency**:

```typescript
icon={
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-lg font-bold text-blue-600">{roomNumber}</span>
  </div>
}
iconBgColor="bg-blue-100"
```

## User Experience

### Quick Status Updates Workflow

1. **User clicks status badge** in table view (e.g., "PENDING")
2. **Edit modal opens** with only status dropdown visible
3. **User selects new status** (e.g., "PROCESSING")
4. **Clicks "Submit"**
5. **Status updates immediately**

### Modal Behavior

#### Detail Modal (View):

- Shows all order information
- Does NOT show Guest ID
- Shows guest name and room in table
- Edit and Delete buttons available

#### Edit Modal (from Edit button):

- Opens with status dropdown only
- Quick, focused update
- No unnecessary fields

#### Create Modal:

- Shows all fields needed for new order
- Includes guest_id, dates, price, etc.

## Status Options Available

All shop orders support these status values:

- **PENDING**: Order received, awaiting processing
- **PROCESSING**: Order being prepared
- **COMPLETED**: Order ready
- **DELIVERED**: Order delivered to guest
- **CANCELLED**: Order cancelled

## Consistency with Other Modules

This implementation matches the pattern used in:

- ✅ Amenity Requests (status update via badge click)
- ✅ Guest Management (detail view without IDs)
- ✅ Restaurant Orders (simplified edit forms)

## Technical Notes

### Status Badge Integration

The StatusBadge component was already updated with:

- `onClick` prop support
- `clickable` prop for conditional behavior
- Hover and active states
- Cursor pointer styling

### Form Field Separation Pattern

```typescript
// Create: Full fields
<CRUDModalContainer
  formFields={FULL_FORM_FIELDS}
  editFormFields={EDIT_ONLY_FIELDS}
/>

// Edit modal automatically uses editFormFields
// Create modal uses formFields
```

### Column Callback Pattern

```typescript
getShopOrderTableColumns((order) => {
  shopOrderCRUD.formActions.setFormData(order);
  shopOrderCRUD.modalActions.openEditModal(order);
});
```

## Testing Checklist

### Table View

- [ ] Click status badge in table view opens edit modal
- [ ] Edit modal shows only status dropdown
- [ ] Status updates correctly when saved
- [ ] Detail view doesn't show Guest ID
- [ ] Detail view shows all other order information
- [ ] Create modal still shows all necessary fields
- [ ] Create modal includes guest_id field
- [ ] All 5 status options are available
- [ ] Status badge colors match status type
- [ ] Hover effect works on status badges

### Grid View

- [ ] Grid view shows room number as avatar (blue badge)
- [ ] Grid view shows product name and item count
- [ ] Grid view shows guest full name
- [ ] Grid view shows total price
- [ ] Grid view shows created date
- [ ] Grid view shows delivery date
- [ ] Status badge displays correctly in cards
- [ ] Edit and Delete buttons work in card footer
- [ ] Clicking card opens detail modal

## Benefits

1. **Faster Status Updates**: One click to change status vs navigating full form
2. **Cleaner Interface**: Detail view shows only relevant information
3. **Reduced Errors**: Less fields = less chance of accidental changes
4. **Better UX**: Consistent pattern across all order types
5. **Mobile Friendly**: Fewer fields mean better mobile experience

## Related Documentation

- `docs/AMENITY_REQUESTS_STATUS_UPDATE_AND_GRID_VIEW.md` - Original implementation
- `docs/STANDARDIZE_ORDERS_REQUESTS_COLUMNS.md` - Column standardization
- `docs/ORDERS_REQUESTS_CONSISTENCY_FIX.md` - Data consistency fixes
