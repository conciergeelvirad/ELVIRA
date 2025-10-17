-- Simple fix: Drop the calculate_hours_worked trigger since it's not needed
-- Run this in your Supabase SQL Editor

-- Drop the trigger
DROP TRIGGER IF EXISTS calculate_hours_worked_trigger ON public.staff_schedules;

-- Optionally, drop the function as well since it's not being used
DROP FUNCTION IF EXISTS calculate_hours_worked();

-- Verify the trigger is removed
SELECT 
  t.tgname AS trigger_name,
  c.relname AS table_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relname = 'staff_schedules';

-- This query should return no rows if the trigger was successfully removed
