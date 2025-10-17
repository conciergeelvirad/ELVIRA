# Orders/Requests Tabs Consistency Fix

**Date**: October 17, 2025  
**Status**: ✅ COMPLETED

## Problem Identified

The three Orders/Requests tabs across different pages were not behaving consistently:

1. **Hotel Shop - Orders Tab**: ✅ Showing item pictures with names
2. **Restaurant - Dine-In Orders Tab**: ❌ Not showing guest names (showing "Unknown Guest")
3. **Amenities - Requests Tab**: ❌ Not showing amenity pictures (showing generic icon)

## Root Causes

### Issue 1: Amenities Requests - Missing Image Data

**Location**: `src/hooks/queries/hotel-management/amenity-requests/useAmenityRequestQueries.ts`

The Supabase query was not fetching `image_url` and `description` from the amenities table:

```typescript
// ❌ BEFORE - Missing image_url
amenities!inner(
  id,
  name
)

// ✅ AFTER - Includes image_url
amenities!inner(
  id,
  name,
  image_url,
  description
)
```

### Issue 2: Dine-In Orders - Missing Guest Personal Data

**Location**: `src/hooks/queries/hotel-management/restaurants/restaurant.constants.ts`

The `DINE_IN_ORDER_SELECT_QUERY` was not joining with `guest_personal_data` table:

```typescript
// ❌ BEFORE - No guest_personal_data join
guest:guests(*),

// ✅ AFTER - Includes guest_personal_data join
guest:guests(
  id,
  room_number,
  guest_personal_data(
    first_name,
    last_name
  )
),
```

### Issue 3: React Child Error - Wrong Icon Type

**Location**:

- `src/pages/Hotel/components/amenities/requests/AmenityRequestColumns.tsx`
- `src/pages/Hotel/components/shop/orders/ShopOrderColumns.tsx`

The `fallbackIcon` prop was being passed a component reference instead of a React element:

```typescript
// ❌ BEFORE - Component reference (not a valid React child)
fallbackIcon={Package}

// ✅ AFTER - React element
fallbackIcon={<Package className="w-5 h-5" />}
```

## Files Modified

### 1. Amenity Request Queries

**File**: `src/hooks/queries/hotel-management/amenity-requests/useAmenityRequestQueries.ts`

- Updated `useAmenityRequests` hook to fetch `image_url` and `description`
- Updated `useAmenityRequestById` hook to fetch `image_url` and `description`

### 2. Restaurant Constants

**File**: `src/hooks/queries/hotel-management/restaurants/restaurant.constants.ts`

- Updated `DINE_IN_ORDER_SELECT_QUERY` to include `guest_personal_data` join

### 3. Column Definitions

**Files**:

- `src/pages/Hotel/components/amenities/requests/AmenityRequestColumns.tsx`
- `src/pages/Hotel/components/shop/orders/ShopOrderColumns.tsx`
- Fixed `fallbackIcon` to use React elements with proper className

## Expected Behavior (After Fix)

All three tabs should now display consistently:

### Hotel Shop - Orders Tab

- ✅ Order ID with icon
- ✅ Item picture with name (first item + count)
- ✅ Guest full name
- ✅ Room number
- ✅ Status badge
- ✅ Creation date

### Restaurant - Dine-In Orders Tab

- ✅ Order ID with icon
- ✅ Menu item picture with name (first item + count)
- ✅ Guest full name (from guest_personal_data)
- ✅ Room number
- ✅ Status badge
- ✅ Creation date

### Amenities - Requests Tab

- ✅ Request ID with icon
- ✅ Amenity picture with name (from amenities.image_url)
- ✅ Guest full name
- ✅ Room number
- ✅ Status badge
- ✅ Creation date

## Testing Checklist

- [ ] Amenities Requests tab shows amenity images
- [ ] Amenities Requests tab shows guest names
- [ ] Restaurant Dine-In Orders tab shows guest names (not "Unknown Guest")
- [ ] Restaurant Dine-In Orders tab shows menu item images
- [ ] Hotel Shop Orders tab continues to work correctly
- [ ] All tabs show consistent column structure
- [ ] No React child errors in console
- [ ] Images load properly or show fallback icons

## Technical Notes

### Data Flow

1. **Query Level**: Supabase queries now fetch all necessary joined data
2. **Type Level**: Types already support the nested structures
3. **Component Level**: Column renderers already access nested data correctly
4. **UI Level**: ItemWithImage component displays images with fallback support

### Pattern Consistency

All three tabs now follow the same pattern:

```typescript
{
  key: "related_entity",
  header: "ENTITY NAME",
  render: (_value, record) => {
    const entity = record.related_entity as any;
    return (
      <ItemWithImage
        imageUrl={entity?.image_url || ""}
        title={entity?.name || "Unknown"}
        description="..."
        fallbackIcon={<Icon className="w-5 h-5" />}
      />
    );
  },
}
```

## Related Documentation

- `docs/STANDARDIZE_ORDERS_REQUESTS_COLUMNS.md` - Initial standardization
- `docs/IMAGE_UPLOAD_IMPLEMENTATION_COMPLETE.md` - Image upload feature
- `docs/IMAGE_UPLOAD_BUG_FIX.md` - Image persistence fixes
