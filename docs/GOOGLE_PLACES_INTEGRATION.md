# Google Places API Integration - Nearby Restaurants

## Overview

This implementation adds functionality to display nearby restaurants from Google Places API in the Third Party Management page, based on the hotel's location stored in the database.

## Features Implemented

### 1. Google Places Service (`src/services/googlePlaces.service.ts`)

- **fetchNearbyRestaurants**: Fetches restaurants within a specified radius
- **parseGeographyToLatLng**: Converts PostGIS geography (WKB hex format) to lat/lng coordinates
- **getPlacePhotoUrl**: Generates URLs for restaurant photos from Google Places

### 2. React Query Hooks (`src/hooks/queries/google-places/useGooglePlacesQueries.ts`)

- **useHotelLocation**: Fetches and parses hotel location from database
- **useGooglePlacesApiKey**: Retrieves API key from Supabase secrets table
- **useNearbyRestaurants**: Fetches restaurants based on hotel location and radius
- **useNearbyRestaurantsWithStatus**: Combined query with loading states

### 3. UI Components

#### RestaurantList Component (`src/components/third-party/RestaurantList.tsx`)

Displays restaurant cards with:

- Restaurant photos (if available)
- Name and address
- Rating and review count
- Open/closed status
- Price level
- Business status
- Link to Google Maps

#### ThirdPartyManagementPage (`src/pages/Hotel/ThirdPartyManagementPage.tsx`)

- Radius selector (1km, 2km, 5km, 10km, 15km)
- Search functionality
- Loading and error states
- Restaurant count display
- Hotel location coordinates display

## Database Requirements

### 1. Hotels Table

The `hotels` table must have a `location` column of type `geography(Point, 4326)`:

```sql
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Example: Set location for Centro Hotel Mondial (Frankfurt)
UPDATE hotels
SET location = ST_SetSRID(ST_MakePoint(8.682127, 50.110924), 4326)::geography
WHERE id = '086e11e4-4775-4327-8448-3fa0ee7be0a5';
```

### 2. Secrets Table

Create a secrets table to store the Google Places API key:

```sql
CREATE TABLE IF NOT EXISTS secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Google Places API key
INSERT INTO secrets (key, value)
VALUES ('PLACES_GOOGLE_API', 'YOUR_GOOGLE_PLACES_API_KEY_HERE')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

## Google Places API Setup

### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Places API" and "Places API (New)"
4. Create credentials → API Key
5. Restrict the key to only Places API for security

### 2. API Key Configuration

- Store the key in Supabase `secrets` table with key `PLACES_GOOGLE_API`
- The key will be fetched automatically by the application

### 3. API Quotas

- Free tier: $200/month credit
- Nearby Search: $32 per 1000 requests
- Photo: $7 per 1000 requests
- Consider caching results to minimize API calls

## Geography Format

The hotel location is stored in PostGIS `geography(Point, 4326)` format:

- **WKB (Well-Known Binary)** format in hexadecimal
- Example: `0101000020E6100000B1FCF9B6602127402D25CB4928114840`
- Format: `SRID + WKB Point(longitude, latitude)`

The `parseGeographyToLatLng` function converts this to `{ lat, lng }` format.

## Usage

### Basic Usage

```tsx
import { useNearbyRestaurantsWithStatus } from "./hooks/queries/google-places/useGooglePlacesQueries";

const { restaurants, isLoading, location } = useNearbyRestaurantsWithStatus({
  hotelId: "086e11e4-4775-4327-8448-3fa0ee7be0a5",
  radius: 5000, // 5km in meters
});
```

### With Custom Radius

```tsx
const [radius, setRadius] = useState(5000);

