# Amadeus Tours and Activities API Setup Guide

This guide explains how to set up and use the Amadeus Tours and Activities API in the ELVIRA Hotel application.

## Overview

The Amadeus API provides access to thousands of tours and activities worldwide. We use their Tours and Activities API to help hotel guests discover local experiences.

**API Documentation**: https://developers.amadeus.com/self-service/category/destination-content/api-doc/tours-and-activities

## Prerequisites

1. **Amadeus Test Account**: Sign up at https://developers.amadeus.com/
2. **API Credentials**: Obtain Client ID and Client Secret from the Amadeus dashboard
3. **Supabase Access**: Ability to insert secrets into the `secrets` table

## Setup Steps

### 1. Get Amadeus API Credentials

1. Go to https://developers.amadeus.com/register
2. Create a free test account
3. Navigate to "My Self-Service Workspace"
4. Create a new app or use an existing one
5. Copy your **Client ID** and **Client Secret**

### 2. Store Credentials in Supabase

The credentials must be stored in the `secrets` table in the following JSON format:

```sql
INSERT INTO secrets (secret_key, secret_value)
VALUES (
  'TEST.API.AMADEUS_API',
  '{
    "clientId": "YOUR_CLIENT_ID_HERE",
    "clientSecret": "YOUR_CLIENT_SECRET_HERE"
  }'
);
```

**Important**: Use your actual Client ID and Client Secret from the Amadeus dashboard.

### 3. Verify Setup

You can verify the credentials are stored correctly:

```sql
SELECT secret_key, secret_value
FROM secrets
WHERE secret_key = 'TEST.API.AMADEUS_API';
```

## Service Architecture

### File: `amadeusActivities.service.ts`

The service provides the following functionality:

#### Authentication

- **Automatic OAuth2 token management**
- Token caching to avoid repeated authentication
- Automatic token refresh when expired

#### Search Methods

1. **`searchActivities(params)`**

   - Search activities near a specific location
   - Parameters:
     - `latitude`: Location latitude
     - `longitude`: Location longitude
     - `radius`: Search radius in km (default: 1)

2. **`getActivityById(activityId)`**

   - Get detailed information about a specific activity
   - Parameters:
     - `activityId`: The unique activity identifier

3. **`searchActivitiesByArea(north, west, south, east)`**

   - Search activities within a square boundary
   - Parameters:
     - `north`: North latitude boundary
     - `west`: West longitude boundary
     - `south`: South latitude boundary
     - `east`: East longitude boundary

4. **`clearTokenCache()`**
   - Clear cached access token
   - Useful for testing or credential updates

## Usage Examples

### Basic Search

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";

// Search for activities near Madrid
const activities = await searchActivities({
  latitude: 40.416775,
  longitude: -3.70379,
  radius: 5, // 5km radius
});

console.log(`Found ${activities.length} activities`);
activities.forEach((activity) => {
  console.log(`- ${activity.name} (${activity.rating}/5)`);
  if (activity.price) {
    console.log(
      `  Price: ${activity.price.amount} ${activity.price.currencyCode}`
    );
  }
});
```

### Get Activity Details

```typescript
import { getActivityById } from "@/services/amadeusActivities.service";

// Get specific activity
const activity = await getActivityById("ACTIVITY_ID_123");

if (activity) {
  console.log(activity.name);
  console.log(activity.description);
  console.log(`Duration: ${activity.minimumDuration}`);
  console.log(`Booking: ${activity.bookingLink}`);
}
```

### Search by Area

```typescript
import { searchActivitiesByArea } from "@/services/amadeusActivities.service";

