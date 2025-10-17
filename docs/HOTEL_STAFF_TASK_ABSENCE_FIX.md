# Hotel Staff Page - Task & Absence Request Fix

## Issue Description

When creating tasks or absence requests in the Hotel Staff page, users were encountering an error:

- **Error**: "useCreateAbsenceRequest.ts:30 is not defined"
- **Root Cause**: The `transformCreate` function was receiving `undefined` for `staffId`, causing the mutation to fail

## Root Causes Identified

1. **Missing staffContext Parameter**: The `CRUDWithMutationsConfig` interface required a `staffContext` parameter, but it wasn't being passed by any CRUD hooks
2. **Invalid getHotelId Implementation**: The `getHotelId()` function was trying to call `useHotelStaff()` hook inside a non-React function
3. **No Default Value for staffId**: Non-admin users creating absence requests didn't have their `staffId` automatically set

## Fixes Applied

### 1. Made staffContext Optional

**File**: `src/pages/Hotel/hooks/useCRUDWithMutations.ts`

Changed the `staffContext` from required to optional since it wasn't being used:

```typescript
// Before
staffContext: StaffContext;

// After
staffContext?: StaffContext;
```

### 2. Fixed getHotelId Implementation

**File**: `src/pages/Hotel/hooks/useCRUDWithMutations.ts`

Created a caching mechanism instead of calling React hooks in a regular function:

```typescript
let cachedHotelId: string = "";

export const setHotelId = (hotelId: string) => {
  cachedHotelId = hotelId;
};

export const getHotelId = (): string => {
  return cachedHotelId;
};
```

### 3. Set Hotel ID in HotelStaffPage

**File**: `src/pages/Hotel/HotelStaffPage.tsx`

Added effect to cache the hotel ID when component mounts:

```typescript
import { setHotelId } from "./hooks/useCRUDWithMutations";
import { useEffect } from "react";

// Inside component
useEffect(() => {
  if (hotelId) {
    setHotelId(hotelId);
  }
}, [hotelId]);
```

### 4. Enhanced Absence Request Form for Non-Admins

**File**: `src/pages/Hotel/components/staff/absence/AbsenceRequestFormFields.ts`

Added default value and options for non-admin users:

```typescript
{
  key: "staffId",
  label: "Staff Member",
  type: "select",
  placeholder: isAdminOrManager ? "Select staff member" : "Current User",
  required: true,
  disabled: !isAdminOrManager,
  defaultValue: !isAdminOrManager && currentStaffId ? currentStaffId : undefined,
  options: isAdminOrManager
    ? staffOptions
    : currentStaffId
      ? [{ value: currentStaffId, label: "Current User" }]
      : [],
  // ...
}
```

### 5. Added Enhanced Logging

**File**: `src/pages/Hotel/hooks/useAbsenceRequestsCRUD.tsx`

Added comprehensive logging to track data flow and identify issues:

```typescript
transformCreate: (data) => {
  console.log("[AbsenceRequest] transformCreate - Raw form data:", data);

  const staffId = (data.staffId as string) || "";
  const hotelId = getHotelId();

  if (!staffId) {
    console.error("[AbsenceRequest] transformCreate - Missing staffId:", data);
    throw new Error("Staff ID is required");
  }

  if (!hotelId) {
    console.error("[AbsenceRequest] transformCreate - Missing hotelId");
    throw new Error("Hotel ID is required");
  }

  const transformed = {
    /* ... */
  };
  console.log(
    "[AbsenceRequest] transformCreate - Transformed data:",
    transformed
  );
  return transformed;
};
```

## How It Works Now

### For Tasks:

1. Admin/Manager selects a staff member from dropdown
2. Staff ID is captured from form
3. `transformCreate` receives the staff ID
4. Hotel ID is retrieved from cache via `getHotelId()`
5. Task is created with both IDs

### For Absence Requests:

#### Admin/Manager:

1. Selects any staff member from dropdown
2. Staff ID is captured from form
3. Request is created with selected staff ID

#### Regular Staff:

1. Form automatically shows "Current User" (disabled)
2. `currentStaffId` is set as `defaultValue`
3. Staff can only create requests for themselves
4. Their staff ID is automatically included

## Testing

### Test Creating a Task:

1. Navigate to Hotel Staff → Task Assignment tab
2. Click "Add Task"
3. Fill in task details and select a staff member
4. Click "Create"
5. ✅ Task should be created successfully

### Test Creating Absence Request (Admin):

1. Navigate to Hotel Staff → Absence tab
2. Click "Add Absence Request"
3. Select a staff member from dropdown
4. Fill in dates and request type
5. Click "Create"
6. ✅ Request should be created successfully

### Test Creating Absence Request (Regular Staff):

1. Log in as regular staff member
2. Navigate to Hotel Staff → Absence tab
3. Click "Add Absence Request"
4. Staff Member field should show "Current User" (disabled)
5. Fill in dates and request type
6. Click "Create"
7. ✅ Request should be created successfully for current user

## Console Logs to Monitor

When creating an absence request, you should see:

```
[AbsenceRequest] transformCreate - Raw form data: {...}
[AbsenceRequest] transformCreate - Transformed data: {...}
```

If there's an error, you'll see:

```
[AbsenceRequest] transformCreate - Missing staffId: {...}
```

or

```
[AbsenceRequest] transformCreate - Missing hotelId
```

## Files Modified

1. `src/pages/Hotel/hooks/useCRUDWithMutations.ts` - Made staffContext optional, fixed getHotelId
2. `src/pages/Hotel/HotelStaffPage.tsx` - Added setHotelId call
3. `src/pages/Hotel/hooks/useAbsenceRequestsCRUD.tsx` - Added validation and logging
4. `src/pages/Hotel/components/staff/absence/AbsenceRequestFormFields.ts` - Added defaultValue for non-admins

## Summary

The fix ensures that:

- ✅ `staffId` is always provided (either from dropdown or current user)
- ✅ `hotelId` is always available through caching mechanism
- ✅ Proper error messages when data is missing
- ✅ Non-admin staff can create requests for themselves
- ✅ Admin/Manager can create requests for any staff member
- ✅ All existing functionality is preserved
