# Quick Fix: Remove Hours Calculation Trigger

## Problem

The error `"record \"new\" has no field \"actual_start_time\""` is caused by a database trigger that references columns you've already deleted.

## Solution

Since you've removed the `actual_start_time` and related columns, and you don't need hours calculation, simply remove the trigger.

### Steps:

1. **Open Supabase SQL Editor**

   - Go to: https://supabase.com/dashboard/project/lxlabfgifswvhtkqrlek
   - Click on "SQL Editor" in the left sidebar

2. **Copy and paste this SQL**:

   ```sql
   DROP TRIGGER IF EXISTS calculate_hours_worked_trigger ON public.staff_schedules;
   DROP FUNCTION IF EXISTS calculate_hours_worked();
   ```

3. **Click "Run"**

4. **Test in your app**
   - Go back to the Create Schedule modal
   - Try creating a schedule again
   - ✅ It should work now!

## What This Does

- Removes the `calculate_hours_worked_trigger` that was trying to access deleted columns
- Removes the `calculate_hours_worked()` function since it's no longer needed
- Your `staff_schedules` table will work normally without the trigger

## Verification

After running the SQL, you can verify the trigger is gone:

```sql
SELECT
  t.tgname AS trigger_name,
  c.relname AS table_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relname = 'staff_schedules';
```

This should return **no rows** (empty result) if successful.

## Your Current Schema

Based on your screenshot, your table now has:

- ✅ `staff_id`
- ✅ `hotel_id`
- ✅ `schedule_start_date`
- ✅ `schedule_finish_date`
- ✅ `shift_start`
- ✅ `shift_end`
- ✅ `status`
- ✅ `notes`
- ✅ `is_confirmed`
- ✅ `confirmed_by`
- ✅ `confirmed_at`
- ✅ `created_at`
- ✅ `updated_at`
- ✅ `created_by`

No `actual_start_time` or hours calculation needed! ✅
