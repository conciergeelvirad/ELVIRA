# Tour Agencies Integration Guide 🎯

## Quick Start: Using Tour Components

### 1. Import Components

```typescript
import { TourCard, TourList } from "@/components/third-party/tour-agencies";
import { searchActivities } from "@/services/amadeusActivities.service";
import type { AmadeusActivity } from "@/services/amadeusActivities.service";
```

### 2. Basic Tour List

```typescript
function TourAgenciesPage() {
  const [tours, setTours] = useState<AmadeusActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchActivities({
        latitude: 41.9028, // Rome
        longitude: 12.4964,
        radius: 5, // 5 km
      });
      setTours(results);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Tours & Activities</h1>
      <button onClick={handleSearch}>Search Tours</button>

      <TourList
        tours={tours}
        loading={loading}
        onView={(tour) => console.log("View tour:", tour)}
        onApprove={(tour) => console.log("Approve tour:", tour)}
        onReject={(tour) => console.log("Reject tour:", tour)}
      />
    </div>
  );
}
```

### 3. Single Tour Card

```typescript
function SingleTourExample() {
  const tour: AmadeusActivity = {
    id: "123",
    name: "Roman Food Tour",
    type: "TOUR",
    geoCode: { latitude: 41.9, longitude: 12.5 },
    rating: 4.8,
    pictures: ["https://..."],
    price: { amount: "75", currencyCode: "EUR" },
    minimumDuration: "PT3H",
    shortDescription: "Explore authentic Roman cuisine",
  };

  return (
    <TourCard
      tour={tour}
      onView={(tour) => console.log("View", tour)}
      onApprove={(tour) => console.log("Approve", tour)}
      currentStatus="pending"
      isRecommended={false}
    />
  );
}
```

### 4. With Hotel Location

```typescript
import { useHotel } from "@/contexts/HotelContext";

function TourAgenciesTab() {
  const { hotel } = useHotel();
  const [tours, setTours] = useState<AmadeusActivity[]>([]);

  useEffect(() => {
    if (hotel?.location) {
      searchActivities({
        latitude: hotel.location.latitude,
        longitude: hotel.location.longitude,
        radius: 10, // 10 km around hotel
      }).then(setTours);
    }
  }, [hotel]);

  return (
    <div>
      <h2>Tours near {hotel?.name}</h2>
      <TourList
        tours={tours}
        onView={(tour) => {
          /* ... */
        }}
      />
    </div>
  );
}
```

### 5. With Filters

```typescript
function TourAgenciesWithFilters() {
  const [tours, setTours] = useState<AmadeusActivity[]>([]);
  const [filteredTours, setFilteredTours] = useState<AmadeusActivity[]>([]);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 1000,
    category: "all",
  });

  // Apply filters
  useEffect(() => {
    let filtered = [...tours];

    if (filters.minRating > 0) {
      filtered = filtered.filter((t) => (t.rating || 0) >= filters.minRating);
    }

    if (filters.maxPrice < 1000) {
      filtered = filtered.filter((t) => {
        if (!t.price) return true;
        return parseFloat(t.price.amount) <= filters.maxPrice;
      });
    }

    setFilteredTours(filtered);
  }, [tours, filters]);

  return (
    <div className="grid grid-cols-[250px_1fr] gap-6">
      {/* Filter Panel */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Filters</h3>

        <label>Min Rating</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) =>
            setFilters({ ...filters, minRating: parseFloat(e.target.value) })
          }
        />
        <span>{filters.minRating}</span>

        <label>Max Price</label>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })
          }
        />
        <span>${filters.maxPrice}</span>
      </div>

      {/* Tour List */}
      <TourList
        tours={filteredTours}
        onView={(tour) => {
          /* ... */
        }}
      />
    </div>
  );
}
```

### 6. With Approval Workflow

```typescript
import { supabase } from "@/lib/supabase";
import type { ApprovalStatus } from "@/types/approved-third-party-places";

function TourApprovalWorkflow() {
  const [tours, setTours] = useState<AmadeusActivity[]>([]);
  const [approvalStatuses, setApprovalStatuses] = useState<
    Map<string, ApprovalStatus>
  >(new Map());

  // Load approval statuses from Supabase
  const loadApprovalStatuses = async () => {
    const { data } = await supabase
      .from("approved_third_party_places")
      .select("*")
      .eq("type", "tour");

    const statusMap = new Map();
    data?.forEach((item) => {
      statusMap.set(item.place_id, item.status);
    });
    setApprovalStatuses(statusMap);
  };

  // Approve tour
  const handleApprove = async (tour: AmadeusActivity) => {
    const { error } = await supabase
      .from("approved_third_party_places")
      .upsert({
        place_id: tour.id,
        name: tour.name,
        type: "tour",
        status: "approved",
        details: {
          amadeus_id: tour.id,
          rating: tour.rating,
          price: tour.price,
          duration: tour.minimumDuration,
        },
      });

    if (!error) {
      setApprovalStatuses((prev) => new Map(prev).set(tour.id, "approved"));
    }
  };

  // Reject tour
  const handleReject = async (tour: AmadeusActivity) => {
    const { error } = await supabase
      .from("approved_third_party_places")
      .upsert({
        place_id: tour.id,
        name: tour.name,
        type: "tour",
        status: "rejected",
      });

    if (!error) {
      setApprovalStatuses((prev) => new Map(prev).set(tour.id, "rejected"));
    }
  };

  return (
    <TourList
      tours={tours}
      onView={(tour) => {
        /* Open details modal */
      }}
      onApprove={handleApprove}
      onReject={handleReject}
      getStatus={(tour) => approvalStatuses.get(tour.id) || null}
    />
  );
}
```