const { restaurants } = useNearbyRestaurantsWithStatus({
  hotelId: currentHotel.id,
  radius: radius,
});
```

## Restaurant Data Structure

```typescript
interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string; // Address
  rating?: number;
  user_ratings_total?: number;
  price_level?: number; // 0-4 ($, $$, $$$, $$$$)
  business_status?: string; // "OPERATIONAL", "CLOSED_TEMPORARILY", etc.
  geometry: {
    location: { lat: number; lng: number };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  types?: string[]; // ["restaurant", "food", "point_of_interest", ...]
}
```

## Error Handling

The implementation includes comprehensive error handling:

1. **Missing Location**: Returns null if hotel location not set
2. **API Key Missing**: Shows error if PLACES_GOOGLE_API not in secrets table
3. **API Errors**: Catches and displays Google Places API errors
4. **Parse Errors**: Handles geography parsing failures

## Performance Considerations

### Caching Strategy

- **Hotel Location**: Cached for 1 hour (location rarely changes)
- **API Key**: Cached for 24 hours (key doesn't change)
- **Restaurant Results**: Cached for 30 minutes (balances freshness vs API costs)

### Optimization Tips

1. Use appropriate radius (smaller = fewer results = lower cost)
2. Consider implementing server-side caching for popular locations
3. Limit photo loading (each photo is a separate API call)
4. Implement pagination if showing many results

## Future Enhancements

### Potential Features

1. **Filter by Rating**: Show only highly-rated restaurants
2. **Filter by Price**: Allow users to filter by price level
3. **Sort Options**: Distance, rating, price level
4. **Cuisine Types**: Filter by restaurant type/cuisine
5. **Save Favorites**: Allow staff to save/bookmark restaurants
6. **Integration**: Add restaurants to guest recommendations system
7. **Details View**: Show full restaurant details (hours, menu, reviews)
8. **Directions**: Calculate distance from hotel
9. **Multiple Types**: Extend to other place types (attractions, shops, etc.)
10. **Map View**: Display restaurants on an interactive map

## Testing

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Hotel location displays correctly
- [ ] Restaurants load within selected radius
- [ ] Search filters results correctly
- [ ] Radius selector updates results
- [ ] Restaurant cards display all information
- [ ] Photos load correctly (if available)
- [ ] "View on Google Maps" button works
- [ ] Error states display properly
- [ ] Loading states show while fetching

### Test Different Scenarios

1. Hotel without location set
2. Invalid/expired API key
3. Area with no restaurants
4. Area with many restaurants
5. Different radius values

## Troubleshooting

### Common Issues

**Problem**: "Cannot find hotel location"

- **Solution**: Set the hotel's location in the database using PostGIS

**Problem**: "Google Places API key not found"

- **Solution**: Insert API key into secrets table

**Problem**: "No restaurants found"

- **Solution**: Increase radius or check if location coordinates are correct

**Problem**: Photos not loading

- **Solution**: Verify API key has photo permissions enabled

**Problem**: API quota exceeded

- **Solution**: Check Google Cloud Console for quota limits and usage

## Security Considerations

1. **API Key Protection**: Never expose API key in frontend code
2. **Rate Limiting**: Consider implementing rate limiting on API calls
3. **Key Restrictions**: Restrict API key to specific APIs and domains
4. **Secrets Table**: Ensure proper RLS policies on secrets table
5. **CORS**: Configure CORS for Google Maps API requests

## Files Created/Modified

### New Files

- `src/services/googlePlaces.service.ts`
- `src/hooks/queries/google-places/useGooglePlacesQueries.ts`
- `src/components/third-party/RestaurantList.tsx`
- `src/components/third-party/index.ts`
- `src/services/index.ts`

### Modified Files

- `src/pages/Hotel/ThirdPartyManagementPage.tsx`

## Cost Estimation

Based on typical usage:

- **100 searches/day** = $0.32/day = $9.60/month
- **200 photo loads/day** = $0.14/day = $4.20/month
- **Total**: ~$14/month (well within $200 free tier)

## Next Steps

1. **Set Hotel Location**: Update hotel location in database
2. **Add API Key**: Insert Google Places API key in secrets table
3. **Test**: Verify functionality in Third Party Management page
4. **Monitor**: Track API usage in Google Cloud Console
5. **Extend**: Add similar features for other place types
