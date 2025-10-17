# Absence Requests Module

**Location:** `src/hooks/queries/hotel-management/absence-requests/`

---

## 📁 File Structure

```
absence-requests/
├── index.ts                          ← Centralized exports (use this!)
├── absenceRequest.types.ts           ← Type definitions
├── absenceRequest.constants.ts       ← Query keys & constants
├── absenceRequest.transformers.ts    ← Data transformation logic
└── useAbsenceRequestQueries.ts       ← React Query hooks
```

---

## 🎯 Design Principles

This module follows **best practices** for code organization:

### ✅ Separation of Concerns

- **Types** - Only type definitions (`.types.ts`)
- **Constants** - Query keys, defaults, patterns (`.constants.ts`)
- **Transformers** - Pure functions for data transformation (`.transformers.ts`)
- **Queries** - React hooks for data fetching (`useAbsenceRequestQueries.ts`)

### ✅ Single Responsibility

Each file has one clear purpose, making it easy to:

- Find what you're looking for
- Test individual functions
- Modify without breaking other parts
- Reuse in different contexts

### ✅ Clean Imports

Use the index file for all imports:

```typescript
// ✅ Good - Clean, organized
import {
  useAbsenceRequests,
  AbsenceRequestWithStaff,
  transformAbsenceRequest,
} from "./absence-requests";

// ❌ Avoid - Direct file imports
import { useAbsenceRequests } from "./absence-requests/useAbsenceRequestQueries";
import { AbsenceRequestWithStaff } from "./absence-requests/absenceRequest.types";
```

---

## 📖 Usage Guide

### 1. Types (`absenceRequest.types.ts`)

**Contains:**

- `AbsenceRequest` - Base database type
- `AbsenceRequestInsert` - For creating new requests
- `AbsenceRequestUpdate` - For updating requests
- `ExtendedAbsenceRequest` - With joined staff data
- `AbsenceRequestWithStaff` - UI-optimized format
- Enums: `ABSENCE_REQUEST_TYPES`, `ABSENCE_REQUEST_STATUSES`

**Example:**

```typescript
import type { AbsenceRequestWithStaff } from "./absence-requests";

const request: AbsenceRequestWithStaff = {
  id: "123",
  staffName: "John Doe",
  requestType: "vacation",
  status: "pending",
  // ... more fields
};
```

### 2. Constants (`absenceRequest.constants.ts`)

**Contains:**

- `absenceRequestKeys` - React Query cache keys
- `DEFAULT_HOTEL_ID` - Fallback hotel ID
- `ABSENCE_REQUEST_WITH_STAFF_SELECT` - Supabase select pattern

**Example:**

```typescript
import { absenceRequestKeys } from "./absence-requests";

// Invalidate all absence requests for a hotel
queryClient.invalidateQueries({
  queryKey: absenceRequestKeys.list({ hotelId: "..." }),
});
```

### 3. Transformers (`absenceRequest.transformers.ts`)

**Contains:**

- `transformAbsenceRequest()` - Transform single request
- `transformAbsenceRequests()` - Transform array
- `getStaffFullName()` - Format staff name
- `formatAbsenceDateRange()` - Format date display
- `calculateAbsenceDuration()` - Calculate days

**Example:**

```typescript
import {
  calculateAbsenceDuration,
  formatAbsenceDateRange,
} from "./absence-requests";

const days = calculateAbsenceDuration("2024-01-01", "2024-01-05");
// => 5

const range = formatAbsenceDateRange("2024-01-01", "2024-01-05");
// => "Jan 1 - Jan 5, 2024"
```

### 4. Query Hooks (`useAbsenceRequestQueries.ts`)

**Query Hooks:**

- `useAbsenceRequests(hotelId)` - Get all requests for hotel
- `useAbsenceRequestsByStatus(status, hotelId)` - Filter by status
- `useAbsenceRequestsByStaff(staffId)` - Get staff's requests
- `useAbsenceRequest(requestId)` - Get single request

**Mutation Hooks:**

