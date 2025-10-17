# Guest Module

Comprehensive guest management system with personal data tracking, access control, and status management.

## Overview

The guest module handles hotel guest operations including:

- Guest records with room assignments
- Personal data management (names, contact info, preferences)
- Access code expiration tracking
- DND (Do Not Disturb) status
- Active/inactive status management

## File Structure

```
guests/
├── guest.types.ts          # TypeScript type definitions
├── guest.constants.ts      # Query keys and select patterns
├── guest.transformers.ts   # Data transformation utilities
├── useGuestQueries.ts      # React Query hooks
├── index.ts                # Barrel exports
└── README.md               # This file
```

## Types

### Core Types

- **`Guest`** - Complete guest record with optional personal data
- **`GuestWithPersonalData`** - Guest with normalized personal data (single object)
- **`GuestPersonalData`** - Personal information structure
- **`GuestInsert`** - Type for creating new guests
- **`GuestUpdate`** - Type for updating guests
- **`GuestCreationData`** - Combined guest + personal data for creation
- **`GuestUpdateData`** - Flexible update structure

## Query Hooks

### useGuests

Fetches all guests for a hotel with personal data.

```tsx
import { useGuests } from "@/hooks/queries/hotel-management/guests";

function GuestList() {
  const { data: guests, isLoading } = useGuests("hotel-123");

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {guests?.map((guest) => (
        <GuestCard key={guest.id} guest={guest} />
      ))}
    </div>
  );
}
```

### useGuestById

Fetches a single guest by ID.

```tsx
import { useGuestById } from "@/hooks/queries/hotel-management/guests";

function GuestDetails({ guestId }: { guestId: string }) {
  const { data: guest, isLoading } = useGuestById(guestId);

  if (isLoading) return <LoadingSpinner />;
  if (!guest) return <NotFound />;

  return <GuestProfile guest={guest} />;
}
```

## Mutation Hooks

### useCreateGuest

Creates a new guest with personal data. This is a transaction-like operation that creates both the guest record and associated personal data.

```tsx
import { useCreateGuest } from "@/hooks/queries/hotel-management/guests";

function CreateGuestForm() {
  const createGuest = useCreateGuest();

  const handleSubmit = (formData) => {
    createGuest.mutate(
      {
        guestData: {
          hotel_id: "hotel-123",
          room_number: "101",
          guest_name: "John Doe",
          access_code_expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          is_active: true,
          dnd_status: false,
        },
        personalData: {
          first_name: "John",
          last_name: "Doe",
          guest_email: "john@example.com",
          phone_number: "+1234567890",
          country: "USA",
          language: "en",
        },
      },
      {
        onSuccess: () => {
          toast.success("Guest created successfully");
        },
      }
    );
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Transaction Safety**: This mutation creates the guest first, then the personal data. If personal data creation fails, the guest record will remain and needs manual cleanup.

### useUpdateGuest

Updates guest data, personal data, or both. Provides flexible update options.

```tsx
import { useUpdateGuest } from "@/hooks/queries/hotel-management/guests";

function UpdateGuestForm({ guestId, hotelId }: Props) {
  const updateGuest = useUpdateGuest();

  // Update only room number
  const changeRoom = () => {
    updateGuest.mutate({
      id: guestId,
      hotelId: hotelId,
      guestData: {
        room_number: "102",
      },
    });
  };

  // Update only personal data
  const updateContact = () => {
    updateGuest.mutate({
      id: guestId,
      hotelId: hotelId,
      personalData: {
        phone_number: "+9876543210",
        guest_email: "newemail@example.com",
      },
    });
  };

  // Update both
  const updateBoth = () => {
    updateGuest.mutate({
      id: guestId,
      hotelId: hotelId,
      guestData: {
        is_active: false,
        dnd_status: true,
      },
      personalData: {
        language: "es",
        country: "Spain",
      },
    });
  };

  return <div>...</div>;
}
```

### useDeleteGuest

Deletes a guest and their personal data. Handles foreign key constraints properly.

```tsx
import { useDeleteGuest } from "@/hooks/queries/hotel-management/guests";

