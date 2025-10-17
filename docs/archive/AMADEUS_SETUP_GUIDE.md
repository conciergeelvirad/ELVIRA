# Amadeus API Integration Setup Guide

## Overview

This guide explains how to configure the Amadeus Tours & Activities API credentials for the tour agencies feature.

## Quick Setup (Development)

### Option 1: Environment Variables (Recommended for Development)

1. **Get Your Amadeus API Credentials:**

   - Go to [Amadeus for Developers](https://developers.amadeus.com/)
   - Create an account or log in
   - Navigate to **My Self-Service Workspace**
   - Click **Create new app**
   - Copy your **API Key** (Client ID) and **API Secret** (Client Secret)
   - Use the **Test environment** credentials for development

2. **Add Credentials to `.env.local`:**

   ```bash
   # Amadeus API Credentials (Test Environment)
   VITE_AMADEUS_CLIENT_ID=your_client_id_here
   VITE_AMADEUS_CLIENT_SECRET=your_client_secret_here
   ```

3. **Restart Your Development Server:**
   ```bash
   npm run dev
   ```

### Option 2: Supabase Secrets (Recommended for Production)

1. **Get Your Credentials** (same as above)

2. **Run the SQL Script in Supabase:**

   - Open your Supabase project
   - Go to **SQL Editor**
   - Open the file `database/insert_amadeus_credentials.sql`
   - Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your actual credentials
   - Execute the script

3. **Example SQL:**
   ```sql
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
   ```

## How It Works

The application follows this credential resolution order:

1. **First**: Checks environment variables (`VITE_AMADEUS_CLIENT_ID` and `VITE_AMADEUS_CLIENT_SECRET`)
2. **Fallback**: Queries Supabase `secrets` table for key `TEST.API.AMADEUS_API`

This allows:

- Developers to use `.env.local` for quick local development
- Production deployments to use secure Supabase secrets

## Features Enabled

Once configured, the following features will work:

✅ **Tour Agencies Tab** - Browse nearby tours and activities  
✅ **Search Tours** - Search by activity name  
✅ **Radius Filter** - Adjust search radius (1km to 10km)  
✅ **Approval System** - Approve/reject tours for guest recommendations  
✅ **Recommended Tours** - Mark tours as recommended  
✅ **View Modes** - Grid and list views

## API Details

- **API**: Amadeus Tours & Activities API
- **Version**: v1
- **Environment**: Test (for development)
- **Authentication**: OAuth2 Client Credentials Flow
- **Token Caching**: Automatic token refresh
- **Endpoints Used**:
  - `GET /v1/security/oauth2/token` - Authentication
  - `GET /v1/shopping/activities` - Search activities by location

## Troubleshooting

### Error: "Failed to retrieve Amadeus API credentials"

**Solution**: Check that credentials are properly set in either:

- `.env.local` file (for development)
- Supabase `secrets` table (for production)

### Error: "401 Unauthorized" or "Invalid credentials"

**Solution**:

1. Verify your Client ID and Client Secret are correct
2. Ensure you're using **Test environment** credentials (not Production)
3. Check that credentials don't have extra spaces or quotes

### No Tours Displayed

**Solution**:

1. Verify hotel location is set in the database
2. Check the search radius (try increasing to 10km)
3. Ensure the test location has nearby activities (popular tourist areas work best)

## Test Locations

For testing, these locations typically have many activities:

- **Paris, France**: `48.8566, 2.3522`
- **New York, USA**: `40.7128, -74.0060`
- **Barcelona, Spain**: `41.3851, 2.1734`
- **Tokyo, Japan**: `35.6762, 139.6503`

## API Rate Limits

**Test Environment Limits:**

- 10 transactions per second
- Free tier available

For production use, upgrade to Production environment credentials.

## Security Notes

⚠️ **Important**:

- Never commit `.env.local` to version control (it's in `.gitignore`)
- For production, always use Supabase secrets or environment variables from your hosting provider
- Rotate credentials if they're accidentally exposed

## Related Files

- `src/services/amadeusActivities.service.ts` - API service implementation
- `src/hooks/queries/amadeus/useNearbyTours.ts` - React Query hooks
- `src/pages/Hotel/ThirdPartyManagementPage.tsx` - Tour Agencies UI
- `src/components/third-party/tour-agencies/` - Tour components
- `database/insert_amadeus_credentials.sql` - SQL script for Supabase

## Support

- **Amadeus Developer Portal**: https://developers.amadeus.com/
- **API Documentation**: https://developers.amadeus.com/self-service/category/destination-content
- **Test Console**: https://developers.amadeus.com/self-service/apis-docs/self-service-apis
