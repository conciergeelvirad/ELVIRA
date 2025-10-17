# Google Places API Integration

## Directory Structure

```
google-places/
├── types/
│   └── index.ts         # Type definitions for the API
├── utils/
│   └── maps-loader.ts   # Utilities for loading Google Maps
└── index.ts            # Main API service functions
```

## Features

- Nearby restaurants search with pagination
- Detailed place information
- Photo handling
- Type-safe interfaces
- Efficient script loading

## Usage

```typescript
import {
  fetchNearbyRestaurants,
  fetchPlaceDetails,
} from "@/services/google-places";
import type { Restaurant } from "@/services/google-places/types";

// Fetch nearby restaurants
const results = await fetchNearbyRestaurants({
  location: { lat: 41.9, lng: 12.5 },
  radius: 5000, // 5km
  apiKey: "your-api-key",
});

// Get details for a specific place
const details = await fetchPlaceDetails("place-id", "your-api-key");
```

## Performance Considerations

1. Script Loading

   - Google Maps script is loaded once and cached
   - Subsequent calls reuse the loaded instance

2. Data Caching

   - Consider implementing React Query for client-side caching
   - Cache results for 30 minutes by default

3. Pagination

   - Fetches up to 60 results (3 pages)
   - Results are deduplicated by place_id

4. Photo Optimization
   - Photos are requested at 400px width by default
   - Photo URLs are generated only when needed

## Error Handling

The service includes comprehensive error handling for:

- Script loading failures
- API errors
- Missing or invalid parameters
- Network issues

## Type Safety

All interfaces are fully typed for better development experience and fewer runtime errors.