function DeleteGuestButton({ guestId, hotelId }: Props) {
  const deleteGuest = useDeleteGuest();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this guest?")) {
      deleteGuest.mutate(
        {
          id: guestId,
          hotelId: hotelId,
        },
        {
          onSuccess: () => {
            toast.success("Guest deleted successfully");
          },
        }
      );
    }
  };

  return <Button onClick={handleDelete}>Delete Guest</Button>;
}
```

**Foreign Key Handling**: This mutation deletes personal data first, then the guest record to respect foreign key constraints.

## Transformer Utilities

### Transformation

- **`normalizeGuestPersonalData(guest)`** - Converts personal data from array to single object
- **`normalizeGuests(guests)`** - Normalizes multiple guests

```tsx
import { normalizeGuests } from "@/hooks/queries/hotel-management/guests";

const rawGuests = await fetchGuests();
const normalized = normalizeGuests(rawGuests);
```

### Name Utilities

- **`getGuestFullName(guest)`** - Gets full name from personal data or guest_name
- **`getGuestDisplayName(guest)`** - Gets name with room number

```tsx
import {
  getGuestFullName,
  getGuestDisplayName,
} from "@/hooks/queries/hotel-management/guests";

const fullName = getGuestFullName(guest); // "John Doe"
const displayName = getGuestDisplayName(guest); // "John Doe (Room 101)"
```

### Filtering

- **`filterActiveGuests(guests)`** - Only active guests
- **`filterDNDGuests(guests)`** - Guests with DND enabled
- **`filterByRoomNumber(guests, roomNumber)`** - Guests in specific room
- **`filterExpiredAccess(guests)`** - Guests with expired codes
- **`filterValidAccess(guests)`** - Guests with valid codes
- **`searchGuests(guests, searchTerm)`** - Search by name, room, email, or phone

```tsx
import {
  filterActiveGuests,
  filterExpiredAccess,
  searchGuests,
} from "@/hooks/queries/hotel-management/guests";

const { data: allGuests } = useGuests(hotelId);

// Get only active guests
const activeGuests = filterActiveGuests(allGuests || []);

// Get guests with expired access
const expiredGuests = filterExpiredAccess(allGuests || []);

// Search guests
const [searchTerm, setSearchTerm] = useState("");
const filteredGuests = searchGuests(allGuests || [], searchTerm);
```

### Sorting

- **`sortGuestsByName(guests)`** - Sort by full name
- **`sortGuestsByRoom(guests)`** - Sort by room number
- **`sortGuestsByCheckIn(guests)`** - Sort by check-in date (newest first)
- **`sortGuestsByExpiration(guests)`** - Sort by expiration (soonest first)

```tsx
import {
  sortGuestsByName,
  sortGuestsByExpiration,
} from "@/hooks/queries/hotel-management/guests";

const { data: guests } = useGuests(hotelId);

// Sort by name
const byName = sortGuestsByName(guests || []);

// Sort by expiration
const byExpiration = sortGuestsByExpiration(guests || []);
```

### Grouping

- **`groupGuestsByRoom(guests)`** - Group by room number
- **`groupGuestsByStatus(guests)`** - Group by active/inactive
- **`groupGuestsByCountry(guests)`** - Group by country

```tsx
import {
  groupGuestsByRoom,
  groupGuestsByCountry,
} from "@/hooks/queries/hotel-management/guests";

const { data: guests } = useGuests(hotelId);

// Group by room
const byRoom = groupGuestsByRoom(guests || []);
// { '101': [guest1], '102': [guest2, guest3], ... }

// Group by country
const byCountry = groupGuestsByCountry(guests || []);
// { 'USA': [guest1, guest2], 'Spain': [guest3], ... }
```

### Data Extraction

- **`getUniqueRooms(guests)`** - Get all unique room numbers
- **`getUniqueCountries(guests)`** - Get all unique countries
- **`getGuestsWithEmail(guests)`** - Get guests with email addresses
- **`getGuestsWithPhone(guests)`** - Get guests with phone numbers

```tsx
import {
  getUniqueRooms,
  getGuestsWithEmail,
} from "@/hooks/queries/hotel-management/guests";