- `useCreateAbsenceRequest()` - Create new request
- `useUpdateAbsenceRequest()` - Update request
- `useUpdateAbsenceRequestStatus()` - Change status only
- `useDeleteAbsenceRequest()` - Delete request

**Example:**

```typescript
import {
  useAbsenceRequests,
  useCreateAbsenceRequest,
} from "./absence-requests";

function AbsenceRequestsPage() {
  const hotelId = "hotel-123";

  // Query
  const { data: requests, isLoading } = useAbsenceRequests(hotelId);

  // Mutation
  const createRequest = useCreateAbsenceRequest();

  const handleCreate = async (formData) => {
    await createRequest.mutateAsync({
      hotel_id: hotelId,
      staff_id: "staff-456",
      request_type: "vacation",
      start_date: "2024-01-01",
      end_date: "2024-01-05",
      status: "pending",
      data_processing_consent: true,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {requests?.map((request) => (
        <div key={request.id}>
          {request.staffName} - {request.requestType}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Data Flow

```
1. Component calls hook
   ↓
2. Hook executes Supabase query
   ↓
3. Data comes back with joins (ExtendedAbsenceRequest)
   ↓
4. Transformer converts to UI format (AbsenceRequestWithStaff)
   ↓
5. Component receives clean, typed data
```

---

## 🧪 Testing Benefits

Each file can be tested independently:

### Types (No testing needed)

Types are checked by TypeScript compiler

### Constants

```typescript
describe("absenceRequestKeys", () => {
  it("should generate correct cache keys", () => {
    expect(absenceRequestKeys.list({ hotelId: "123" })).toEqual([
      "absence-requests",
      "list",
      { hotelId: "123" },
    ]);
  });
});
```

### Transformers (Pure functions - easy to test!)

```typescript
describe("transformAbsenceRequest", () => {
  it("should flatten staff data", () => {
    const input: ExtendedAbsenceRequest = {
      /* ... */
    };
    const output = transformAbsenceRequest(input);
    expect(output.staffName).toBe("John Doe");
  });
});

describe("calculateAbsenceDuration", () => {
  it("should calculate days correctly", () => {
    const days = calculateAbsenceDuration("2024-01-01", "2024-01-05");
    expect(days).toBe(5);
  });
});
```

### Query Hooks (Mock Supabase)

```typescript
describe("useAbsenceRequests", () => {
  it("should fetch and transform requests", async () => {
    // Mock supabase
    // Test hook
    // Assert results
  });
});
```

---

## 📊 Benefits Over Previous Structure

### Before (Single 400+ line file)

```typescript
// useAbsenceRequestQueries.ts (400 lines)
// - Types mixed with logic
// - Hard to find specific functions
// - Difficult to test transformers
// - Everything coupled together
```

### After (Organized modules)

```
✅ Types:        ~120 lines (easy to reference)
✅ Constants:    ~50 lines  (clear configuration)
✅ Transformers: ~130 lines (pure, testable functions)
✅ Queries:      ~300 lines (focused on data fetching)
✅ Index:        ~50 lines  (clean exports)
```

**Total:** Same code, but 5x better organized!

---

## 🚀 Next Steps

Apply this same structure to other query files:

1. **staff/** - `useStaffQueries.ts`
2. **qa-recommendations/** - `useQARecommendationQueries.ts`
3. **recommended-places/** - `useRecommendedPlaceQueries.ts`
4. **guest-conversations/** - `useGuestConversationQueries.ts`

Each following the same pattern:

- `[resource].types.ts`
- `[resource].constants.ts`
- `[resource].transformers.ts`
- `use[Resource]Queries.ts`
- `index.ts`

---

## 📚 Additional Resources

- See `QUERY_REFACTORING_GUIDE.md` for overall refactoring strategy
- See `queryUtils.ts` for shared utilities
- See React Query docs: https://tanstack.com/query/latest

---

**Status:** ✅ Implemented and tested  
**Zero TypeScript errors**  
**Ready to use in production**
