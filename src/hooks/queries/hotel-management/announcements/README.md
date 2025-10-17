# Announcement Module

Comprehensive hotel announcement management system for communicating important information to guests and staff.

## Overview

The announcement module handles hotel announcement operations including:

- Creating and managing announcements
- Active/inactive status tracking
- Date-based organization
- Search and filtering capabilities
- Hard deletion with cache management

## File Structure

```
announcements/
├── announcement.types.ts          # TypeScript type definitions
├── announcement.constants.ts      # Query keys
├── announcement.transformers.ts   # Data transformation utilities
├── useAnnouncementQueries.ts      # React Query hooks
├── index.ts                       # Barrel exports
└── README.md                      # This file
```

## Types

### Core Types

- **`Announcement`** - Complete announcement record
- **`AnnouncementInsert`** - Type for creating new announcements
- **`AnnouncementUpdate`** - Type for updating announcements
- **`AnnouncementDeletionData`** - Deletion parameters
- **`AnnouncementPriority`** - Priority level enum (for future use)
- **`AnnouncementStatus`** - Status enum (for future use)
- **`AnnouncementAudience`** - Target audience enum (for future use)

## Query Hooks

### useAnnouncements

Fetches all announcements for a hotel, ordered by creation date (newest first).

```tsx
import { useAnnouncements } from "@/hooks/queries/hotel-management/announcements";

function AnnouncementList({ hotelId }: Props) {
  const { data: announcements, isLoading } = useAnnouncements(hotelId);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {announcements?.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
```

### useAnnouncementById

Fetches a single announcement by ID.

```tsx
import { useAnnouncementById } from "@/hooks/queries/hotel-management/announcements";

function AnnouncementDetails({ announcementId }: Props) {
  const { data: announcement, isLoading } = useAnnouncementById(announcementId);

  if (isLoading) return <LoadingSpinner />;
  if (!announcement) return <NotFound />;

  return <AnnouncementView announcement={announcement} />;
}
```

## Mutation Hooks

### useCreateAnnouncement

Creates a new announcement.

```tsx
import { useCreateAnnouncement } from "@/hooks/queries/hotel-management/announcements";

function CreateAnnouncementForm({ hotelId }: Props) {
  const createAnnouncement = useCreateAnnouncement();

  const handleSubmit = (formData) => {
    createAnnouncement.mutate(
      {
        hotel_id: hotelId,
        title: "Pool Maintenance",
        description:
          "The swimming pool will be closed for maintenance from 8am to 12pm on Friday.",
        is_active: true,
      },
      {
        onSuccess: () => {
          toast.success("Announcement created successfully");
          navigate("/announcements");
        },
        onError: (error) => {
          toast.error(`Failed to create announcement: ${error.message}`);
        },
      }
    );
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### useUpdateAnnouncement

Updates an existing announcement.

```tsx
import { useUpdateAnnouncement } from "@/hooks/queries/hotel-management/announcements";

