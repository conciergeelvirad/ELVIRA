# Amadeus Tours and Activities API - Integration Summary

## ✅ What Was Created

### 1. Service Implementation

**File**: `src/services/amadeusActivities.service.ts` (418 lines)

**Features**:

- ✅ OAuth2 authentication with automatic token management
- ✅ Token caching to minimize API calls
- ✅ Secure credential retrieval from Supabase
- ✅ Comprehensive error handling
- ✅ TypeScript type definitions

**API Methods**:

1. `searchActivities(params)` - Search tours/activities near a location
2. `getActivityById(activityId)` - Get specific activity details
3. `searchActivitiesByArea(north, west, south, east)` - Search within boundaries
4. `clearTokenCache()` - Clear cached token (testing/debugging)

### 2. Documentation

**Files Created**:

- ✅ `AMADEUS_API_SETUP.md` - Complete setup and usage guide
- ✅ `database/setup_amadeus_credentials.sql` - SQL script for credential storage

### 3. Type Definitions

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
  rating?: number;
  pictures?: string[];
  bookingLink?: string;
  price?: {
    amount: string;
    currencyCode: string;
  };
  minimumDuration?: string;
}
```

## 🔐 Security Implementation

Just like Google Places API:

- ✅ Credentials stored in Supabase `secrets` table
- ✅ Uses secret key: `TEST.API.AMADEUS_API`
- ✅ JSON format: `{"clientId": "...", "clientSecret": "..."}`
- ✅ Row Level Security (RLS) protection
- ✅ No credentials in code or Git

## 📋 Setup Steps

### 1. Get Amadeus Credentials

1. Sign up at: https://developers.amadeus.com/register
2. Create a test app
3. Copy Client ID and Client Secret

### 2. Store in Supabase

```sql
INSERT INTO secrets (secret_key, secret_value)
VALUES (
  'TEST.API.AMADEUS_API',
  '{
    "clientId": "YOUR_CLIENT_ID",
    "clientSecret": "YOUR_CLIENT_SECRET"
  }'
);
```

### 3. Test the Service

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";

const activities = await searchActivities({
  latitude: 40.416775, // Madrid
  longitude: -3.70379,
  radius: 5, // 5km
});

console.log(`Found ${activities.length} activities`);
```

## 🎯 Integration Roadmap

### Phase 1: Core Service ✅ COMPLETE

- ✅ Service implementation
- ✅ Authentication handling
- ✅ Type definitions
- ✅ Documentation

### Phase 2: UI Components (Next)

Create these components in `src/components/third-party/tour-agencies/`:

1. **TourCard.tsx** - Display single tour/activity

   - Name, description, rating
   - Price and duration
   - Images gallery
   - Booking link button

2. **TourList.tsx** - Grid/list view of tours

   - Responsive grid layout
   - Loading states
   - Empty states

3. **TourDetailsModal.tsx** - Full tour details

   - Complete description
   - Image gallery
   - Location map
   - Booking information

4. **TourFilters.tsx** - Filter panel
   - By rating
   - By price range
   - By duration
   - Sort options

### Phase 3: Third-Party Page Integration

- Add "Tour Agencies" tab to Third-Party page
- Search tours based on hotel location
- Adjustable search radius
- Display results in grid/list view

### Phase 4: Enhanced Features

- Admin approval workflow (like restaurants)
- Save favorite tours
- Recommended tours section
- Integration with hotel concierge requests

## 💡 Usage Examples

### Search Near Hotel

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";
import { useHotel } from "@/contexts/HotelContext";

function ToursPage() {
  const { hotel } = useHotel();
  const [tours, setTours] = useState<AmadeusActivity[]>([]);

  useEffect(() => {
    if (hotel?.latitude && hotel?.longitude) {
      searchActivities({
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        radius: 10,
      }).then(setTours);
    }
  }, [hotel]);

  return (
    <div>
      <h2>Tours & Activities Near {hotel?.name}</h2>
      <TourList tours={tours} />
    </div>
  );
}
```

### Display Tour Card

```typescript
function TourCard({ activity }: { activity: AmadeusActivity }) {
  return (
    <div className="tour-card">
      <img src={activity.pictures?.[0]} alt={activity.name} />
      <h3>{activity.name}</h3>
      <p>{activity.shortDescription}</p>
      {activity.rating && <div>⭐ {activity.rating}/5</div>}
      {activity.price && (
        <div>
          {activity.price.amount} {activity.price.currencyCode}
        </div>
      )}
      {activity.bookingLink && (
        <a href={activity.bookingLink} target="_blank">
          Book Now →
        </a>
      )}
    </div>
  );
}
```

## 🔧 API Capabilities

### Available Endpoints

1. **Search by Location** - Find activities near coordinates
2. **Search by Area** - Find activities in a square boundary
3. **Get Activity Details** - Retrieve specific activity information

### Search Parameters

- `latitude` / `longitude` - Location coordinates
- `radius` - Search radius in kilometers
- `north`, `south`, `east`, `west` - Square area boundaries

### Response Data

- Activity name and description
- Location (latitude/longitude)
- User ratings
- Photos/images
- Pricing information
- Duration
- Direct booking links

## 🚀 Next Steps

1. **Test Credentials**:

   ```typescript
   import { searchActivities } from "@/services/amadeusActivities.service";

   // Test in browser console
   searchActivities({
     latitude: 40.416775,
     longitude: -3.70379,
     radius: 5,
   })
     .then(console.log)
     .catch(console.error);
   ```

2. **Create UI Components**:

   - Start with `TourCard` component
   - Add `TourList` for displaying multiple tours
   - Create `TourDetailsModal` for detailed view

3. **Integrate in Third-Party Page**:

   - Add "Tour Agencies" tab
   - Connect to `searchActivities` service
   - Display tours based on hotel location

4. **Add Features**:
   - Filtering and sorting
   - Favorites system
   - Approval workflow

## 📊 Testing Checklist

- [ ] Store credentials in Supabase
- [ ] Verify credentials with validation query
- [ ] Test `searchActivities()` method
- [ ] Test `getActivityById()` method
- [ ] Test `searchActivitiesByArea()` method
- [ ] Verify token caching works
- [ ] Check error handling
- [ ] Test with different locations
- [ ] Verify search radius parameter
- [ ] Check rate limiting behavior

## 🎨 Component Structure (Planned)

```
src/components/third-party/tour-agencies/
├── TourCard.tsx              (display single tour)
├── TourList.tsx              (grid/list of tours)
├── TourDetailsModal.tsx      (full details modal)
├── TourFilters.tsx           (filter panel)
├── TourSearchBar.tsx         (search input)
├── TourEmptyState.tsx        (no results)
└── index.ts                  (barrel exports)
```

## 📚 Resources

- **API Documentation**: https://developers.amadeus.com/self-service/category/destination-content/api-doc/tours-and-activities
- **Setup Guide**: `AMADEUS_API_SETUP.md`
- **SQL Script**: `database/setup_amadeus_credentials.sql`
- **Service File**: `src/services/amadeusActivities.service.ts`

---

**Status**: ✅ Service implementation complete and ready for UI integration!

**Files Created**: 3

- `amadeusActivities.service.ts` (418 lines)
- `AMADEUS_API_SETUP.md` (comprehensive guide)
- `setup_amadeus_credentials.sql` (SQL script)

**Next**: Create UI components for Tour Agencies tab! 🎉
