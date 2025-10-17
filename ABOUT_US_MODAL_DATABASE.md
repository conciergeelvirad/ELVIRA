# About Us Modal Database Integration

## Overview

The About Us modal now directly interacts with the `about_us` and `about_us_button` columns in the `hotel_settings` table.

## Database Structure

### Table: `hotel_settings`

Each toggle setting in the Control Panel creates one row in the `hotel_settings` table:

```sql
CREATE TABLE hotel_settings (
  id UUID PRIMARY KEY,
  hotel_id UUID NOT NULL,
  setting_key TEXT NOT NULL,        -- e.g., "aboutSection"
  setting_value BOOLEAN NOT NULL,   -- Toggle state (true/false)
  about_us TEXT NULL,               -- About Us text content
  about_us_button TEXT NULL,        -- Button data (JSON: {text, url})
  images_url TEXT NULL,             -- Photo gallery URLs (JSON array)
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(hotel_id, setting_key)
);
```

## How It Works

### Toggle: "About Section"

When you toggle "About Section" ON/OFF:

- **Row**: `setting_key = "aboutSection"`
- **Column**: `setting_value = true/false`

### Modal: "About Us Section"

When you click "Edit" on the About Section toggle:

#### 1. **Load Data** (on modal open)

Fetches the row where `setting_key = "aboutSection"` and reads:

- `about_us` column → About Us text
- `about_us_button` column → Button data (parsed as JSON)

Example button data stored in `about_us_button`:

```json
{
  "text": "Learn More",
  "url": "https://yourhotel.com/about"
}
```

#### 2. **Save Data** (on form submit)

Updates the same row (`setting_key = "aboutSection"`) with:

- `about_us` = About Us textarea content
- `about_us_button` = JSON string with button text and URL
- `setting_value` = true (keeps toggle enabled)

### Example Database Row

After saving the About Us form, the row looks like this:

```javascript
{
  id: "uuid-here",
  hotel_id: "086e11e4-4775-4327-8448-3fa0ee7be0a5",
  setting_key: "aboutSection",
  setting_value: true,  // Toggle is ON
  about_us: "Welcome to Centro Hotel Mondial...",
  about_us_button: '{"text":"Learn More","url":"https://centrohotel.com/about"}',
  images_url: null,
  created_at: "2025-10-14T...",
  updated_at: "2025-10-14T..."
}
```

## Photo Gallery Works the Same Way

### Toggle: "Hotel Photo Gallery"

When you toggle "Hotel Photo Gallery" ON/OFF:

- **Row**: `setting_key = "hotelPhotoGallery"`
- **Column**: `setting_value = true/false`

### Modal: "Hotel Photo Gallery"

When you click "Manage Photos":

#### 1. **Load Images** (on modal open)

Fetches the row where `setting_key = "hotelPhotoGallery"` and reads:

- `images_url` column → Array of photo URLs (parsed as JSON)

Example images stored in `images_url`:

```json
[
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg"
]
```

#### 2. **Save Images** (on form submit)

Updates the same row with:

- `images_url` = JSON string array of photo URLs
- `setting_value` = true (keeps toggle enabled)

## Code Flow

### AboutUsModal.tsx

```typescript
// LOAD DATA
useEffect(() => {
  const { data } = await supabase
    .from("hotel_settings")
    .select("about_us, about_us_button")
    .eq("setting_key", "aboutSection")
    .single();

  // Parse button data
  const buttonData = JSON.parse(data.about_us_button);
  setButtonText(buttonData.text);
  setButtonUrl(buttonData.url);
}, [isOpen]);

// SAVE DATA
const handleSubmit = async () => {
  const buttonData = { text: buttonText, url: buttonUrl };

  await supabase.from("hotel_settings").upsert({
    setting_key: "aboutSection",
    setting_value: true,
    about_us: aboutUsText,
    about_us_button: JSON.stringify(buttonData),
  });
};
```

### HotelPhotoGalleryModal.tsx

```typescript
// LOAD DATA
useEffect(() => {
  const { data } = await supabase
    .from("hotel_settings")
    .select("images_url")
    .eq("setting_key", "hotelPhotoGallery")
    .single();

  // Parse images array
  const urls = JSON.parse(data.images_url);
  setImageUrls(urls);
}, [isOpen]);

// SAVE DATA
const handleSubmit = async () => {
  await supabase.from("hotel_settings").upsert({
    setting_key: "hotelPhotoGallery",
    setting_value: true,
    images_url: JSON.stringify(imageUrls),
  });
};
```

## Benefits

### ✅ Single Row Per Toggle

Each toggle setting has exactly one row in the database, making queries efficient.

### ✅ Additional Data Columns

The `about_us`, `about_us_button`, and `images_url` columns store extra metadata without creating multiple rows.

### ✅ JSON Storage

Complex data (button object, image array) is stored as JSON strings and parsed when needed.

### ✅ Atomic Updates

Updating the toggle and its related data happens in one upsert operation.

## Data Format Examples

### About Us Button (JSON Object)

```json
{
  "text": "Learn More",
  "url": "https://yourhotel.com/about"
}
```

Stored as string in `about_us_button` column:

```
'{"text":"Learn More","url":"https://yourhotel.com/about"}'
```

### Photo Gallery (JSON Array)

```json
["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
```

Stored as string in `images_url` column:

```
'["https://example.com/photo1.jpg","https://example.com/photo2.jpg"]'
```

## Querying the Data

### Get About Us Content

```sql
SELECT about_us, about_us_button
FROM hotel_settings
WHERE hotel_id = '086e11e4-...'
  AND setting_key = 'aboutSection';
```

### Get Photo Gallery

```sql
SELECT images_url
FROM hotel_settings
WHERE hotel_id = '086e11e4-...'
  AND setting_key = 'hotelPhotoGallery';
```

### Get All Toggle States

```sql
SELECT setting_key, setting_value
FROM hotel_settings
WHERE hotel_id = '086e11e4-...';
```

## Console Logs

When using the modals, check the browser console for:

### About Us Modal:

```
[AboutUsModal] Saving settings: {
  about_us: "Welcome to our hotel...",
  about_us_button: '{"text":"Learn More","url":"https://..."}'
}
[AboutUsModal] Settings saved successfully
```

### Photo Gallery Modal:

```
[HotelPhotoGalleryModal] Saving images: [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg"
]
[HotelPhotoGalleryModal] Images saved successfully
```

## Summary

- **One row per toggle** in `hotel_settings` table
- **setting_key** identifies which toggle (e.g., "aboutSection")
- **setting_value** stores toggle state (true/false)
- **about_us** column stores About Us text
- **about_us_button** column stores button JSON object
- **images_url** column stores photo URLs JSON array
- All data updates happen in single upsert operations
- Toggle and content data stay synchronized