function EditAnnouncementForm({ announcement }: Props) {
  const updateAnnouncement = useUpdateAnnouncement();

  const handleSubmit = (updates) => {
    updateAnnouncement.mutate(
      {
        id: announcement.id,
        title: updates.title,
        description: updates.description,
        is_active: updates.isActive,
      },
      {
        onSuccess: () => {
          toast.success("Announcement updated successfully");
        },
      }
    );
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### useDeleteAnnouncement

Permanently deletes an announcement.

```tsx
import { useDeleteAnnouncement } from "@/hooks/queries/hotel-management/announcements";

function DeleteAnnouncementButton({ announcementId, hotelId }: Props) {
  const deleteAnnouncement = useDeleteAnnouncement();

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this announcement? This action cannot be undone."
      )
    ) {
      deleteAnnouncement.mutate(
        {
          id: announcementId,
          hotelId: hotelId,
        },
        {
          onSuccess: () => {
            toast.success("Announcement deleted successfully");
          },
        }
      );
    }
  };

  return (
    <Button onClick={handleDelete} variant="danger">
      Delete Announcement
    </Button>
  );
}
```

**Note:** This is a hard delete operation that permanently removes the announcement from the database.

## Transformer Utilities

### Filtering

- **`filterActiveAnnouncements(announcements)`** - Only active announcements
- **`filterByCreator(announcements, creatorId)`** - Filter by creator
- **`filterWithDescription(announcements)`** - Announcements with descriptions
- **`filterByDateRange(announcements, startDate, endDate)`** - Filter by date range
- **`filterRecentAnnouncements(announcements, days)`** - Recent announcements (default 7 days)
- **`searchAnnouncements(announcements, searchTerm)`** - Search by title or description

```tsx
import {
  filterActiveAnnouncements,
  filterRecentAnnouncements,
  searchAnnouncements,
} from "@/hooks/queries/hotel-management/announcements";

const { data: allAnnouncements } = useAnnouncements(hotelId);

// Get only active announcements
const activeAnnouncements = filterActiveAnnouncements(allAnnouncements || []);

// Get announcements from last 7 days
const recentAnnouncements = filterRecentAnnouncements(
  allAnnouncements || [],
  7
);

// Search announcements
const [searchTerm, setSearchTerm] = useState("");
const searchedAnnouncements = searchAnnouncements(
  allAnnouncements || [],
  searchTerm
);
```

### Sorting

- **`sortAnnouncementsByDate(announcements)`** - Sort by date (newest first)
- **`sortAnnouncementsByStatus(announcements)`** - Sort by active status (active first)
- **`sortAnnouncementsByTitle(announcements)`** - Sort alphabetically
- **`sortAnnouncementsByUpdate(announcements)`** - Sort by last update

```tsx
import {
  sortAnnouncementsByDate,
  sortAnnouncementsByTitle,
} from "@/hooks/queries/hotel-management/announcements";

const { data: announcements } = useAnnouncements(hotelId);

// Sort by date (newest first)
const byDate = sortAnnouncementsByDate(announcements || []);

// Sort alphabetically
const byTitle = sortAnnouncementsByTitle(announcements || []);
```

### Grouping

- **`groupAnnouncementsByMonth(announcements)`** - Group by month
- **`groupAnnouncementsByDate(announcements)`** - Group by day
- **`groupAnnouncementsByStatus(announcements)`** - Group by active/inactive

```tsx
import {
  groupAnnouncementsByMonth,
  groupAnnouncementsByStatus,
} from "@/hooks/queries/hotel-management/announcements";

const { data: announcements } = useAnnouncements(hotelId);

// Group by month
const byMonth = groupAnnouncementsByMonth(announcements || []);
// { '2025-01': [...], '2025-02': [...] }

// Group by status
const byStatus = groupAnnouncementsByStatus(announcements || []);
// { active: [...], inactive: [...] }
```

### Data Extraction

- **`getUniqueCreators(announcements)`** - Get all unique creators
- **`getAnnouncementCountByMonth(announcements)`** - Count by month
- **`getMostRecentAnnouncement(announcements)`** - Get most recent
- **`countActiveAnnouncements(announcements)`** - Count active announcements

```tsx
import {
  getMostRecentAnnouncement,
  countActiveAnnouncements,
} from "@/hooks/queries/hotel-management/announcements";

const { data: announcements } = useAnnouncements(hotelId);

// Get most recent announcement
const latest = getMostRecentAnnouncement(announcements || []);

// Count active announcements
const activeCount = countActiveAnnouncements(announcements || []);
```

### Status Utilities

- **`isRecentAnnouncement(announcement)`** - Check if posted in last 24 hours
- **`getAnnouncementAge(announcement)`** - Get age in days
- **`getPriorityColor(priority)`** - Get color for priority badge (future use)
- **`getPriorityIcon(priority)`** - Get icon for priority (future use)

```tsx
import {
  isRecentAnnouncement,
  getAnnouncementAge,
} from "@/hooks/queries/hotel-management/announcements";

function AnnouncementBadge({ announcement }) {
  const isNew = isRecentAnnouncement(announcement);
  const age = getAnnouncementAge(announcement);

  return (
    <div>
      {isNew && <Badge color="blue">New</Badge>}
      <span>{age} days ago</span>
    </div>
  );
}
```

### Formatting

- **`formatAnnouncementDate(announcement)`** - Format date for display
- **`formatAnnouncementSummary(announcement)`** - Format full summary
- **`truncateContent(content, maxLength)`** - Truncate long content
- **`formatPriorityName(priority)`** - Format priority name (future use)

```tsx
import {
  formatAnnouncementDate,
  truncateContent,
} from "@/hooks/queries/hotel-management/announcements";

function AnnouncementCard({ announcement }) {
  const date = formatAnnouncementDate(announcement);
  const preview = truncateContent(announcement.description, 100);

  return (
    <Card>
      <h3>{announcement.title}</h3>
      <p>{preview}</p>
      <small>{date}</small>
    </Card>
  );
}
```

## Real-time Subscription Example

```tsx
import {
  useAnnouncements,
  announcementKeys,
} from "@/hooks/queries/hotel-management/announcements";
import { useTableSubscription } from "@/hooks/useTableSubscription";
import { useQueryClient } from "@tanstack/react-query";

function AnnouncementList({ hotelId }: Props) {
  const queryClient = useQueryClient();
  const { data: announcements, isLoading } = useAnnouncements(hotelId);

  // Subscribe to real-time updates
  useTableSubscription({
    table: "announcements",
    event: "*",
    filter: `hotel_id=eq.${hotelId}`,
    callback: () => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.list(hotelId),
      });
    },
  });

  return <AnnouncementFeed announcements={announcements} />;
}
```

## Search with Debouncing

```tsx
import {
  useAnnouncements,
  searchAnnouncements,
} from "@/hooks/queries/hotel-management/announcements";
import { useDebouncedValue } from "@/hooks/ui/useDebouncedValue";

function SearchableAnnouncementList({ hotelId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const { data: announcements } = useAnnouncements(hotelId);
  const filteredAnnouncements = searchAnnouncements(
    announcements || [],
    debouncedSearch
  );

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <AnnouncementList announcements={filteredAnnouncements} />
    </div>
  );
}
```

## Filter by Date Range

```tsx
import {
  useAnnouncements,
  filterByDateRange,
} from "@/hooks/queries/hotel-management/announcements";

function DateRangeFilter({ hotelId }: Props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { data: announcements } = useAnnouncements(hotelId);
  const filtered = filterByDateRange(announcements || [], startDate, endDate);

  return (
    <div>
      <DatePicker value={startDate} onChange={setStartDate} />
      <DatePicker value={endDate} onChange={setEndDate} />
      <AnnouncementList announcements={filtered} />
    </div>
  );
}
```

## Best Practices

### 1. Active Status Management

Use the is_active field to hide announcements without deleting them:

```tsx
// Deactivate instead of delete (recommended)
updateAnnouncement.mutate({
  id: announcementId,
  is_active: false,
});

// Only delete if you're sure
deleteAnnouncement.mutate({ id: announcementId, hotelId });
```

### 2. Clear Titles and Descriptions

Write concise, informative announcements:

```tsx
// Good
{
  title: 'Pool Maintenance Friday',
  description: 'The pool will be closed from 8am-12pm on Friday, Oct 15.',
}

// Bad
{
  title: 'Announcement',
  description: 'Something is happening soon.',
}
```

### 3. Regular Cleanup

Periodically archive or delete old announcements:

```tsx
const oldAnnouncements = filterByDateRange(
  announcements || [],
  new Date("2024-01-01"),
  new Date("2024-12-31")
);
```

### 4. Error Handling

Always handle errors in mutations:

```tsx
createAnnouncement.mutate(data, {
  onSuccess: () => {
    toast.success("Announcement created");
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`);
  },
});
```

## Migration Guide

If you're migrating from the old `useAnnouncementQueries.ts`:

```tsx
// Old import
import { useAnnouncements } from "../useAnnouncementQueries";

// New import
import { useAnnouncements } from "../announcements";

// All hooks maintain the same API
```

The API is fully backward compatible, with additional utility functions available for enhanced functionality.
