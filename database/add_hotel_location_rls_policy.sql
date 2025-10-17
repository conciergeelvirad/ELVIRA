-- Add RLS policy to allow reading hotel location
-- This allows the application to fetch hotel coordinates for the Google Places API

-- IMPORTANT: This policy allows public (anonymous) access to read hotels table
-- This is needed for the Third Party Management page to fetch hotel location
CREATE POLICY "Public can read hotel basic info"
  ON public.hotels
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Verify the policies
SELECT 
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'hotels'
ORDER BY policyname;
