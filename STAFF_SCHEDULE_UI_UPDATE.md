# Staff Schedule UI Update - October 16, 2025

## Changes Summary

### ✅ Button Repositioning

Moved action buttons from standalone section to the CalendarHeader component, aligning them with Month/Week view toggle.

**Before:**

```
Buttons at top (separate row)
Calendar Header (Month/Week toggle, navigation)
Calendar Grid
```

**After:**

```
Calendar Header with integrated buttons:
[October 2025] [Today]  |  [Month][Week]  [<][>]  [Send Calendar]  [Create Schedule]
Calendar Grid
```

### ✅ Design Consistency

Applied the same button patterns used in Staff Management, Task Assignment, and Absence pages:

- **Create Schedule Button**
  - `variant="dark"` (matches "Add Staff Member", "Add Task")
  - `leftIcon={Plus}` from lucide-react
  - `size="sm"` for consistency
- **Send Calendar Button**
  - `variant="outline"` (secondary action)
  - `leftIcon={Send}` from lucide-react
  - `size="sm"` for consistency

### ✅ Mock Data Removal

Removed all sample/mock data:

- ❌ Deleted `sampleSchedules` object with hardcoded dates and shifts
- ❌ Removed `getSchedulesForDate()` function that referenced mock data
- ✅ Calendar now shows empty state until real data is connected
- ✅ Ready for `useStaffSchedules` query integration

### Files Modified

1. **CalendarHeader.tsx**

   - Added `onSendCalendar` and `onCreateSchedule` props
   - Added Send and Plus icon imports
   - Added action buttons section after navigation controls

2. **Calendar.tsx**

   - Added `onSendCalendar` and `onCreateSchedule` props to interface
   - Passed props through to CalendarHeader

3. **StaffScheduleCalendar.tsx**
   - Removed mock data imports and declarations
   - Removed standalone button section
   - Removed `getSchedulesForDate()` helper function
   - Passed button handlers to Calendar component
   - Simplified schedule display to show empty state

### Next Steps for Integration

1. **Connect Real Data:**

   ```tsx
   const { data: schedules = [] } = useStaffSchedules(hotelId);
   ```

2. **Transform for Calendar:**

   ```tsx
   const schedulesByDate = useMemo(() => {
     return schedules.reduce((acc, schedule) => {
       const dateKey = schedule.schedule_start_date;
       if (!acc[dateKey]) acc[dateKey] = [];
       acc[dateKey].push({
         staffName: schedule.staff_name,
         shiftTime: `${schedule.shift_start} - ${schedule.shift_end}`,
         status: schedule.status,
       });
       return acc;
     }, {} as Record<string, ScheduleDisplay[]>);
   }, [schedules]);
   ```

3. **Display in Calendar:**
   ```tsx
   <Calendar
     schedules={schedulesByDate}
     onDateSelect={handleDateSelect}
     onSendCalendar={handleSendCalendar}
     onCreateSchedule={handleCreateSchedule}
   />
   ```

### Testing Checklist

- [x] Buttons appear in correct position (right side of header)
- [x] Buttons use correct variants and icons
- [x] Create Schedule button opens modal
- [x] Send Calendar button triggers handler (console log)
- [x] No mock data appears in calendar
- [x] Empty state displays correctly
- [x] No TypeScript/ESLint errors
- [ ] Test with real database data
- [ ] Verify schedule creation flow
- [ ] Implement Send Calendar email functionality
