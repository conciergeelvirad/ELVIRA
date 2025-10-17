-- ============================================================================
-- Insert Amadeus API Credentials into Supabase
-- ============================================================================
--
-- This script inserts the Amadeus Tours & Activities API credentials
-- into the secrets table so they can be used by the application.
--
-- INSTRUCTIONS:
-- 1. Replace YOUR_CLIENT_ID with your actual Amadeus API Client ID
-- 2. Replace YOUR_CLIENT_SECRET with your actual Amadeus API Client Secret
-- 3. Run this SQL in your Supabase SQL Editor
--
-- To get your Amadeus API credentials:
-- 1. Go to https://developers.amadeus.com/
-- 2. Create an account or log in
-- 3. Create a new app in the Self-Service section
-- 4. Copy the API Key (Client ID) and API Secret (Client Secret)
-- 5. Use the Test environment credentials for development
--
-- ============================================================================

-- Insert or update the Amadeus API credentials
INSERT INTO secrets (secret_key, secret_value, created_at, updated_at)
VALUES (
  'TEST.API.AMADEUS_API',
  '{"clientId":"YOUR_CLIENT_ID","clientSecret":"YOUR_CLIENT_SECRET"}',
  NOW(),
  NOW()
)
ON CONFLICT (secret_key)
DO UPDATE SET
  secret_value = EXCLUDED.secret_value,
  updated_at = NOW();

-- Verify the credentials were inserted
SELECT 
  secret_key,
  secret_value,
  created_at,
  updated_at
FROM secrets
WHERE secret_key = 'TEST.API.AMADEUS_API';

-- ============================================================================
-- EXAMPLE:
-- ============================================================================
-- If your credentials are:
-- Client ID: 12345abcde
-- Client Secret: xyz789secret
--
-- The insert would look like:
--
-- INSERT INTO secrets (secret_key, secret_value, created_at, updated_at)
-- VALUES (
--   'TEST.API.AMADEUS_API',
--   '{"clientId":"12345abcde","clientSecret":"xyz789secret"}',
--   NOW(),
--   NOW()
-- );
-- ============================================================================
