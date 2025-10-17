# Amenity Requests Module

This module provides comprehensive React Query hooks and utilities for managing guest amenity requests.

## Overview

The amenity-requests module handles all amenity request operations including:

- Amenity request CRUD operations
- Request status tracking (pending, completed, cancelled)
- Guest request history
- Amenity request analytics
- Most requested amenities analysis

## Structure

```
amenity-requests/
├── amenity-request.types.ts        # TypeScript type definitions
├── amenity-request.constants.ts    # Query keys and constants
├── amenity-request.transformers.ts # Data transformation utilities
├── useAmenityRequestQueries.ts     # React Query hooks
├── index.ts                        # Public exports
└── README.md                       # This file
```

## Types

### Core Types

- `AmenityRequest` - Complete amenity request record from database
- `AmenityRequestInsert` - Data required to create a new request
- `AmenityRequestUpdate` - Partial request data for updates

### Extended Types

- `ExtendedAmenityRequest` - Request with related amenity and guest info

### Operation Types

- `AmenityRequestUpdateData` - Update operation with ID, updates, and hotelId
- `AmenityRequestStatusUpdateData` - Status update operation
- `AmenityRequestDeletionData` - Deletion operation with ID and hotelId

## Query Hooks

### Fetching Data

#### `useAmenityRequests(hotelId: string)`

Fetches all amenity requests for a specific hotel with related data.

```typescript
const { data: requests, isLoading } = useAmenityRequests(hotelId);
```

#### `useAmenityRequestById(requestId: string | undefined)`

Fetches a single amenity request by ID with related data.

```typescript
const { data: request } = useAmenityRequestById(requestId);
```

### Mutations

#### `useCreateAmenityRequest()`

Creates a new amenity request.

```typescript
const createRequest = useCreateAmenityRequest();

await createRequest.mutateAsync({
  hotel_id: hotelId,
  guest_id: guestId,
  amenity_id: amenityId,
  request_date: "2024-01-15",
  request_time: "14:00",
  status: "pending",
  special_instructions: "Please deliver to room 305",
});
```

#### `useUpdateAmenityRequest()`

Updates an existing amenity request.

```typescript
const updateRequest = useUpdateAmenityRequest();

await updateRequest.mutateAsync({
  id: requestId,
  updates: {
    request_time: "15:00",
    special_instructions: "Updated instructions",
  },
  hotelId: hotelId,
});
```

#### `useUpdateAmenityRequestStatus()`

Updates amenity request status (convenience hook).

```typescript
const updateStatus = useUpdateAmenityRequestStatus();

await updateStatus.mutateAsync({
  id: requestId,
  status: "completed",
  hotelId: hotelId,
});
```

#### `useDeleteAmenityRequest()`

Deletes an amenity request.

```typescript
const deleteRequest = useDeleteAmenityRequest();

await deleteRequest.mutateAsync({
  id: requestId,
  hotelId: hotelId,
});
```

## Transformer Functions

### Filtering

- `filterRequestsByStatus(requests, status)` - Filter by status
- `filterRequestsByGuest(requests, guestId)` - Filter by guest
- `filterRequestsByAmenity(requests, amenityId)` - Filter by amenity
- `filterRequestsByRoom(requests, roomNumber)` - Filter by room
- `filterRequestsByDateRange(requests, startDate, endDate)` - Filter by date range
- `filterPendingRequests(requests)` - Get pending requests only
- `filterCompletedRequests(requests)` - Get completed requests only
- `filterCancelledRequests(requests)` - Get cancelled requests only
- `filterTodaysRequests(requests)` - Get today's requests
- `searchRequests(requests, query)` - Search by guest name/room/amenity

### Sorting

- `sortRequestsByDateDesc(requests)` - Sort by date (newest first)
- `sortRequestsByDateAsc(requests)` - Sort by date (oldest first)
- `sortRequestsByRequestDate(requests)` - Sort by request date
- `sortRequestsByGuestName(requests)` - Sort by guest name
- `sortRequestsByRoom(requests)` - Sort by room number
- `sortRequestsByAmenity(requests)` - Sort by amenity name
- `sortRequestsByStatus(requests)` - Sort by status (pending → completed → cancelled)

### Grouping

- `groupRequestsByStatus(requests)` - Group by status
- `groupRequestsByAmenity(requests)` - Group by amenity
- `groupRequestsByGuest(requests)` - Group by guest ID
- `groupRequestsByDate(requests)` - Group by date (YYYY-MM-DD)

### Data Extraction

- `getRequestCountsByStatus(requests)` - Count requests per status
- `getRequestCountsByAmenity(requests)` - Count requests per amenity
- `getMostRequestedAmenities(requests, limit?)` - Get top amenities by request count
- `getUniqueGuestIds(requests)` - Get unique guest IDs
- `getRequestStatistics(requests)` - Get comprehensive request statistics

### Formatting

- `formatRequestDate(dateString)` - Format request date
- `formatRequestTime(timeString)` - Format request time
- `formatRequestStatus(status)` - Format status for display
- `getRequestStatusColor(status)` - Get status color for UI
- `formatGuestName(request)` - Format guest name from request
- `formatAmenityName(request)` - Format amenity name from request
- `formatRequestSummary(request)` - Create request summary string
- `formatRequestDetails(request)` - Format full request details

