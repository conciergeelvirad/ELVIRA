# Emergency Contacts Query Module

Comprehensive query hooks and utilities for managing emergency contact data in the hotel management system.

## Overview

This module provides React Query hooks for emergency contact CRUD operations, along with utilities for filtering, sorting, grouping, and formatting contact data.

## Structure

```
emergency-contacts/
├── emergencyContact.types.ts       # TypeScript type definitions
├── emergencyContact.constants.ts   # Query keys and constants
├── emergencyContact.transformers.ts # Data transformation utilities
├── useEmergencyContactQueries.ts   # React Query hooks
├── index.ts                        # Barrel exports
└── README.md                       # This file
```

## Type Definitions

### Core Types

- `EmergencyContact` - Complete contact record from database
- `EmergencyContactInsert` - Data shape for creating new contacts
- `EmergencyContactUpdate` - Partial data shape for updates
- `EmergencyContactUpdateData` - Update operation payload (id + updates)

## Query Hooks

### Fetching Data

#### `useEmergencyContacts(hotelId: string)`

Fetches all emergency contacts for a specific hotel.

```typescript
const { data: contacts, isLoading } = useEmergencyContacts(hotelId);
```

#### `useEmergencyContactById(contactId?: string)`

Fetches a single emergency contact by ID.

```typescript
const { data: contact } = useEmergencyContactById(contactId);
```

#### `useActiveEmergencyContacts(hotelId: string)`

Fetches only active emergency contacts for a hotel.

```typescript
const { data: activeContacts } = useActiveEmergencyContacts(hotelId);
```

#### `useEmergencyContactsByCreator(hotelId: string, creatorId?: string)`

Fetches contacts created by a specific user.

```typescript
const { data: myContacts } = useEmergencyContactsByCreator(hotelId, userId);
```

### Mutations

#### `useCreateEmergencyContact()`

Creates a new emergency contact.

```typescript
const createContact = useCreateEmergencyContact();

createContact.mutate({
  hotel_id: hotelId,
  contact_name: "Fire Department",
  phone_number: "911",
  is_active: true,
  created_by: userId,
});
```

#### `useUpdateEmergencyContact()`

Updates an existing contact.

```typescript
const updateContact = useUpdateEmergencyContact();

updateContact.mutate({
  id: contactId,
  updates: {
    phone_number: "555-0100",
    contact_name: "Updated Name",
  },
});
```

#### `useDeleteEmergencyContact()`

Deletes a contact.

```typescript
const deleteContact = useDeleteEmergencyContact();

deleteContact.mutate({ id: contactId, hotelId });
```

#### `useToggleEmergencyContactStatus()`

Toggles contact active status.

```typescript
const toggleStatus = useToggleEmergencyContactStatus();

toggleStatus.mutate({ id: contactId, isActive: false });
```

## Transformer Utilities

### Filtering Functions

- `filterActiveContacts(contacts)` - Filters for active contacts only
- `filterByCreator(contacts, creatorId)` - Filters by creator ID
- `searchEmergencyContacts(contacts, searchTerm)` - Searches by name or phone

### Sorting Functions

- `sortContactsByName(contacts)` - Alphabetical by name
- `sortContactsByDate(contacts)` - Newest first
- `sortContactsByPhone(contacts)` - By phone number
- `sortContactsByStatus(contacts)` - Active contacts first

### Grouping Functions

- `groupContactsByStatus(contacts)` - Groups into active/inactive
- `groupContactsByCreator(contacts)` - Groups by creator ID
- `groupContactsByLetter(contacts)` - Groups by first letter

### Data Extraction Functions

- `getUniqueCreators(contacts)` - Returns unique creator IDs
- `getActiveContacts(contacts)` - Returns active contacts only
- `getContactCounts(contacts)` - Returns active/inactive/total counts
- `getMostRecentContact(contacts)` - Returns newest contact

### Formatting Functions

- `formatPhoneNumber(phoneNumber)` - Formats phone display
- `formatContactSummary(contact)` - Creates summary string
- `getContactInitials(contactName)` - Extracts initials
- `formatContactName(contactName)` - Title case formatting

## Usage Examples

### Display Active Contacts with Search

```typescript
import {
  useActiveEmergencyContacts,
  searchEmergencyContacts,
  sortContactsByName,
} from "@/hooks/queries/hotel-management/emergency-contacts";

function EmergencyContactList({ hotelId }: { hotelId: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: contacts = [], isLoading } =
    useActiveEmergencyContacts(hotelId);

  const filteredContacts = useMemo(() => {
    const searched = searchEmergencyContacts(contacts, searchTerm);
    return sortContactsByName(searched);
  }, [contacts, searchTerm]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      {filteredContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
```

### Create New Contact

```typescript
import {
  useCreateEmergencyContact,
  DEFAULT_HOTEL_ID,
} from "@/hooks/queries/hotel-management/emergency-contacts";

function CreateContactForm() {
  const createContact = useCreateEmergencyContact();

  const handleSubmit = (formData: FormData) => {
    createContact.mutate(
      {
        hotel_id: DEFAULT_HOTEL_ID,
        contact_name: formData.name,
        phone_number: formData.phone,
        is_active: true,
        created_by: currentUserId,
      },
      {
        onSuccess: () => {
          toast.success("Contact created successfully");
          closeModal();
        },
        onError: (error) => {
          toast.error("Failed to create contact");
        },
      }
    );
  };

  return <ContactForm onSubmit={handleSubmit} />;
}
```

### Group Contacts by Status

```typescript
import {
  useEmergencyContacts,
  groupContactsByStatus,
  formatContactSummary,
} from "@/hooks/queries/hotel-management/emergency-contacts";

function ContactStatusGroups({ hotelId }: { hotelId: string }) {
  const { data: contacts = [] } = useEmergencyContacts(hotelId);
  const grouped = groupContactsByStatus(contacts);

  return (
    <div>
      <section>
        <h2>Active Contacts ({grouped.active.length})</h2>
        {grouped.active.map((contact) => (
          <div key={contact.id}>{formatContactSummary(contact)}</div>
        ))}
      </section>

      <section>
        <h2>Inactive Contacts ({grouped.inactive.length})</h2>
        {grouped.inactive.map((contact) => (
          <div key={contact.id}>{formatContactSummary(contact)}</div>
        ))}
      </section>
    </div>
  );
}
```

## Database Schema

The `emergency_contacts` table has the following structure:

- `id` (uuid, primary key)
- `hotel_id` (uuid, foreign key)
- `contact_name` (text)
- `phone_number` (text)
- `is_active` (boolean)
- `created_by` (uuid, foreign key to auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Query Key Structure

```typescript
{
  all: ['emergency_contacts'],
  lists: () => ['emergency_contacts', 'list'],
  list: (filters) => ['emergency_contacts', 'list', filters],
  details: () => ['emergency_contacts', 'detail'],
  detail: (id) => ['emergency_contacts', 'detail', id],
}
```

## Best Practices

1. **Use Transformers for Display Logic**: Keep display logic in transformers, not in components
2. **Memoize Filtered Data**: Use `useMemo` for expensive operations
3. **Handle Loading States**: Always handle loading and error states
4. **Invalidate Properly**: Mutations automatically invalidate relevant queries
5. **Use TypeScript**: All functions are fully typed for safety

## Related Modules

- `useEmergencyContactCRUD` - Page-level CRUD hook (for UI components)
- `Hotel/Emergency` - Emergency contact pages and components
