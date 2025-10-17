-- Fix for staff_schedules table trigger issue
-- The calculate_hours_worked() function is referencing fields that don't exist

-- Option 1: Drop the problematic trigger temporarily
-- Run this if you don't need the hours calculation yet:

DROP TRIGGER IF EXISTS calculate_hours_worked_trigger ON public.staff_schedules;

-- You can recreate it later when you add the necessary fields to the table


-- Option 2: Create a simple placeholder function that doesn't break
-- This replaces the existing function with one that just returns without changes:

CREATE OR REPLACE FUNCTION calculate_hours_worked()
RETURNS TRIGGER AS $$
BEGIN
  -- Placeholder: This function currently does nothing
  -- Add hours calculation logic here when needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Then recreate the trigger:
DROP TRIGGER IF EXISTS calculate_hours_worked_trigger ON public.staff_schedules;

CREATE TRIGGER calculate_hours_worked_trigger 
BEFORE INSERT OR UPDATE ON public.staff_schedules 
FOR EACH ROW 
EXECUTE FUNCTION calculate_hours_worked();


-- Verify the fix by checking if the table and trigger exist:
SELECT 
  t.tablename, 
  t.schemaname,
  string_agg(pg_get_triggerdef(tr.oid), E'\n') as triggers
FROM pg_tables t
LEFT JOIN pg_trigger tr ON tr.tgrelid = (t.schemaname || '.' || t.tablename)::regclass
WHERE t.tablename = 'staff_schedules'
GROUP BY t.tablename, t.schemaname;
