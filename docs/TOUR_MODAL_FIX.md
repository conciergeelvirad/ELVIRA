# Tour Modal Fix - October 15, 2025

## Issue Description

When clicking on a tour in the Tours page, the tour details modal was not opening and scrolling was blocked.

## Root Cause

The problem was in `RecommendedItemModal.tsx` line 66. The component had a condition that prevented rendering if `item` was `null`:

```tsx
if (!isOpen || !item) {
  return null;
}
```

However, in `ToursPage.tsx`, the modal was being called with `item={null}` and relying on the `tour` prop instead:

```tsx
<RecommendedItemModal
  item={null}  // ❌ This was causing the modal to not render
  isOpen={isModalOpen}
  onClose={...}
  tour={convertToModalFormat(selectedTour)}
/>
```

Since `item` was `null`, the condition `!item` was `true`, causing the entire modal to return `null` and never render.

## The Fix

### 1. Updated the condition check

Changed from checking if `item` is null to checking if we have any data to display:

```tsx
if (!isOpen) {
  return null;
}

// If no item is provided, we need at least restaurant or tour data
if (!item && !restaurant && !tour) {
  return null;
}
```

### 2. Created a fallback `displayItem`

Added logic to create a fallback item from tour or restaurant data when `item` is `null`:

```tsx
// Create a fallback item if not provided
const displayItem = item || {
  id: tour?.id || restaurant?.place_id || "",
  type: tour ? ("amenity" as const) : ("product" as const),
  title: tour?.name || restaurant?.name || "",
  description: tour?.shortDescription || "",
  price: tour?.price?.amount || 0,
  imageUrl:
    tour?.pictures?.[0] || restaurant?.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
          restaurant?.photos?.[0]?.photo_reference
        }&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
      : undefined,
  category: tour?.category || restaurant?.types?.[0] || "General",
};
```

### 3. Updated all references

Changed all references from `item` to `displayItem` throughout the component:

```tsx
// Before
<ModalHeader title={item.title} onClose={onClose} />

// After
<ModalHeader title={displayItem.title} onClose={onClose} />
```

## Files Modified

1. **`src/pages/Guests/pages/Home/components/RecommendedSection/RecommendedItemModal.tsx`**
   - Updated condition check to allow modal to render when `tour` or `restaurant` props are provided
   - Added `displayItem` fallback logic
   - Updated all references from `item` to `displayItem`

## Testing Recommendations

1. ✅ Click on a tour in the Tours page
2. ✅ Verify the modal opens correctly
3. ✅ Verify scrolling is not blocked
4. ✅ Verify tour details are displayed correctly
5. ✅ Verify the close button works
6. ✅ Test with restaurants in other pages to ensure no regression

## Side Effects

- The body scroll lock functionality (`document.body.style.overflow`) should now work correctly since the modal actually renders
- Modal should properly display tour information from the Amadeus API

## Notes

- The issue only affected tours and potentially restaurants when passed via the `tour` or `restaurant` props
- Items passed via the regular `item` prop were unaffected
- This fix maintains backward compatibility with existing usage of the component
