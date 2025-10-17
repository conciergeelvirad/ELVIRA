-- ============================================
-- STAFF SCHEDULES RLS (Row Level Security) FIX
-- ============================================
-- This script enables RLS and creates policies for the staff_schedules table
-- so that Hotel Staff can view their own schedules

-- Enable RLS on staff_schedules table
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hotel staff can view schedules" ON staff_schedules;
DROP POLICY IF EXISTS "Admins and managers can view all schedules" ON staff_schedules;
DROP POLICY IF EXISTS "Admins and managers can insert schedules" ON staff_schedules;
DROP POLICY IF EXISTS "Admins and managers can update schedules" ON staff_schedules;
DROP POLICY IF EXISTS "Admins and managers can delete schedules" ON staff_schedules;

-- ============================================
-- SELECT POLICIES (View Schedules)
-- ============================================

-- Policy 1: Hotel Staff can view their own schedules
CREATE POLICY "Hotel staff can view own schedules"
ON staff_schedules
FOR SELECT
USING (
  staff_id IN (
    SELECT id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
  )
);

-- Policy 2: Admins and Managers can view all schedules in their hotel
CREATE POLICY "Admins and managers can view all schedules"
ON staff_schedules
FOR SELECT
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
    AND (position = 'Hotel Admin' OR department = 'Manager')
  )
);

-- ============================================
-- INSERT POLICIES (Create Schedules)
-- ============================================

-- Only Admins and Managers can create schedules
CREATE POLICY "Admins and managers can insert schedules"
ON staff_schedules
FOR INSERT
WITH CHECK (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
    AND (position = 'Hotel Admin' OR department = 'Manager')
  )
);

-- ============================================
-- UPDATE POLICIES (Edit Schedules)
-- ============================================

-- Only Admins and Managers can update schedules
CREATE POLICY "Admins and managers can update schedules"
ON staff_schedules
FOR UPDATE
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
    AND (position = 'Hotel Admin' OR department = 'Manager')
  )
)
WITH CHECK (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
    AND (position = 'Hotel Admin' OR department = 'Manager')
  )
);

-- ============================================
-- DELETE POLICIES (Delete Schedules)
-- ============================================

-- Only Admins and Managers can delete schedules
CREATE POLICY "Admins and managers can delete schedules"
ON staff_schedules
FOR DELETE
USING (
  hotel_id IN (
    SELECT hotel_id 
    FROM hotel_staff 
    WHERE user_id = auth.uid()
    AND (position = 'Hotel Admin' OR department = 'Manager')
  )
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'staff_schedules';

-- List all policies on staff_schedules
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'staff_schedules'
ORDER BY policyname;

-- Count schedules by hotel
SELECT hotel_id, COUNT(*) as schedule_count
FROM staff_schedules
GROUP BY hotel_id;

-- View sample schedules with staff names
SELECT 
  ss.id,
  ss.staff_id,
  hs.name as staff_name,
  hs.position,
  ss.schedule_start_date,
  ss.schedule_finish_date,
  ss.shift_start,
  ss.shift_end,
  ss.status
FROM staff_schedules ss
LEFT JOIN hotel_staff hs ON hs.id = ss.staff_id
ORDER BY ss.schedule_start_date DESC
LIMIT 10;