### 7. Complete Integration Example

```typescript
import { useState, useEffect } from "react";
import { TourList } from "@/components/third-party/tour-agencies";
import { RadiusSelector } from "@/components/third-party";
import { searchActivities } from "@/services/amadeusActivities.service";
import { useHotel } from "@/contexts/HotelContext";
import type { AmadeusActivity } from "@/services/amadeusActivities.service";

function TourAgenciesTab() {
  const { hotel } = useHotel();
  const [tours, setTours] = useState<AmadeusActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5);
  const [selectedTour, setSelectedTour] = useState<AmadeusActivity | null>(
    null
  );

  // Search tours when radius changes
  const handleSearch = async (newRadius: number) => {
    if (!hotel?.location) return;

    setLoading(true);
    setRadius(newRadius);

    try {
      const results = await searchActivities({
        latitude: hotel.location.latitude,
        longitude: hotel.location.longitude,
        radius: newRadius,
      });
      setTours(results);
    } catch (error) {
      console.error("Error searching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial search
  useEffect(() => {
    if (hotel?.location) {
      handleSearch(radius);
    }
  }, [hotel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tours & Activities</h2>
          <p className="text-gray-600">
            {tours.length} tours found near {hotel?.name}
          </p>
        </div>

        {/* Radius Selector */}
        <RadiusSelector
          radius={radius}
          onRadiusChange={handleSearch}
          location={hotel?.location}
        />
      </div>

      {/* Tour List */}
      <TourList
        tours={tours}
        loading={loading}
        onView={setSelectedTour}
        onApprove={(tour) => console.log("Approve", tour)}
        onReject={(tour) => console.log("Reject", tour)}
      />

      {/* Tour Details Modal (TODO) */}
      {selectedTour && <div>Details for {selectedTour.name}</div>}
    </div>
  );
}

export default TourAgenciesTab;
```

## 🎨 Customization

### Custom Tour Card Styling

```typescript
// You can wrap TourCard for custom styling
function CustomTourCard({ tour, ...props }: TourCardProps) {
  return (
    <div className="custom-tour-wrapper">
      <TourCard tour={tour} {...props} />
      {/* Add custom elements */}
      <div className="custom-footer">
        <a href={tour.bookingLink} target="_blank">
          Book Now
        </a>
      </div>
    </div>
  );
}
```

### Custom Tour List Layout

```typescript
// Horizontal scroll instead of grid
function HorizontalTourList({ tours }: { tours: AmadeusActivity[] }) {
  return (
    <div className="flex overflow-x-auto gap-4 pb-4">
      {tours.map((tour) => (
        <div key={tour.id} className="flex-shrink-0 w-[300px]">
          <TourCard tour={tour} onView={(t) => console.log(t)} />
        </div>
      ))}
    </div>
  );
}
```

## 📚 API Reference

### TourCard Props

```typescript
interface TourCardProps {
  tour: AmadeusActivity; // Required: Tour data from Amadeus API
  onView?: (tour: AmadeusActivity) => void; // Optional: View details callback
  onApprove?: (tour: AmadeusActivity) => void; // Optional: Approve callback
  onReject?: (tour: AmadeusActivity) => void; // Optional: Reject callback
  onToggleRecommended?: (tour: AmadeusActivity) => void; // Optional: Toggle recommended
  currentStatus?: ApprovalStatus | null; // Optional: Current approval status
  isRecommended?: boolean; // Optional: Is this tour recommended?
  isLoading?: boolean; // Optional: Loading state
}
```

### TourList Props

```typescript
interface TourListProps {
  tours: AmadeusActivity[]; // Required: Array of tours
  loading?: boolean; // Optional: Show loading spinner
  onView?: (tour: AmadeusActivity) => void; // Optional: View details callback
  onApprove?: (tour: AmadeusActivity) => void; // Optional: Approve callback
  onReject?: (tour: AmadeusActivity) => void; // Optional: Reject callback
  onToggleRecommended?: (tour: AmadeusActivity) => void; // Optional: Toggle recommended
  getStatus?: (tour: AmadeusActivity) => ApprovalStatus | null; // Optional: Get status
  isRecommended?: (tour: AmadeusActivity) => boolean; // Optional: Check if recommended
}
```

### AmadeusActivity Type

```typescript
interface AmadeusActivity {
  id: string; // Unique activity ID
  type: string; // Activity type
  name: string; // Activity name
  shortDescription?: string; // Short description
  description?: string; // Full description
  geoCode: {
    latitude: number;
    longitude: number;
  };
  rating?: number; // Rating (0-5)
  pictures?: string[]; // Photo URLs
  bookingLink?: string; // Booking URL
  price?: {
    amount: string; // Price amount
    currencyCode: string; // Currency (EUR, USD, etc.)
  };
  minimumDuration?: string; // ISO 8601 duration (PT2H30M)
}
```

## 🚀 Next Steps

1. **Add to Third-Party Management Page**

   - Create "Tour Agencies" tab
   - Use RadiusSelector for search
   - Integrate with existing approval workflow

2. **Create TourDetailsModal**

   - Show full tour information
   - Display photos gallery
   - Show booking link
   - Duration and pricing details

3. **Add Tour Filters**

   - Filter by rating
   - Filter by price range
   - Filter by duration
   - Filter by category

4. **Integrate with Supabase**

   - Store approved tours
   - Track recommended tours
   - Sync with database

5. **Test Everything**
   - Test with real Amadeus data
   - Verify approval workflow
   - Check mobile responsiveness

---

**Your tour agencies integration is ready to use!** 🎉