// Search activities in Barcelona area
const activities = await searchActivitiesByArea(
  41.397158, // north
  2.160873, // west
  41.394582, // south
  2.177181 // east
);
```

### With Hotel Location

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";
import { useHotel } from "@/contexts/HotelContext";

function ToursComponent() {
  const { hotel } = useHotel();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadActivities() {
      if (hotel?.latitude && hotel?.longitude) {
        const results = await searchActivities({
          latitude: hotel.latitude,
          longitude: hotel.longitude,
          radius: 10, // 10km around hotel
        });
        setActivities(results);
      }
    }
    loadActivities();
  }, [hotel]);

  // Render activities...
}
```

## Activity Data Structure

```typescript
interface AmadeusActivity {
  id: string; // Unique identifier
  type: string; // Activity type
  name: string; // Activity name
  shortDescription?: string; // Brief description
  description?: string; // Full description
  geoCode: {
    latitude: number;
    longitude: number;
  };
  rating?: number; // User rating (0-5)
  pictures?: string[]; // Array of image URLs
  bookingLink?: string; // Direct booking URL
  price?: {
    amount: string;
    currencyCode: string; // e.g., "EUR", "USD"
  };
  minimumDuration?: string; // e.g., "PT2H" (2 hours)
}
```

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const activities = await searchActivities({
    latitude: 40.416775,
    longitude: -3.70379,
    radius: 5,
  });
} catch (error) {
  console.error("Failed to fetch activities:", error);
  // Handle error (show message to user, retry, etc.)
}
```

Common errors:

- **Authentication failed**: Invalid or missing credentials
- **API request failed**: Network issues or invalid parameters
- **Rate limiting**: Too many requests (handle with retry logic)

## API Limits (Test Environment)

Amadeus Test API has the following limits:

- **Rate Limit**: 10 queries per second
- **Monthly Quota**: Check your dashboard for current limits
- **Data**: Test data may not reflect production availability

## Integration Roadmap

### Phase 1: Basic Display (Current)

- ✅ Service implementation
- ✅ Secure credential storage
- ✅ Error handling

### Phase 2: UI Integration (Next)

- Create `TourCard` component
- Create `TourList` component
- Create `TourDetailsModal` component
- Add to Third-Party page

### Phase 3: Features

- Filter by activity type
- Sort by rating/price
- Save favorite activities
- Direct booking integration

### Phase 4: Approval Workflow

- Admin approval system (similar to restaurants)
- Recommended tours feature
- Custom tour curation

## Testing

### Test the Service

```typescript
// In browser console or test file
import { searchActivities } from "./services/amadeusActivities.service";

// Test search
searchActivities({
  latitude: 40.416775,
  longitude: -3.70379,
  radius: 5,
})
  .then((activities) => {
    console.log("Success!", activities);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Verify Token Caching

The service automatically caches tokens. Check the console logs to see:

- `"Getting new access token"` - First request
- Token reuse on subsequent requests (no new authentication)

## Security Notes

✅ **Credentials stored securely in Supabase**
✅ **Row Level Security (RLS) on secrets table**
✅ **No credentials in client-side code**
✅ **Token caching reduces API calls**
✅ **Automatic token refresh**

⚠️ **Important**: Never commit credentials to Git!

## Troubleshooting

### Authentication Fails

1. Verify credentials in Supabase are correct
2. Check JSON format is valid
3. Ensure using TEST environment credentials

### No Results Returned

1. Verify location coordinates are valid
2. Check radius isn't too small
3. Test environment may have limited data

### Rate Limiting

1. Implement request throttling
2. Cache results when possible
3. Consider upgrading to production API

## Production Checklist

Before going to production:

- [ ] Obtain production API credentials
- [ ] Update secret key (use production endpoint)
- [ ] Test with production data
- [ ] Implement proper rate limiting
- [ ] Add monitoring/logging
- [ ] Set up error alerting
- [ ] Review and optimize caching strategy

## Support

- **Amadeus Documentation**: https://developers.amadeus.com/docs
- **API Support**: https://developers.amadeus.com/support
- **Status Page**: https://developers.amadeus.com/status

---

**Next Steps**: Ready to integrate into the Third-Party page - Tour Agencies tab! 🎉
