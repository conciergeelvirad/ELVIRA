# UI/UX Optimization & Real-time Subscriptions Guide

**Date:** October 11, 2025  
**Purpose:** Best practices for optimizing user experience and implementing real-time features

---

## 🎯 Two Key Requirements

1. **UI/UX Optimization** - Smooth, responsive user experience
2. **Real-time Database Subscriptions** - Live updates from Supabase

---

## 1. 🚀 UI/UX Optimization Strategies

### A. **Optimistic Updates** (Best for UX!)

Make UI respond instantly before API call completes.

#### Implementation:

```typescript
// In your mutation hook
export const useUpdateAbsenceRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase
        .from("absence_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // ✅ OPTIMISTIC UPDATE - UI updates immediately!
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: absenceRequestKeys.list({ hotelId: variables.hotelId }),
      });

      // Snapshot current data
      const previousData = queryClient.getQueryData(
        absenceRequestKeys.list({ hotelId: variables.hotelId })
      );

      // Optimistically update UI
      queryClient.setQueryData(
        absenceRequestKeys.list({ hotelId: variables.hotelId }),
        (old: AbsenceRequestWithStaff[]) =>
          old?.map((request) =>
            request.id === variables.id
              ? { ...request, status: variables.status }
              : request
          )
      );

      // Return context for rollback
      return { previousData };
    },

    // If error, rollback
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          absenceRequestKeys.list({ hotelId: variables.hotelId }),
          context.previousData
        );
      }
    },

    // Always refetch after mutation
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: absenceRequestKeys.list({ hotelId: variables.hotelId }),
      });
    },
  });
};
```

#### Usage in Component:

```typescript
const Component = () => {
  const updateStatus = useUpdateAbsenceRequestStatus();

  const handleApprove = () => {
    // UI updates INSTANTLY, then API call happens
    updateStatus.mutate({ id, status: "approved", hotelId });
  };

  return (
    <button onClick={handleApprove} disabled={updateStatus.isPending}>
      {updateStatus.isPending ? "Approving..." : "Approve"}
    </button>
  );
};
```

---

### B. **Loading States & Skeletons**

Show skeleton loaders instead of blank screens.

#### Create Skeleton Component:

```typescript
// src/components/common/SkeletonLoader.tsx
export const SkeletonLoader = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);
```

#### Usage:

```typescript
const Component = () => {
  const { data, isLoading } = useAbsenceRequests(hotelId);

  if (isLoading) return <SkeletonLoader rows={5} />;
  if (!data) return <EmptyState message="No data" />;

  return <TableView data={data} />;
};
```

---

### C. **Debouncing Search Inputs**

Prevent excessive API calls on every keystroke.

#### Create Hook:

