# Amenity Requests Status Update and Grid View Enhancement

**Date**: October 17, 2025  
**Status**: ✅ COMPLETED

## Changes Implemented

### 1. Clickable Status Badges for Quick Updates

**Feature**: Status badges in the table view are now clickable to quickly update the request status.

**Implementation**:

#### Updated Components:

**StatusBadge Component** (`src/components/common/data-display/StatusBadge.tsx`):

- Added `onClick` prop to handle click events
- Added `clickable` prop to enable/disable clickable behavior
- Added hover and active states with CSS transitions
- Cursor changes to pointer when clickable

```typescript
interface StatusBadgeProps {
  // ... existing props
  onClick?: () => void;
  clickable?: boolean;
}
```

**AmenityRequestColumns** (`src/pages/Hotel/components/amenities/requests/AmenityRequestColumns.tsx`):

- Updated `getTableColumns` to accept `onStatusClick` callback
- Status badge now triggers the edit modal when clicked
- Only status field is editable in the modal (simplified workflow)

```typescript
export const getTableColumns = (
  onStatusClick?: (request: ExtendedAmenityRequest) => void
): Column<ExtendedAmenityRequest>[] => {
  // ... columns definition
  {
    key: "status",
    render: (value, request) => (
      <StatusBadge
        status={mapRequestStatus(String(value))}
        label={String(value).toUpperCase()}
        variant="soft"
        onClick={onStatusClick ? () => onStatusClick(request) : undefined}
        clickable={!!onStatusClick}
      />
    ),
  },
}
```

**useAmenitiesPageContent Hook** (`src/pages/Hotel/hooks/amenities/useAmenitiesPageContent.tsx`):

- Connected status click to open edit modal
- Pre-fills form data with current request
- Modal shows only status field for quick updates

### 2. Enhanced Grid View with Room Number Avatar

**Feature**: Grid view now displays the same data as table view, with room number as avatar (matching Guest Management pattern).

**Implementation**:

**Updated Grid Columns**:

```typescript
const requestGridColumns: GridColumn[] = [
  { key: "id", label: "Request ID" },
  { key: "amenity", label: "Amenity" },
  { key: "guest", label: "Guest" },
  { key: "room_number", label: "Room" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created" },
];
```

**Card Component Updates**:

- **Icon/Avatar**: Displays room number in blue badge (like Guest Management)
- **Title**: "Amenity Request"
- **Subtitle**: Request ID (shortened)
- **Sections**:
  - Amenity name
  - Guest full name (from guest_personal_data)
  - Created date
  - Request date (if available)
  - Request time (if available)

**Visual Consistency**:

```typescript
icon={
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-lg font-bold text-blue-600">{roomNumber}</span>
  </div>
}
iconBgColor="bg-blue-100"
```

### 3. Edit Form Fields Separation

**Feature**: Different form fields for create vs edit operations.

**Files Modified**:

**AmenityRequestFormFields.tsx**:

```typescript
// Full fields for creating new requests
export const AMENITY_REQUEST_FORM_FIELDS: FormFieldConfig[] = [
  // amenity_id, guest_id, request_date, request_time, status, special_instructions
];

// Only status field for editing existing requests
export const AMENITY_REQUEST_EDIT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "completed", label: "Completed" },
      { value: "rejected", label: "Rejected" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];
```

**CRUDModalContainer Component**:

- Added `editFormFields` prop (optional)
- Falls back to `formFields` if `editFormFields` not provided
- Enables different fields for create vs edit modals

### 4. Detail View Cleanup

**Removed Fields from Detail View**:

- ❌ Amenity ID (internal reference, not user-friendly)
- ❌ Guest ID (internal reference, not user-friendly)

**Retained Fields**:

- ✅ Request Date
- ✅ Request Time
- ✅ Status
- ✅ Special Instructions
- ✅ Created Date

## User Experience Improvements

### Quick Status Updates

1. User clicks on status badge in table view
2. Edit modal opens with only status dropdown
3. User selects new status
4. Clicks "Save Changes"
5. Status updates immediately

### Consistent Grid View

- **Before**: Grid showed generic guest/amenity IDs
- **After**: Grid shows meaningful data (names, room numbers, dates)
- Room number displayed as prominent avatar (like Guest Management)
- All relevant information visible at a glance

### Simplified Editing

- **Before**: Edit form showed all fields including IDs
- **After**: Edit form shows only status (the only field that should be updated)
- Detail view shows only relevant information
- Cleaner, more focused interface

## Technical Notes

### Status Badge Click Handler

```typescript
// In useAmenitiesPageContent.tsx
getAmenityRequestTableColumns((request) => {
  const requestData = request;
  amenityRequestCRUD.formActions.setFormData(requestData);
  amenityRequestCRUD.modalActions.openEditModal(requestData);
});
```

### Grid Card Avatar Pattern

```typescript
// Room number avatar (blue badge, matching Guest Management)
icon={
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-lg font-bold text-blue-600">{roomNumber}</span>
  </div>
}
iconBgColor="bg-blue-100"
```

### Form Field Separation Pattern

```typescript
<CRUDModalContainer
  formFields={AMENITY_REQUEST_FORM_FIELDS} // For create
  editFormFields={AMENITY_REQUEST_EDIT_FORM_FIELDS} // For edit
  // ... other props
/>
```

## Files Modified

1. `src/components/common/data-display/StatusBadge.tsx`

   - Added onClick and clickable props
   - Added hover/active states

2. `src/components/common/crud/CRUDModalContainer.tsx`

   - Added editFormFields prop
   - Updated edit modal to use editFormFields

3. `src/pages/Hotel/components/amenities/requests/AmenityRequestColumns.tsx`

   - Added onStatusClick parameter to getTableColumns
   - Made status badges clickable
   - Removed Amenity ID and Guest ID from detail view

4. `src/pages/Hotel/components/amenities/requests/AmenityRequestFormFields.tsx`

   - Created separate AMENITY_REQUEST_EDIT_FORM_FIELDS
   - Added "cancelled" status option

5. `src/pages/Hotel/components/amenities/requests/AmenityRequestsDataView.tsx`

   - Updated grid columns
   - Redesigned card component with room number avatar
   - Added guest name and amenity name display

6. `src/pages/Hotel/components/amenities/index.ts`

   - Exported AMENITY_REQUEST_EDIT_FORM_FIELDS

7. `src/pages/Hotel/components/amenities/tabs/RequestsTab.tsx`

   - Added editFormFields prop to CRUDModalContainer

8. `src/pages/Hotel/hooks/amenities/useAmenitiesPageContent.tsx`
   - Connected status badge click to edit modal
   - Updated requestTableColumns with callback

## Testing Checklist

- [ ] Click status badge in table view opens edit modal
- [ ] Edit modal shows only status dropdown
- [ ] Status updates correctly when saved
- [ ] Grid view shows room number as avatar (blue badge)
- [ ] Grid view shows amenity name
- [ ] Grid view shows guest full name
- [ ] Grid view shows created date
- [ ] Detail view doesn't show Amenity ID or Guest ID
- [ ] Create modal still shows all necessary fields
- [ ] Edit modal only shows status field

## Related Documentation

- `docs/STANDARDIZE_ORDERS_REQUESTS_COLUMNS.md` - Column standardization
- `docs/ORDERS_REQUESTS_CONSISTENCY_FIX.md` - Data consistency fixes
- `docs/REMOVE_ADD_BUTTONS_ORDERS_REQUESTS.md` - UI cleanup
