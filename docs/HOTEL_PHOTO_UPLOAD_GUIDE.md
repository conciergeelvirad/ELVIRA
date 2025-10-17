# Hotel Photo Gallery Upload Guide

## Overview

The Hotel Photo Gallery modal now supports **two methods** for adding photos:

1. **Upload from Device** - Upload images directly to Supabase Storage
2. **Add by URL** - Add images via external URL

## Supabase Storage Configuration

### Bucket Structure

- **Bucket Name**: `hotel-assets`
- **Folder**: `hotel-gallery`
- **Full Path**: `hotel-assets/hotel-gallery/{hotelId}_{timestamp}.{ext}`

### File Naming Convention

```
{hotelId}_{timestamp}.{extension}

Example:
086e11e4-4775-4327-8448-3fa0ee7be0a5_1728912345678.jpg
```

This ensures:

- ✅ Unique filenames (no conflicts)
- ✅ Easy to identify which hotel owns the image
- ✅ Chronological ordering by timestamp

## Upload Process

### Step 1: User Selects File

User clicks "Choose File" and selects an image from their device.

### Step 2: File Validation

The system checks:

- **File Type**: Must be JPG, PNG, WebP, or GIF
- **File Size**: Maximum 5MB

If validation fails, user sees an alert message.

### Step 3: Upload to Supabase Storage

```typescript
const filePath = `hotel-gallery/${hotelId}_${timestamp}.${extension}`;

await supabase.storage.from("hotel-assets").upload(filePath, file, {
  cacheControl: "3600",
  upsert: false,
});
```

### Step 4: Get Public URL

```typescript
const { data } = supabase.storage.from("hotel-assets").getPublicUrl(filePath);

const publicUrl = data.publicUrl;
```

Example URL:

```
https://your-project.supabase.co/storage/v1/object/public/hotel-assets/hotel-gallery/086e11e4-4775-4327-8448-3fa0ee7be0a5_1728912345678.jpg
```

### Step 5: Add URL to Gallery

The public URL is added to the `imageUrls` array and will be saved to the database when user clicks "Save Photos".

## Database Storage

### Table: `hotel_settings`

### Column: `images_url`

The `images_url` column stores a JSON array of all photo URLs:

```json
[
  "https://your-project.supabase.co/storage/v1/object/public/hotel-assets/hotel-gallery/086e11e4_1728912345678.jpg",
  "https://example.com/external-image.jpg",
  "https://your-project.supabase.co/storage/v1/object/public/hotel-assets/hotel-gallery/086e11e4_1728912456789.png"
]
```

**Note**: The array can contain both:

- Uploaded files (from Supabase Storage)
- External URLs (from URL input)

## UI Components

### 1. File Upload Section

```tsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Upload Photo from Device
  </label>
  <label className="cursor-pointer">
    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      <Upload /> Choose File
    </div>
    <input type="file" accept="image/*" className="hidden" />
  </label>
  <p className="text-xs text-gray-500">
    Accepted formats: JPG, PNG, WebP, GIF (Max 5MB)
  </p>
</div>
```

### 2. URL Input Section

```tsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Or Add Photo URL
  </label>
  <input type="url" placeholder="https://example.com/image.jpg" />
  <button>Add</button>
</div>
```

### 3. Photo Gallery Grid

Displays all added photos (both uploaded and URL-based) in a 2-column grid with:

- Image preview
- Remove button (hover to show)
- Photo number indicator

## Features

### ✅ File Upload

- Click "Choose File" to browse device
- Automatic upload to Supabase Storage
- Progress indication during upload
- Public URL automatically generated

### ✅ URL Input

- Paste external image URL
- Press Enter or click "Add"
- Instant preview

### ✅ File Validation

- **Accepted Types**: JPG, PNG, WebP, GIF
- **Max Size**: 5MB
- **Error Messages**: User-friendly alerts

### ✅ Photo Management

- Remove any photo (hover and click X)
- Reorder not needed (simple list)
- Max 8 photos limit

### ✅ Mixed Sources

- Can have uploaded files AND external URLs
- All stored together in `images_url` column
- No distinction needed in database

## File Size Limits

### Current: 5MB

```typescript
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  alert("File size must be less than 5MB");
  return;
}
```

### To Change Limit:

Update the `maxSize` constant in `handleFileUpload` function.

## Storage Bucket Permissions

### Required Policies for `hotel-assets` bucket:

#### 1. Public Access (Read)

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotel-assets');
```

#### 2. Authenticated Upload

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'hotel-assets' AND
  (storage.foldername(name))[1] = 'hotel-gallery'
);
```

#### 3. Authenticated Delete (Optional)

```sql
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hotel-assets');
```

## Console Logs

### Upload Success:

```
[HotelPhotoGalleryModal] Uploading file: my-hotel-photo.jpg
[HotelPhotoGalleryModal] File uploaded: {path: "hotel-gallery/086e11e4_..."}
[HotelPhotoGalleryModal] Public URL: https://...
```

### Save Success:

