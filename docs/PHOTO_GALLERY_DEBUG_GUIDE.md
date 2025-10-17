# Photo Gallery Debug Guide

## Issue Report

Photo Gallery modal is not interacting with the database after refactoring.

## Refactoring Done

We extracted UI components from `HotelPhotoGalleryModal.tsx` (291 → 271 lines):

- ✅ `PhotoUploadButton` - Upload button with file input
- ✅ `PhotoGrid` - Grid layout wrapper
- ✅ `PhotoGridItem` - Individual photo card with remove button
- ✅ `ProgressBar` - Upload progress indicator

## Debug Logs Added

### 1. Component Render

```
[PhotoGallery] Component render - isOpen: {bool}, hotelId: {id}, imageUrls count: {number}
```

### 2. Fetch Images (on modal open)

```
[PhotoGallery] No hotelId, skipping fetch
[PhotoGallery] Fetching images for hotel: {hotelId}
[PhotoGallery] Fetched data: {data}
[PhotoGallery] Parsed URLs: {urls}
[PhotoGallery] Error fetching images: {error}
[PhotoGallery] Error parsing images_url: {error}
```

### 3. File Upload

```
[PhotoGallery] File input triggered, files: {count}
[PhotoGallery] Available slots: {slots}, Current images: {count}
[PhotoGallery] Files to upload: {count}
[PhotoGallery] Invalid files: {files}
[PhotoGallery] Starting upload...
[PhotoGallery] Uploading file {n}/{total}: {filename}
[PhotoGallery] Uploaded successfully: {url}
[PhotoGallery] All uploads complete. New URLs: {urls}
[PhotoGallery] Upload error: {error}
[PhotoGallery] Upload failed: {error}
```

### 4. Remove Image

```
[PhotoGallery] Removing image at index: {index}
```

### 5. Save to Database

```
[PhotoGallery] No hotelId, cannot submit
[PhotoGallery] Submitting gallery with images: {urls}
[PhotoGallery] Upserting to database: {payload}
[PhotoGallery] Successfully saved to database: {data}
[PhotoGallery] Database error: {error}
[PhotoGallery] Submit failed: {error}
```

## How to Debug

### Step 1: Open Developer Console

Press `F12` in your browser and go to the Console tab.

### Step 2: Test Upload Flow

1. Open Settings page
2. Toggle "Hotel Photo Gallery" ON
3. Click to open the modal
4. **Check Console:** Should see component render log with hotelId
5. **Check Console:** Should see fetch attempt
6. Select photos to upload
7. **Check Console:** Should see file input triggered
8. **Check Console:** Should see upload progress logs
9. Click "Save Photos"
10. **Check Console:** Should see submit logs with database payload

### Step 3: Identify the Issue

#### If you see "No hotelId"

- **Problem:** HotelContext not providing current hotel
- **Solution:** Check HotelContext setup and authentication

#### If fetch returns error

- **Problem:** Database query issue
- **Check:**
  - Row exists in `hotel_settings` with `setting_key = 'hotelPhotoGallery'`
  - RLS policies allow reading

#### If file input not triggered

- **Problem:** PhotoUploadButton not wiring onChange correctly
- **Check:** Event handler is being passed and called

#### If upload starts but fails

- **Problem:** Supabase Storage issue
- **Check:**
  - Bucket `hotel-assets` exists
  - Folder `hotel-gallery` permissions
  - File size/type validation

#### If save fails

- **Problem:** Database upsert issue
- **Check:**
  - Unique constraint on `(hotel_id, setting_key)`
  - RLS policies allow insert/update
  - Payload format is correct

## Expected Database Structure

```sql
-- Table: hotel_settings
CREATE TABLE hotel_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES hotels(id),
  setting_key TEXT NOT NULL,
  setting_value BOOLEAN,
  images_url TEXT, -- JSON array of URLs
  UNIQUE(hotel_id, setting_key)
);

-- Expected row for photo gallery:
{
  hotel_id: "uuid-here",
  setting_key: "hotelPhotoGallery",
  setting_value: true,
  images_url: '["url1", "url2", "url3"]'
}
```

## Potential Over-Refactoring Issues

### ❌ What Could Go Wrong:

1. **Lost event binding** - File input onChange not connected to handler
2. **State not lifting correctly** - Components can't access/update imageUrls
3. **Props drilling issues** - Missing or incorrect prop types

### ✅ What We Did Right:

1. **Kept business logic in parent** - All handlers remain in modal
2. **Components are pure** - Only receive props and render
3. **No state fragmentation** - imageUrls stays centralized

## Quick Verification Checklist

- [ ] Modal opens when toggle is activated
- [ ] Console shows component render with valid hotelId
- [ ] Console shows fetch attempt
- [ ] Upload button is visible and clickable
- [ ] File input accepts multiple files
- [ ] Console shows upload progress
- [ ] Photos appear in grid after upload
- [ ] Remove button works for each photo
- [ ] Save button triggers submit
- [ ] Console shows database upsert with correct payload
- [ ] Modal closes on successful save
- [ ] Photos persist when reopening modal

## Next Steps

1. **Run the app** and open browser console
2. **Follow the test flow** above
3. **Share the console logs** showing where it fails
4. Based on the logs, we can:
   - Fix the specific issue
   - Rollback refactoring if needed
   - Adjust component structure

---

**Note:** All logs are prefixed with `[PhotoGallery]` for easy filtering in console.
