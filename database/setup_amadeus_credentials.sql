-- ============================================================================
-- Amadeus Tours and Activities API - Credential Setup
-- ============================================================================
-- 
-- This script stores Amadeus API credentials securely in the secrets table.
-- 
-- PREREQUISITES:
-- 1. Sign up for Amadeus test account: https://developers.amadeus.com/register
-- 2. Get your Client ID and Client Secret from the dashboard
-- 3. Replace YOUR_CLIENT_ID_HERE and YOUR_CLIENT_SECRET_HERE below
--
-- ============================================================================

-- Insert Amadeus API credentials
INSERT INTO secrets (secret_key, secret_value, description)
VALUES (
  'TEST.API.AMADEUS_API',
  '{
    "clientId": "YOUR_CLIENT_ID_HERE",
    "clientSecret": "YOUR_CLIENT_SECRET_HERE"
  }',
  'Amadeus Tours and Activities API credentials (Test Environment)'
)
ON CONFLICT (secret_key) 
DO UPDATE SET 
  secret_value = EXCLUDED.secret_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verify the credentials were stored
SELECT 
  secret_key,
  description,
  created_at,
  updated_at,
  CASE 
    WHEN secret_value IS NOT NULL THEN '✓ Credentials stored'
    ELSE '✗ No credentials'
  END as status
FROM secrets
WHERE secret_key = 'TEST.API.AMADEUS_API';

-- ============================================================================
-- IMPORTANT NOTES:
-- ============================================================================
--
-- 1. REPLACE PLACEHOLDER VALUES:
--    - YOUR_CLIENT_ID_HERE: Your Amadeus API Client ID
--    - YOUR_CLIENT_SECRET_HERE: Your Amadeus API Client Secret
--
-- 2. JSON FORMAT:
--    - Ensure the JSON is properly formatted
--    - Use double quotes for JSON keys and values
--    - No trailing commas
--
-- 3. SECURITY:
--    - These credentials are for TEST environment only
--    - For production, create separate credentials
--    - Never commit credentials to version control
--
-- 4. RLS POLICY:
--    - Ensure Row Level Security is enabled on secrets table
--    - Only authenticated service role should access
--
-- 5. TEST THE CREDENTIALS:
--    - After insertion, test by calling searchActivities() in your app
--    - Check browser console for any authentication errors
--
-- ============================================================================

-- Example of correct credentials format:
-- {
--   "clientId": "AbCdEf123456789",
--   "clientSecret": "XyZ987654321aBcDeF"
-- }

-- ============================================================================
-- CREDENTIAL VALIDATION QUERY
-- ============================================================================
-- 
-- Run this to check if credentials are valid JSON:

SELECT 
  secret_key,
  secret_value::json->>'clientId' as client_id_preview,
  CASE 
    WHEN secret_value::json->>'clientId' IS NOT NULL 
     AND secret_value::json->>'clientSecret' IS NOT NULL 
    THEN '✓ Valid format'
    ELSE '✗ Invalid format'
  END as validation_status
FROM secrets
WHERE secret_key = 'TEST.API.AMADEUS_API';

-- ============================================================================
-- UPDATE EXISTING CREDENTIALS
-- ============================================================================
--
-- If you need to update credentials later:

-- UPDATE secrets
-- SET 
--   secret_value = '{
--     "clientId": "NEW_CLIENT_ID",
--     "clientSecret": "NEW_CLIENT_SECRET"
--   }',
--   updated_at = NOW()
-- WHERE secret_key = 'TEST.API.AMADEUS_API';

-- ============================================================================
-- DELETE CREDENTIALS (if needed)
-- ============================================================================
--
-- To remove credentials:

-- DELETE FROM secrets WHERE secret_key = 'TEST.API.AMADEUS_API';
