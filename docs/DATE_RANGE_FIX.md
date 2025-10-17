# Date Range Display Fix

## Problem

Schedules with multi-day ranges (e.g., Oct 16-19, Oct 20-26) were only showing on the start date instead of spanning the entire range.

## Root Cause

The `schedulesByDate` transformation was only using `schedule_start_date` as the key, ignoring the `schedule_finish_date`.

## Solution

### Before:

```typescript
schedules.forEach((schedule) => {
  const dateKey = schedule.schedule_start_date; // ❌ Only start date
  grouped[dateKey].push(displayText);
});
```

### After:

```typescript
schedules.forEach((schedule) => {
  const startDate = new Date(schedule.schedule_start_date);
  const finishDate = new Date(schedule.schedule_finish_date);

  // ✅ Loop through entire date range
  const currentDate = new Date(startDate);
  while (currentDate <= finishDate) {
    const dateKey = currentDate.toISOString().split("T")[0];
    grouped[dateKey].push(displayText);
    currentDate.setDate(currentDate.getDate() + 1);
  }
});
```

## Changes Made

### 1. Calendar Display (`schedulesByDate`)

- Now loops through each date from start to finish
- Adds the schedule to every date in the range
- Schedule appears as a pill on all days it covers

### 2. Selected Date Filter (`selectedDateSchedules`)

- Changed from exact match to range check
- Now shows all schedules where: `selectedDate >= startDate && selectedDate <= finishDate`
- Correctly displays schedules that span multiple days

## Example

**Database Schedule:**

```
Start: 2025-10-20
Finish: 2025-10-26
Staff: Martin Paris
Time: 18:12 - 21:12
```

**Before Fix:**

- ❌ Only appears on October 20

**After Fix:**

- ✅ Appears on October 20, 21, 22, 23, 24, 25, 26

## Testing

Test with different scenarios:

1. ✅ Single day schedule (start = finish)
2. ✅ Multi-day schedule (start < finish)
3. ✅ Click on any date in range - shows schedule detail
4. ✅ Schedule pills appear on all dates in range

## Impact

- Schedule visibility improved
- Multi-day shifts properly represented
- Users can see schedule span at a glance
- Detail panel shows correct schedules for any date in range
