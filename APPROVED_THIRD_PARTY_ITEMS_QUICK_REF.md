# useApprovedThirdPartyItems - Quick Reference

## 📦 Import

```typescript
import {
  useApprovedThirdPartyItems,
  useApprovedRestaurants,
  useApprovedTourAgencies,
  useApprovedItemsCounts,
} from "@/hooks/queries";
```

## 🔍 Hooks

| Hook                                         | Purpose              | Usage                                                  |
| -------------------------------------------- | -------------------- | ------------------------------------------------------ |
| `useApprovedThirdPartyItems(hotelId, type?)` | All approved items   | `const { data } = useApprovedThirdPartyItems(hotelId)` |
| `useApprovedRestaurants(hotelId)`            | Approved restaurants | `const { data } = useApprovedRestaurants(hotelId)`     |
| `useApprovedTourAgencies(hotelId)`           | Approved tours       | `const { data } = useApprovedTourAgencies(hotelId)`    |
| `useApprovedItemsCounts(hotelId)`            | Get counts           | `const { data } = useApprovedItemsCounts(hotelId)`     |

## ⚡ Quick Examples

### Get all approved items

```typescript
const { data: approved } = useApprovedThirdPartyItems(hotelId);
```

### Get only restaurants

```typescript
const { data: restaurants } = useApprovedRestaurants(hotelId);
```

### Get only tour agencies

```typescript
const { data: tours } = useApprovedTourAgencies(hotelId);
```

### Get counts

```typescript
const { data: counts } = useApprovedItemsCounts(hotelId);
// Returns: { total, restaurants, tourAgencies }
```

### Show count badge

```typescript
const { data: restaurants } = useApprovedRestaurants(hotelId);
<span>Restaurants ({restaurants?.length || 0})</span>;
```

### Filter by type

```typescript
// Only restaurants
const { data } = useApprovedThirdPartyItems(hotelId, "RESTAURANT");

// Only tour agencies
const { data } = useApprovedThirdPartyItems(hotelId, "TOUR AGENCY");
```

## 🏷️ Types

```typescript
interface ApprovedThirdPartyItem {
  id: string;
  hotel_id: string;
  third_party_id: string;
  third_party_type: "RESTAURANT" | "TOUR AGENCY";
  created_at: string;
  updated_at: string;
  approved_by: string | null;
}
```

## 💡 Tips

- ✅ Only returns `status = 'APPROVED'` items
- ✅ Sorted by newest first
- ✅ Use specific hooks when you only need one type
- ✅ Always check `isLoading` before rendering
- ✅ Caching is automatic

## 📄 Full Documentation

See `src/hooks/queries/useApprovedThirdPartyItems.README.md` for complete documentation.