```
[HotelPhotoGalleryModal] Saving images: [
  "https://your-project.supabase.co/storage/...",
  "https://external-url.com/image.jpg"
]
[HotelPhotoGalleryModal] Images saved successfully
```

### Upload Error:

```
[HotelPhotoGalleryModal] Upload error: {message: "..."}
[HotelPhotoGalleryModal] Error uploading file: ...
```

## Example Usage Flow

### Scenario 1: Upload from Device

1. User clicks "Manage Photos"
2. Modal opens showing existing photos (if any)
3. User clicks "Choose File"
4. Selects `hotel-lobby.jpg` from device
5. File uploads to `hotel-assets/hotel-gallery/086e11e4_1728912345678.jpg`
6. Public URL generated and added to gallery
7. User clicks "Save Photos"
8. URL saved to `images_url` column in database

### Scenario 2: Add External URL

1. User clicks "Manage Photos"
2. Enters `https://unsplash.com/photo123.jpg` in URL input
3. Clicks "Add" or presses Enter
4. Image preview appears in gallery
5. User clicks "Save Photos"
6. URL saved to `images_url` column in database

### Scenario 3: Mixed Sources

1. Upload 3 photos from device
2. Add 2 external URLs
3. Total: 5 photos in gallery
4. All 5 URLs saved together in `images_url` column
5. Gallery displays all 5 photos equally

## Error Handling

### File Too Large

```javascript
if (file.size > maxSize) {
  alert("File size must be less than 5MB");
  return;
}
```

### Invalid File Type

```javascript
const validTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
if (!validTypes.includes(file.type)) {
  alert("Please upload a valid image file (JPG, PNG, WebP, or GIF)");
  return;
}
```

### Upload Failed

```javascript
catch (error) {
  console.error("[HotelPhotoGalleryModal] Error uploading file:", error);
  alert("Failed to upload image. Please try again.");
}
```

### Max Photos Reached

```javascript
if (imageUrls.length >= MAX_PHOTOS) {
  // Upload button disabled
  // UI shows "8 / 8"
}
```

## Storage Management

### View Uploaded Files

1. Open Supabase Dashboard
2. Go to Storage
3. Select `hotel-assets` bucket
4. Navigate to `hotel-gallery` folder
5. See all uploaded images with format: `{hotelId}_{timestamp}.{ext}`

### Delete Files

Files can be deleted either:

- **From Supabase Dashboard**: Storage > hotel-assets > hotel-gallery > Select file > Delete
- **Programmatically**: Using `supabase.storage.from('hotel-assets').remove([filePath])`

**Note**: Removing a photo from the gallery (UI) does NOT delete it from storage. It only removes the URL from the database. You may want to implement cleanup later.

## Performance Considerations

### Caching

```typescript
cacheControl: "3600"; // Cache for 1 hour
```

### Image Optimization

Consider using image CDN or Supabase Image Transformation for:

- Automatic resizing
- Format conversion (WebP)
- Quality optimization
- Lazy loading

### Future Enhancements

1. **Image Compression**: Compress before upload
2. **Thumbnails**: Generate thumbnails for faster loading
3. **Drag & Drop**: Add drag-and-drop file upload
4. **Multiple Upload**: Select multiple files at once
5. **Progress Bar**: Show upload percentage
6. **File Preview**: Show preview before upload
7. **Storage Cleanup**: Delete removed images from storage

## Security Best Practices

### ✅ File Validation

- Check file type before upload
- Check file size before upload
- Validate on both client and server side

### ✅ Unique Filenames

- Use hotel ID + timestamp
- Prevents filename conflicts
- Easy to track ownership

### ✅ Bucket Policies

- Public read access only
- Authenticated write access
- Folder-specific restrictions

### ⚠️ Consider Adding

- **Virus scanning** for uploaded files
- **Rate limiting** to prevent abuse
- **Image content moderation** (if user-generated)
- **Server-side validation** in addition to client-side

## Troubleshooting

### Images Not Showing

1. Check if bucket is public
2. Verify RLS policies allow SELECT
3. Check browser console for CORS errors
4. Verify public URL is correct

### Upload Fails

1. Check file size (< 5MB)
2. Check file type (JPG, PNG, WebP, GIF)
3. Verify bucket exists: `hotel-assets`
4. Check folder exists: `hotel-gallery`
5. Verify user is authenticated
6. Check RLS policies allow INSERT

### Slow Uploads

1. Check file size (compress large images)
2. Check internet connection
3. Consider image optimization before upload
4. Check Supabase region (closer = faster)

## Summary

- ✅ Upload from device to Supabase Storage
- ✅ Add external URLs
- ✅ Store all URLs in `images_url` column as JSON array
- ✅ Files uploaded to `hotel-assets/hotel-gallery/`
- ✅ Unique naming: `{hotelId}_{timestamp}.{extension}`
- ✅ File validation (type, size)
- ✅ Max 8 photos
- ✅ Public URLs automatically generated
- ✅ Mixed sources supported (uploaded + external URLs)
