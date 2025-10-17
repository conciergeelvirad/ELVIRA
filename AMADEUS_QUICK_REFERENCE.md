# Amadeus Tours & Activities - Quick Reference

## 🚀 Quick Start

### 1. Setup (One-time)

```sql
-- In Supabase SQL Editor
INSERT INTO secrets (secret_key, secret_value)
VALUES (
  'TEST.API.AMADEUS_API',
  '{"clientId": "YOUR_ID", "clientSecret": "YOUR_SECRET"}'
);
```

### 2. Import & Use

```typescript
import { searchActivities } from "@/services/amadeusActivities.service";

const tours = await searchActivities({
  latitude: 40.416775,
  longitude: -3.70379,
  radius: 5,
});
```

## 📦 Service Methods

### Search Activities

```typescript
searchActivities({
  latitude: number,
  longitude: number,
  radius?: number  // km, default: 1
}): Promise<AmadeusActivity[]>
```

### Get Activity Details

```typescript
getActivityById(
  activityId: string
): Promise<AmadeusActivity | null>
```

### Search by Area

```typescript
searchActivitiesByArea(
  north: number,
  west: number,
  south: number,
  east: number
): Promise<AmadeusActivity[]>
```

### Clear Token Cache

```typescript
clearTokenCache(): void
```

## 📊 Activity Type

```typescript
interface AmadeusActivity {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  geoCode: { latitude: number; longitude: number };
  rating?: number;
  pictures?: string[];
  bookingLink?: string;
  price?: { amount: string; currencyCode: string };
  minimumDuration?: string;
}
```

## 🎯 Common Use Cases

### Near Hotel

```typescript
const { hotel } = useHotel();
const tours = await searchActivities({
  latitude: hotel.latitude,
  longitude: hotel.longitude,
  radius: 10,
});
```

### With Error Handling

```typescript
try {
  const tours = await searchActivities({ ... });
  setTours(tours);
} catch (error) {
  console.error('Failed to load tours:', error);
  showError('Unable to load tours');
}
```

### Display Tour Card

```tsx
<div>
  <h3>{tour.name}</h3>
  <p>{tour.shortDescription}</p>
  {tour.rating && <span>⭐ {tour.rating}/5</span>}
  {tour.price && (
    <span>
      {tour.price.amount} {tour.price.currencyCode}
    </span>
  )}
  {tour.bookingLink && <a href={tour.bookingLink}>Book Now</a>}
</div>
```

## 🔐 Credentials Format

```json
{
  "clientId": "AbCdEf123456789",
  "clientSecret": "XyZ987654321aBcDeF"
}
```

## ⚠️ Rate Limits

- Test API: 10 requests/second
- Token cached automatically
- Reuses token until expiry

## 📚 Resources

- Setup: `AMADEUS_API_SETUP.md`
- SQL: `database/setup_amadeus_credentials.sql`
- API Docs: https://developers.amadeus.com/
