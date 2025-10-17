-- Debug: Check if the hotel exists and verify location
SELECT 
  id, 
  name,
  location,
  ST_AsText(location::geometry) as location_text,
  ST_X(location::geometry) as longitude,
  ST_Y(location::geometry) as latitude
FROM hotels;

-- Check all hotels to see what IDs exist
SELECT id, name FROM hotels;

-- Check RLS policies on hotels table
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
WHERE tablename = 'hotels';
