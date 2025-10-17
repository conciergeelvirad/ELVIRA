# Fix: "No restaurants found in this area"

## Problem

The hotel location is showing as `0.000000, 0.000000` which is in the middle of the ocean (Null Island). This is why no restaurants are found.

## Solution

### Step 1: Set the Hotel Location in Database

Run this SQL in Supabase SQL Editor:

```sql
-- For Centro Hotel Mondial in Frankfurt, Germany
UPDATE hotels
SET location = ST_SetSRID(ST_MakePoint(8.682127, 50.110924), 4326)::geography
WHERE id = '086e11e4-4775-4327-8448-3fa0ee7be0a5';
```

**Note**: Replace the coordinates with your actual hotel location:

- Longitude: 8.682127 (X coordinate - comes first in PostGIS)
- Latitude: 50.110924 (Y coordinate - comes second)

### Step 2: Find Your Hotel's Coordinates

If you don't know your hotel coordinates:

1. **Google Maps Method**:

   - Go to [Google Maps](https://maps.google.com)
   - Search for your hotel
   - Right-click on the hotel marker
   - Click "What's here?"
   - Copy the coordinates (format: `latitude, longitude`)

2. **Address Geocoding** (alternative):
   - Use [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding)
   - Or use a free service like [Nominatim](https://nominatim.openstreetmap.org/)

### Step 3: Verify

After running the SQL:

```sql
SELECT
  name,
  ST_X(location::geometry) as longitude,
  ST_Y(location::geometry) as latitude
FROM hotels
WHERE id = '086e11e4-4775-4327-8448-3fa0ee7be0a5';
```

Should return:

```
name                 | longitude | latitude
---------------------|-----------|----------
Centro Hotel Mondial | 8.682127  | 50.110924
```

### Step 4: Refresh the Page

After updating the location:

1. Refresh your Third Party Management page
2. You should see the correct coordinates displayed
3. Restaurants should appear within the selected radius

## About the Deprecation Warnings

The console shows warnings about `google.maps.places.PlacesService` being deprecated. This is normal - Google is transitioning to a new Places API, but the old one still works and will be supported until at least March 2025.

**Current status**: ✅ Working (with deprecation warnings)

**Future improvement**: Migrate to the new Places API (Place class) when needed.

## Expected Results

After setting the location, you should see:

- ✅ Correct coordinates in the UI (e.g., `50.110924, 8.682127`)
- ✅ List of restaurants in Frankfurt
- ✅ Restaurant photos, ratings, and details
- ⚠️ Deprecation warnings (can be ignored for now)

## Troubleshooting

**Still showing 0.000000?**

- Clear browser cache and refresh
- Check if the UPDATE query affected 1 row
- Verify the hotel ID matches

**Still no restaurants?**

- Try increasing the radius to 10km or 15km
- Check if the coordinates are correct (not swapped)
- Verify there are actually restaurants in that area
