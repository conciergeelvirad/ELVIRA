# Google Places API Setup Guide

## Problem

The screenshot shows `PLACES_GOOGLE_API` is stored in **Supabase Edge Function secrets** (encrypted environment variables), which are **not accessible from client-side code** for security reasons.

## Solution Options

### ✅ Option 1: Use Environment Variable (Quickest - Development)

1. **Create/Edit `.env.local` file** in the frontend root:

```bash
VITE_GOOGLE_PLACES_API_KEY=YOUR_ACTUAL_API_KEY
```

2. **Get your API key from the Supabase dashboard**:

   - Copy the value from `PLACES_GOOGLE_API` secret shown in your screenshot
   - Or get a new one from Google Cloud Console

3. **Restart the dev server**:

```bash
npm run dev
```

The app will now use the environment variable!

---

### ✅ Option 2: Create a Database Secrets Table (Production Ready)

This allows storing the API key in the database so it can be queried by the application.

#### Step 1: Run the SQL Script

1. **Open Supabase SQL Editor**
2. **Run the provided SQL script**: `database/create_secrets_table.sql`
3. **Update the INSERT statement** with your actual API key:

```sql
INSERT INTO public.secrets (key, value, description)
VALUES (
  'PLACES_GOOGLE_API',
  'YOUR_ACTUAL_GOOGLE_PLACES_API_KEY',  -- Replace this!
  'Google Places API key for fetching nearby restaurants'
)
ON CONFLICT (key)
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
```

#### Step 2: Verify RLS Policies

The script creates policies that allow:

- ✅ Authenticated users can READ secrets
- ❌ Only service role can WRITE secrets

---

### Option 3: Create an Edge Function Proxy (Most Secure)

For production, you might want to create an Edge Function that:

1. Stores the API key in Edge Function secrets (where it already is)
2. Makes requests to Google Places API server-side
3. Returns results to your frontend

This keeps the API key completely hidden from the client.

**Example Edge Function structure:**

```typescript
// supabase/functions/google-places/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { location, radius } = await req.json();
  const apiKey = Deno.env.get("PLACES_GOOGLE_API");

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${apiKey}`
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Then update `useGooglePlacesQueries.ts` to call the Edge Function instead.

---

## Which Option Should I Use?

| Option                   | Pros                                                                   | Cons                                                    | Use Case                                   |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| **Environment Variable** | ✅ Quickest setup<br>✅ Good for development                           | ❌ Need to deploy env vars<br>❌ Key visible in browser | Development/Testing                        |
| **Database Table**       | ✅ Easy to update<br>✅ Works immediately<br>✅ Can restrict by domain | ⚠️ Key accessible to authenticated users                | Small-medium apps with domain restrictions |
| **Edge Function**        | ✅ Most secure<br>✅ Key never exposed<br>✅ Can add rate limiting     | ❌ More complex<br>❌ Extra latency                     | Production apps with sensitive data        |

---

## Quick Start (Recommended for Now)

**Use Environment Variable for immediate testing:**

1. Create `.env.local`:

```bash
VITE_GOOGLE_PLACES_API_KEY=AIzaSyD...your-key-here
```

2. Restart dev server:

```bash
npm run dev
```

3. The page should now work! The hook will use the env variable first.

---

## Getting Your Google Places API Key

If you need a new API key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable **Places API (New)**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. **Restrict the key**:
   - API restrictions: Places API
   - Website restrictions: Your domain(s)

---

## Verifying It Works

Once set up, check the browser console. You should see:

```
✅ "Using Google Places API key from environment"
or
✅ "Successfully fetched API key from Supabase"
```

Instead of:

```
❌ "Error fetching Google Places API key"
```

---

## Troubleshooting

**Still getting "API key not found"?**

1. **Check browser console** for detailed error messages
2. **Verify env variable name**: Must be `VITE_GOOGLE_PLACES_API_KEY`
3. **Restart dev server** after creating `.env.local`
4. **Check Supabase RLS policies** if using database table
5. **Verify API key is valid** by testing in Google Cloud Console

**"CORS error" or "API request failed"?**

1. Enable **Places API** in Google Cloud Console
2. Check **API key restrictions** (remove restrictions for testing)
3. Verify **billing is enabled** on your Google Cloud project

---

## Current Implementation Priority

The code now checks in this order:

1. ✅ Environment variable (`VITE_GOOGLE_PLACES_API_KEY`)
2. ✅ Supabase `secrets` table (`PLACES_GOOGLE_API` key)
3. ❌ Error if neither found

This gives you flexibility to use either approach!
