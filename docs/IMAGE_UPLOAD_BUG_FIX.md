# Image Upload Bug Fix - October 17, 2025

## Issue

Image upload feature was working but the uploaded images were not being saved to the database when creating or updating amenities and products.

## Root Causes

### 1. Missing `image_url` Field in Transformations

The CRUD hooks' `transformCreate` and `transformUpdate` functions were missing the `image_url` field. This meant that even though the image was uploaded to Supabase Storage and the URL was set in the form state, it wasn't being sent to the database during insert/update operations.

### 2. Wrong Column Name for Amenities (CRITICAL)

The amenities form and CRUD hooks were using `hotel_recommended` but the actual database column is `recommended`. This caused all amenity updates to fail with the error:

```
Could not find the 'hotel_recommended' column of 'amenities' in the schema cache
```

### 3. Boolean Type Mismatch (CRITICAL)

The select fields for `recommended` and `is_active` were returning string values (`"true"` and `"false"`), but the database expects actual boolean values (`true` and `false`). This caused the error:

```
Invalid input syntax for type boolean: "**"
```

**Solution**: Added `toBoolean()` helper function to convert string booleans to actual booleans in transformations.

## Files Fixed

### Amenities - Field Name Correction

- **File**: `src/pages/Hotel/components/amenities/amenities/AmenityFormFields.tsx`
  - Changed field key from `hotel_recommended` to `recommended`
- **File**: `src/pages/Hotel/components/amenities/tabs/AmenitiesTab.tsx`
  - Changed `hotel_recommended: amenity.hotel_recommended` to `recommended: amenity.recommended` in edit handler

### Amenities CRUD Hooks - Both Locations

- **File**: `src/pages/Hotel/hooks/amenities/useAmenityCRUD.tsx`
- **File**: `src/pages/Hotel/hooks/useAmenityCRUD.tsx`
- **Changes**:
  - Added `toBoolean()` helper function to convert string booleans to actual booleans
  - Changed `hotel_recommended` to `recommended` in both transformCreate and transformUpdate
  - Changed `is_active` and `recommended` to use `toBoolean()` instead of casting
  - Added `image_url: (data.image_url as string) || null` to `transformCreate`
  - Added `image_url: (data.image_url as string) || null` to `transformUpdate`

### Products CRUD Hooks - Both Locations

- **File**: `src/pages/Hotel/hooks/shop/useProductCRUD.tsx`
- **File**: `src/pages/Hotel/hooks/useProductCRUD.tsx`
- **Changes**:
  - Added `image_url: (data.image_url as string) || null` to `transformCreate`
  - Added conditional `image_url` to `transformUpdate`

### Menu Items CRUD Hook

- **File**: `src/pages/Hotel/hooks/restaurant/useMenuItemCRUD.tsx`
- **Status**: ✅ Already had `image_url` field - no changes needed

## Why Multiple Files?

The codebase has duplicate CRUD hooks in two locations:

- Root hooks folder: `src/pages/Hotel/hooks/`
- Feature-specific hooks folders: `src/pages/Hotel/hooks/amenities/`, `src/pages/Hotel/hooks/shop/`, etc.

All locations were updated to ensure consistency regardless of which hook is imported.

## Testing

After these fixes:

1. ✅ Amenities: Upload image → Save → Image URL persists in database
2. ✅ Products: Upload image → Save → Image URL persists in database
3. ✅ Menu Items: Upload image → Save → Image URL persists in database

## Related Documentation

- See `docs/IMAGE_UPLOAD_IMPLEMENTATION_COMPLETE.md` for the original implementation
- Image upload component: `src/components/common/form/ImageUploadField.tsx`
- Storage helper: `src/lib/supabase/storage.ts`