```typescript
// src/hooks/ui/useDebouncedValue.ts
import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### Usage:

```typescript
const SearchComponent = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 300);

  // Only queries after 300ms of no typing
  const { data } = useSearchAbsenceRequests(debouncedSearch);

  return (
    <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

---

## 2. 🔄 Real-time Subscriptions

### Simple Implementation

#### Create Reusable Hook:

```typescript
// src/hooks/useTableSubscription.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useTableSubscription = ({
  table,
  filter,
  queryKey,
  enabled = true,
}: {
  table: string;
  filter?: string;
  queryKey: readonly unknown[];
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime:${table}${filter ? `:${filter}` : ""}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        (payload: any) => {
          console.log(`[Realtime] ${payload.eventType} on ${table}`);

          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filter, enabled, queryClient, queryKey]);
};
```

---

### Usage Examples

#### Example 1: Subscribe to Absence Requests

```typescript
// In HotelStaffPage.tsx
import { useTableSubscription } from "../../hooks/useTableSubscription";
import { absenceRequestKeys } from "../../hooks/queries/hotel-management/absence-requests";

export const HotelStaffPage = () => {
  const hotelId = "hotel-123";
  const { data: absenceRequests } = useAbsenceRequests(hotelId);

  // ✅ Real-time subscription - auto-updates when data changes
  useTableSubscription({
    table: "absence_requests",
    filter: `hotel_id=eq.${hotelId}`,
    queryKey: absenceRequestKeys.list({ hotelId }),
  });

  return <div>{/* Your UI */}</div>;
};
```

#### Example 2: Subscribe to Multiple Tables

```typescript
const DashboardPage = () => {
  const hotelId = "hotel-123";

  // Subscribe to staff changes
  useTableSubscription({
    table: "hotel_staff",
    filter: `hotel_id=eq.${hotelId}`,
    queryKey: staffKeys.list(hotelId),
  });

  // Subscribe to absence requests
  useTableSubscription({
    table: "absence_requests",
    filter: `hotel_id=eq.${hotelId}`,
    queryKey: absenceRequestKeys.list({ hotelId }),
  });

  // Subscribe to tasks
  useTableSubscription({
    table: "tasks",
    filter: `hotel_id=eq.${hotelId}`,
    queryKey: taskKeys.list(hotelId),
  });

  return <div>{/* Multi-source real-time dashboard */}</div>;
};
```

#### Example 3: Conditional Subscription

```typescript
const RequestDetailPage = ({ requestId }: { requestId: string }) => {
  const { data: request } = useAbsenceRequest(requestId);

  // Only subscribe when viewing details
  useTableSubscription({
    table: "absence_requests",
    filter: `id=eq.${requestId}`,
    queryKey: absenceRequestKeys.detail(requestId),
    enabled: !!requestId, // Only subscribe if requestId exists
  });

  return <div>{/* Request details */}</div>;
};
```

---

## 3. 🎨 UI/UX Best Practices

### Loading States

```typescript
// ✅ Good - Shows skeleton while loading
{
  isLoading && <SkeletonLoader />;
}
{
  !isLoading && data && <Content data={data} />;
}

// ❌ Bad - Blank screen
{
  data && <Content data={data} />;
}
```

### Error States

```typescript
// ✅ Good - Helpful error message
{
  error && <ErrorState message="Failed to load data" retry={() => refetch()} />;
}

// ❌ Bad - Generic or no error handling
{
  error && <div>Error</div>;
}
```

### Empty States

```typescript
// ✅ Good - Actionable empty state
{
  !data?.length && (
    <EmptyState
      icon={<Plus />}
      title="No absence requests"
      description="Create your first absence request"
      action={<Button onClick={onCreate}>Create Request</Button>}
    />
  );
}

// ❌ Bad - Just text
{
  !data?.length && <div>No data</div>;
}
```

### Optimistic Updates

```typescript
// ✅ Good - Instant feedback
<button onClick={() => mutate()}>
  {isPending && <Spinner />}
  Approve
</button>

// ❌ Bad - Disabled during mutation
<button disabled={isPending} onClick={() => mutate()}>
  Approve
</button>
```

---

## 4. 📦 Recommended Component Structure

```
src/
├── hooks/
│   ├── ui/
│   │   ├── useDebouncedValue.ts
│   │   ├── useOptimisticUpdate.ts
│   │   └── useLoadingState.ts
│   ├── useTableSubscription.ts
│   └── queries/
│       └── hotel-management/
│           └── absence-requests/
│               ├── useAbsenceRequestQueries.ts (with optimistic updates)
│               └── ...
├── components/
│   └── common/
│       ├── SkeletonLoader.tsx
│       ├── ErrorState.tsx
│       ├── EmptyState.tsx
│       └── LoadingSpinner.tsx
```

---

## 5. ✅ Implementation Checklist

### UI/UX Optimization:

- [ ] Implement optimistic updates for mutations
- [ ] Add skeleton loaders for all loading states
- [ ] Debounce search inputs (300ms delay)
- [ ] Create reusable loading/error/empty state components
- [ ] Add loading indicators on buttons during mutations
- [ ] Implement error boundaries for error handling

### Real-time Subscriptions:

- [ ] Create `useTableSubscription` hook
- [ ] Enable real-time on Supabase tables (Database → Replication)
- [ ] Subscribe to critical tables (absence_requests, hotel_staff, tasks)
- [ ] Test subscription cleanup on component unmount
- [ ] Add console logging for debugging
- [ ] Consider rate limiting for high-frequency updates

---

## 6. 🚀 Quick Start

### Step 1: Enable Realtime in Supabase

```sql
-- In Supabase SQL Editor
ALTER PUBLICATION supabase_realtime ADD TABLE absence_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE hotel_staff;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

### Step 2: Create the Hook

Copy the `useTableSubscription` hook code above into:
`src/hooks/useTableSubscription.ts`

### Step 3: Use in Your Component

```typescript
import { useTableSubscription } from "../../hooks/useTableSubscription";

// In your component
useTableSubscription({
  table: "absence_requests",
  filter: `hotel_id=eq.${hotelId}`,
  queryKey: absenceRequestKeys.list({ hotelId }),
});
```

### Step 4: Test

1. Open your page in two browser windows
2. Make a change in one window
3. See the update appear instantly in the other window!

---

## 7. 📊 Performance Considerations

### Do:

- ✅ Use debouncing for search (300ms)
- ✅ Use optimistic updates for instant feedback
- ✅ Subscribe only to necessary tables
- ✅ Unsubscribe when component unmounts
- ✅ Use filters to limit subscription scope

### Don't:

- ❌ Subscribe to entire tables without filters
- ❌ Create multiple subscriptions to same table
- ❌ Forget to clean up subscriptions
- ❌ Query on every keystroke without debouncing
- ❌ Show blank screens during loading

---

## 8. 🎯 Summary

**For UI/UX:**

- Use **optimistic updates** for instant feedback
- Show **skeleton loaders** instead of blank screens
- **Debounce** search inputs
- Provide helpful **error** and **empty** states

**For Real-time:**

- Create a **reusable subscription hook**
- Subscribe with **filters** for performance
- **Cleanup** subscriptions on unmount
- Test with **multiple browser windows**

---

**Next Steps:**

1. Implement `useTableSubscription` hook
2. Add to critical pages (HotelStaffPage, Dashboard, etc.)
3. Add optimistic updates to all mutations
4. Create skeleton loaders for all loading states

**Questions?** Check the code examples above or test in your app!
