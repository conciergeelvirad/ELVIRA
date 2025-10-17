# ✅ Amadeus API - Ready to Use!

## Status: Credentials Already Stored ✅

The Amadeus API credentials are already configured in Supabase Edge Functions:

- **Secret Key**: `TEST.API.AMADEUS_API` ✅
- **Status**: Active (Updated: Oct 12, 2025)

## Quick Test

### Option 1: Browser Console Test

Open your browser console and run:

```javascript
// Import the test utility
import { testAmadeusConnection } from "./utils/testAmadeusApi";

// Run the test
testAmadeusConnection();
```

### Option 2: Test with Hotel Location

```javascript
import { testWithHotelLocation } from "./utils/testAmadeusApi";

// Replace with your hotel's coordinates
testWithHotelLocation(40.416775, -3.70379, 10);
```

### Option 3: Direct Service Test

```javascript
import { searchActivities } from "./services/amadeusActivities.service";

const tours = await searchActivities({
  latitude: 40.416775, // Madrid
  longitude: -3.70379,
  radius: 5, // 5km
});

console.log(`Found ${tours.length} activities!`);
```

## Using in Your Components

### Example: Tours Page

```typescript
import { useState, useEffect } from "react";
import {
  searchActivities,
  AmadeusActivity,
} from "@/services/amadeusActivities.service";
import { useHotel } from "@/contexts/HotelContext";

export function ToursPage() {
  const { hotel } = useHotel();
  const [tours, setTours] = useState<AmadeusActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTours() {
      if (!hotel?.latitude || !hotel?.longitude) return;

      try {
        setLoading(true);
        setError(null);

        const results = await searchActivities({
          latitude: hotel.latitude,
          longitude: hotel.longitude,
          radius: 10, // 10km around hotel
        });

        setTours(results);
      } catch (err) {
        setError("Failed to load tours and activities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, [hotel]);

  if (loading) return <div>Loading tours...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Tours & Activities Near {hotel?.name}</h1>
      <p>Found {tours.length} activities within 10km</p>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <h3>{tour.name}</h3>
            {tour.rating && <div>⭐ {tour.rating}/5</div>}
            {tour.price && (
              <div>
                {tour.price.amount} {tour.price.currencyCode}
              </div>
            )}
            <p>{tour.shortDescription}</p>
            {tour.bookingLink && (
              <a
                href={tour.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Service Methods Available

### 1. Search Activities

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";

const activities = await searchActivities({
  latitude: 40.416775,
  longitude: -3.70379,
  radius: 5, // optional, default: 1km
});
```

### 2. Get Activity by ID

```typescript
import { getActivityById } from "@/services/amadeusActivities.service";

const activity = await getActivityById("ACTIVITY_ID");
```

### 3. Search by Area

```typescript
import { searchActivitiesByArea } from "@/services/amadeusActivities.service";

const activities = await searchActivitiesByArea(
  41.397158, // north
  2.160873, // west
  41.394582, // south
  2.177181 // east
);
```

## Activity Data Structure

```typescript
interface AmadeusActivity {
  id: string;
  type: string;
  name: string;
  shortDescription?: string;
  description?: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  rating?: number; // 0-5
  pictures?: string[]; // Image URLs
  bookingLink?: string; // Direct booking URL
  price?: {
    amount: string;
    currencyCode: string; // "EUR", "USD", etc.
  };
  minimumDuration?: string; // "PT2H" = 2 hours
}
```

## Next: Create UI Components

Now that the API is ready, create these components in:
`src/components/third-party/tour-agencies/`

### Recommended Components

1. **TourCard.tsx** - Single tour display
2. **TourList.tsx** - Grid/list of tours
3. **TourDetailsModal.tsx** - Full details view
4. **TourFilters.tsx** - Filter panel (rating, price, type)
5. **TourEmptyState.tsx** - No results message

### Follow the same pattern as restaurants:

- Use common components (Badge, StatusBadge, GenericCard)
- Create modular sub-components
- Comprehensive error handling
- Loading states

## Testing Checklist

- [ ] Run `testAmadeusConnection()` in console
- [ ] Verify activities are returned
- [ ] Check token caching works (run twice, second should be faster)
- [ ] Test with hotel location
- [ ] Test error handling (invalid coordinates)
- [ ] Test with different radius values
- [ ] Check activity data structure matches type

## Troubleshooting

### No Activities Found

- ✅ Normal for test data - limited coverage
- Try different locations (major cities)
- Increase search radius

### Authentication Error

- Verify secret exists in Supabase Edge Functions
- Check secret key is exactly: `TEST.API.AMADEUS_API`
- Verify JSON format in secret value

### Rate Limiting

- Service automatically caches tokens
- Implement request throttling if needed
- Test environment: 10 req/sec limit

## Resources

- **Service**: `src/services/amadeusActivities.service.ts`
- **Test Utility**: `src/utils/testAmadeusApi.ts`
- **Setup Guide**: `AMADEUS_API_SETUP.md`
- **API Docs**: https://developers.amadeus.com/

---

**Status**: ✅ **READY TO USE!** Start building the Tour Agencies UI! 🎉
