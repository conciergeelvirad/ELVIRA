# Staff Schedules Database Trigger Fix

## Problem

The error `"new" row has no field "actual_start_time"` indicates that the database trigger `calculate_hours_worked()` is trying to access a field that doesn't exist in the `staff_schedules` table.

## Root Cause

The `calculate_hours_worked_trigger` function references columns that are not in the current table schema:

- `actual_start_time` - Does NOT exist in table
- `actual_finish_time` - Does NOT exist in table

But the table only has:

- `shift_start` - EXISTS ✓
- `shift_end` - EXISTS ✓

## Solution

You need to run the SQL script in your Supabase dashboard to fix the trigger.

### Steps:

1. **Open Supabase Dashboard**

   - Go to https://supabase.com/dashboard/project/lxlabfgifswvhtkqrlek
   - Navigate to SQL Editor

2. **Run Option 2 from the fix-staff-schedules-trigger.sql file**

   ```sql
   -- Create a simple placeholder function
   CREATE OR REPLACE FUNCTION calculate_hours_worked()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Placeholder: Returns without modifications
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Recreate the trigger
   DROP TRIGGER IF EXISTS calculate_hours_worked_trigger ON public.staff_schedules;

   CREATE TRIGGER calculate_hours_worked_trigger
   BEFORE INSERT OR UPDATE ON public.staff_schedules
   FOR EACH ROW
   EXECUTE FUNCTION calculate_hours_worked();
   ```

3. **Test the Schedule Creation**
   - Go back to your app
   - Try creating a schedule again
   - It should now work without errors

## Alternative: Add Missing Columns

If you actually need the `actual_start_time` and `actual_finish_time` fields, you can add them to the table:

```sql
ALTER TABLE public.staff_schedules
ADD COLUMN actual_start_time time without time zone,
ADD COLUMN actual_finish_time time without time zone,
ADD COLUMN hours_worked numeric(5,2);

-- Then update the trigger function to use these fields
CREATE OR REPLACE FUNCTION calculate_hours_worked()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate hours worked based on actual times (if provided)
  IF NEW.actual_start_time IS NOT NULL AND NEW.actual_finish_time IS NOT NULL THEN
    NEW.hours_worked := EXTRACT(EPOCH FROM (NEW.actual_finish_time - NEW.actual_start_time)) / 3600;
  ELSE
    -- Fallback to scheduled times
    NEW.hours_worked := EXTRACT(EPOCH FROM (NEW.shift_end - NEW.shift_start)) / 3600;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Verification

After applying the fix, verify it works:

```sql
-- Test insert
INSERT INTO public.staff_schedules (
  staff_id,
  hotel_id,
  schedule_start_date,
  schedule_finish_date,
  shift_start,
  shift_end,
  status
) VALUES (
  'your-staff-id',
  'your-hotel-id',
  '2025-10-20',
  '2025-10-20',
  '08:00:00',
  '16:00:00',
  'SCHEDULED'
);

-- Should succeed without errors
```

## What Changed in Code

Updated `useStaffScheduleQueries.ts`:

- Removed optional confirmation fields from insert interface
- Confirmation fields should only be set via the `useConfirmStaffSchedule` mutation
- Removed `as any` type casting (no longer needed)

## Next Steps

1. Apply the SQL fix in Supabase dashboard
2. Test schedule creation in the app
3. Verify schedules appear in the calendar
4. If you need hours calculation, implement proper trigger logic
