# Staff Schedule Implementation

## Overview

Implementation of staff schedule management feature with database queries and UI components.

## Recent Updates (October 16, 2025)

### ✅ Button Placement & Design Consistency

- Moved action buttons to CalendarHeader component
- Aligned "Send Calendar" and "Create Schedule" buttons next to Month/Week toggle
- "Create Schedule" uses `variant="dark"` with Plus icon (matches "Add Staff Member" pattern)
- "Send Calendar" uses `variant="outline"` with Send icon
- Button sizing consistent with other CRUD operations (`size="sm"`)

### ✅ Mock Data Removal

- Removed all sample/mock schedule data from components
- Calendar ready for real data integration from database queries
- Empty state displays when no schedules are available

**Button Layout:**

```
[October 2025] [Today]  |  [Month][Week]  [<][>]  [Send Calendar]  [Create Schedule]
```

## Files Created/Updated

### 1. Database Queries

**File:** `src/hooks/queries/hotel-management/staff/useStaffScheduleQueries.ts`

Complete React Query hooks for staff_schedules table:

**Types:**

- `StaffSchedule` - Full schedule record
- `StaffScheduleInsert` - For creating schedules
- `StaffScheduleUpdate` - For updating schedules

**Query Hooks:**

- `useStaffSchedules(hotelId)` - Get all schedules for a hotel
- `useStaffSchedulesByStaff(staffId)` - Get schedules for specific staff member
- `useStaffSchedulesByDateRange(hotelId, startDate, endDate)` - Filter by date range
- `useStaffSchedulesByStatus(hotelId, status)` - Filter by status
- `useStaffSchedule(id)` - Get single schedule by ID

**Mutation Hooks:**

- `useCreateStaffSchedule()` - Create new schedule
- `useUpdateStaffSchedule()` - Update existing schedule
- `useConfirmStaffSchedule()` - Confirm a schedule (sets is_confirmed, confirmed_by, confirmed_at)
- `useCancelStaffSchedule()` - Cancel schedule
- `useCompleteStaffSchedule()` - Mark as completed
- `useDeleteStaffSchedule()` - Delete schedule

### 2. Create Schedule Modal

**File:** `src/pages/Hotel/components/staff/calendar/CreateScheduleModal.tsx`

Modal form for creating staff schedules with:

- **Staff Selection** - Dropdown with all staff members
- **Date Range** - Start and finish dates
- **Time Range** - Shift start and end times (time pickers)
- **Status** - SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
- **Notes** - Optional text field (max 1000 characters)

Features:

- Form validation
- Loading states
- Auto-reset on success
- Character counter for notes
- Responsive grid layout

### 3. Updated Calendar Components

**Files:**

- `src/pages/Hotel/components/staff/calendar/CalendarHeader.tsx`
- `src/pages/Hotel/components/staff/calendar/Calendar.tsx`
- `src/pages/Hotel/components/staff/calendar/StaffScheduleCalendar.tsx`

**Changes:**

- Added action button props to CalendarHeader (`onSendCalendar`, `onCreateSchedule`)
- Buttons positioned in header alongside Month/Week toggle and navigation
- Removed all mock schedule data
- Calendar ready for real data from `useStaffSchedules` query
- Maintains consistent design with other management pages

## Database Schema Reference

The staff_schedules table includes:

- `id` - Primary key (UUID)
- `staff_id` - Foreign key to hotel_staff
- `hotel_id` - Foreign key to hotels
- `schedule_start_date` - Date (required)
- `schedule_finish_date` - Date (required)
- `shift_start` - Time (required)
- `shift_end` - Time (required)
- `status` - SCHEDULED | CONFIRMED | COMPLETED | CANCELLED
- `notes` - Optional text (max 1000 chars)
- `is_confirmed` - Boolean
- `confirmed_by` - Foreign key to profiles
- `confirmed_at` - Timestamp
- `created_by` - Foreign key to profiles
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Constraints:**

- Unique constraint on (staff_id, schedule_start_date)
- Status must be one of the allowed values
- Confirmation requires all three: is_confirmed=true, confirmed_by, confirmed_at

## UI Components Used

All components follow the existing design system:

- `Button` - Common button component with variants and icons
- `FormModal` - Modal wrapper with form handling
- Standard HTML inputs with consistent styling
- Lucide React icons (Send, Plus)

## Next Steps

1. **Integrate Real Data** - Replace sample schedules in StaffScheduleCalendar with real data from useStaffSchedules
2. **Implement Send Calendar** - Add email/notification functionality for the Send Calendar button
3. **Add Edit/Delete** - Add ability to edit and delete schedules from the calendar view
4. **Visual Improvements** - Display schedules in a more visual calendar format (grid/timeline)
5. **Conflict Detection** - Check for scheduling conflicts (overlapping shifts)
6. **Bulk Operations** - Add ability to create multiple schedules at once

## Testing Checklist

- [ ] Create a schedule
- [ ] Verify schedule appears in calendar
- [ ] Test form validation (required fields)
- [ ] Test date range validation
- [ ] Test character limit on notes
- [ ] Verify schedule is saved to database
- [ ] Test responsive layout on mobile
- [ ] Verify only authorized users can create schedules