const { data: guests } = useGuests(hotelId);

// Get all occupied rooms
const occupiedRooms = getUniqueRooms(guests || []);

// Get guests we can email
const emailableGuests = getGuestsWithEmail(guests || []);
```

### Status Utilities

- **`isAccessExpired(guest)`** - Check if access code is expired
- **`getAccessStatus(guest)`** - Get status text ("Active", "Expired", "Inactive")
- **`getDaysUntilExpiration(guest)`** - Get days until expiration (negative if expired)

```tsx
import {
  isAccessExpired,
  getAccessStatus,
  getDaysUntilExpiration,
} from "@/hooks/queries/hotel-management/guests";

const expired = isAccessExpired(guest);
const status = getAccessStatus(guest); // "Active" | "Expired" | "Inactive"
const days = getDaysUntilExpiration(guest); // 3 or -2 (if expired 2 days ago)

// Show warning badge
{
  days <= 3 && days >= 0 && <Badge>Expires in {days} days</Badge>;
}
```

### Formatting

- **`formatGuestContact(personalData)`** - Format contact info (email • phone)
- **`formatGuestSummary(guest)`** - Format full summary

```tsx
import {
  formatGuestContact,
  formatGuestSummary,
} from "@/hooks/queries/hotel-management/guests";

const contact = formatGuestContact(guest.guest_personal_data);
// "john@example.com • +1234567890"

const summary = formatGuestSummary(guest);
// "John Doe - Room 101 (Active)"
```

## Real-time Subscription Example

```tsx
import { useGuests } from "@/hooks/queries/hotel-management/guests";
import { useTableSubscription } from "@/hooks/useTableSubscription";

function GuestList({ hotelId }: Props) {
  const { data: guests, isLoading } = useGuests(hotelId);

  // Subscribe to real-time updates
  useTableSubscription({
    table: "guests",
    event: "*",
    filter: `hotel_id=eq.${hotelId}`,
    callback: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.list({ hotelId }) });
    },
  });

  return <GuestTable guests={guests} />;
}
```

## Search with Debouncing

```tsx
import {
  useGuests,
  searchGuests,
} from "@/hooks/queries/hotel-management/guests";
import { useDebouncedValue } from "@/hooks/ui/useDebouncedValue";

function SearchableGuestList({ hotelId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const { data: guests } = useGuests(hotelId);
  const filteredGuests = searchGuests(guests || [], debouncedSearch);

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <GuestTable guests={filteredGuests} />
    </div>
  );
}
```

## Best Practices

### 1. Access Code Management

Always set proper expiration dates:

```tsx
// Set expiration to 7 days from now
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

createGuest.mutate({
  guestData: {
    ...otherData,
    access_code_expires_at: expiresAt,
  },
});
```

### 2. Personal Data Handling

Always provide first_name and last_name at minimum:

```tsx
// Good
personalData: {
  first_name: 'John',
  last_name: 'Doe',
  guest_email: 'john@example.com', // Optional but recommended
}

// Bad - missing required fields
personalData: {
  guest_email: 'john@example.com',
}
```

### 3. Status Updates

Use dedicated update calls for status changes:

```tsx
// Check out a guest
updateGuest.mutate({
  id: guestId,
  hotelId: hotelId,
  guestData: { is_active: false },
});

// Enable DND
updateGuest.mutate({
  id: guestId,
  hotelId: hotelId,
  guestData: { dnd_status: true },
});
```

### 4. Error Handling

Always handle errors in mutations:

```tsx
createGuest.mutate(data, {
  onSuccess: () => {
    toast.success("Guest created successfully");
    navigate("/guests");
  },
  onError: (error) => {
    toast.error(`Failed to create guest: ${error.message}`);
  },
});
```

## Migration Guide

If you're migrating from the old `useGuestsQueries.ts`:

```tsx
// Old import
import { useGuests, type Guest } from "../useGuestsQueries";

// New import
import { useGuests, type GuestWithPersonalData as Guest } from "../guests";

// Or use the normalized type directly
import { useGuests, type GuestWithPersonalData } from "../guests";
```

The API remains the same, but types are now more precise and utilities are available for common operations.