## Usage Examples

### Request Management Dashboard

```typescript
import {
  useAmenityRequests,
  filterPendingRequests,
  sortRequestsByDateDesc,
  getRequestStatistics,
} from "@/hooks/queries/hotel-management/amenity-requests";

function RequestDashboard() {
  const { data: requests } = useAmenityRequests(hotelId);

  const pendingRequests = filterPendingRequests(requests || []);
  const recentRequests = sortRequestsByDateDesc(requests || []);
  const stats = getRequestStatistics(requests || []);

  return (
    <div>
      <h3>Request Statistics</h3>
      <p>Total Requests: {stats.totalRequests}</p>
      <p>Pending: {stats.pendingRequests}</p>
      <p>Completed: {stats.completedRequests}</p>
      <p>Today's Requests: {stats.todaysRequests}</p>
    </div>
  );
}
```

### Creating Requests

```typescript
import {
  useCreateAmenityRequest,
  type AmenityRequestInsert,
} from "@/hooks/queries/hotel-management/amenity-requests";

function CreateRequestForm() {
  const createRequest = useCreateAmenityRequest();

  const handleSubmit = async (formData) => {
    const requestData: AmenityRequestInsert = {
      hotel_id: hotelId,
      guest_id: formData.guestId,
      amenity_id: formData.amenityId,
      request_date: formData.requestDate,
      request_time: formData.requestTime,
      special_instructions: formData.instructions,
      status: "pending",
    };

    await createRequest.mutateAsync(requestData);
  };

  // Form rendering...
}
```

### Request Status Management

```typescript
import {
  useAmenityRequests,
  useUpdateAmenityRequestStatus,
  filterPendingRequests,
} from '@/hooks/queries/hotel-management/amenity-requests';

function PendingRequestsList() {
  const { data: requests } = useAmenityRequests(hotelId);
  const updateStatus = useUpdateAmenityRequestStatus();

  const pendingRequests = filterPendingRequests(requests || []);

  const handleComplete = async (requestId: string) => {
    await updateStatus.mutateAsync({
      id: requestId,
      status: 'completed',
      hotelId: hotelId,
    });
  };

  return (
    // Render pending requests with complete button...
  );
}
```

### Amenity Analytics

```typescript
import {
  useAmenityRequests,
  getRequestCountsByAmenity,
  getMostRequestedAmenities,
  filterRequestsByDateRange,
  groupRequestsByDate,
} from "@/hooks/queries/hotel-management/amenity-requests";

function AmenityAnalytics() {
  const { data: requests } = useAmenityRequests(hotelId);

  // Get this month's requests
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthRequests = filterRequestsByDateRange(
    requests || [],
    startOfMonth,
    new Date()
  );

  const amenityCounts = getRequestCountsByAmenity(monthRequests);
  const topAmenities = getMostRequestedAmenities(monthRequests, 5);
  const requestsByDate = groupRequestsByDate(monthRequests);

  return (
    <div>
      <h3>Monthly Amenity Requests</h3>

      <h4>Top 5 Most Requested Amenities</h4>
      {topAmenities.map((amenity) => (
        <p key={amenity.amenityId}>
          {amenity.amenityName}: {amenity.count} requests
        </p>
      ))}

      <h4>Requests by Amenity</h4>
      {Object.entries(amenityCounts).map(([amenity, count]) => (
        <p key={amenity}>
          {amenity}: {count}
        </p>
      ))}
    </div>
  );
}
```

### Today's Requests View

```typescript
import {
  useAmenityRequests,
  filterTodaysRequests,
  sortRequestsByRequestDate,
  formatRequestSummary,
} from "@/hooks/queries/hotel-management/amenity-requests";

function TodaysRequests() {
  const { data: requests } = useAmenityRequests(hotelId);

  const todayRequests = sortRequestsByRequestDate(
    filterTodaysRequests(requests || [])
  );

  return (
    <div>
      <h3>Today's Amenity Requests ({todayRequests.length})</h3>
      {todayRequests.map((request) => (
        <div key={request.id}>{formatRequestSummary(request)}</div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Status Tracking**: Always update status when requests are fulfilled
2. **Guest Association**: Requests must be associated with a specific guest
3. **Amenity Reference**: Reference valid amenities from the amenities table
4. **Date/Time**: Use request_date and request_time for scheduling
5. **Special Instructions**: Allow guests to provide delivery instructions
6. **Analytics**: Track most requested amenities for inventory planning
7. **Today's View**: Highlight today's requests for staff prioritization
8. **Status Colors**: Use `getRequestStatusColor()` for consistent UI

## Related Modules

- **amenities**: Amenity requests reference amenities table
- **guests**: Requests are associated with specific guests

## Notes

- Status values: 'pending', 'completed', 'cancelled'
- request_date is required, request_time is optional
- special_instructions field allows custom guest notes
- created_at can be null in database (handle appropriately)
- Requests track which staff member processed them (processed_by field)
- updated_at is automatically updated when status changes
