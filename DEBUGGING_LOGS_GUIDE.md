# Settings Debug Logging Guide

## Overview

Comprehensive logging has been added to the Settings system to help diagnose the 406 errors shown in the browser console.

## Where to Find Logs

Open your browser's Developer Console (F12) and check the Console tab. All logs are prefixed with `[SettingsProvider]`, `[useHotelSettings]`, or `[useHotelSetting]`.

## Log Categories

### 1. Initialization Logs

**When**: Page loads or Settings context initializes

```
[SettingsProvider] Initialized with hotelId: 086e11e4-4775-4327-8448-3fa0ee7be0a5
```

**What to check**:

- ✅ hotelId should be a valid UUID
- ❌ If empty string, no hotel is selected

---

### 2. Query State Logs

**When**: After fetching settings from database

```
[SettingsProvider] Query state: {
  hotelId: "086e11e4-4775-4327-8448-3fa0ee7be0a5",
  isLoading: false,
  hasError: false,
  error: null,
  settingsCount: 0,
  settings: []
}
```

**What to check**:

- `isLoading`: true = still fetching, false = fetch complete
- `hasError`: true = error occurred during fetch
- `error`: Shows the actual error object if hasError is true
- `settingsCount`: Number of settings found (0 = no settings in DB yet)
- `settings`: Array of setting objects from database

**Common Issues**:

- **settingsCount: 0** = No settings exist in database for this hotel (normal for first time)
- **hasError: true** = Database query failed (check error details)
- **error.code** = Specific Supabase error code

---

### 3. Fetch Settings Logs

**When**: useHotelSettings hook fetches data

```
[useHotelSettings] Fetching settings for hotelId: 086e11e4-4775-4327-8448-3fa0ee7be0a5
[useHotelSettings] Fetched settings: []
```

**What to check**:

- Empty array `[]` = No settings found (will use defaults)
- Array with objects = Settings loaded successfully

**If Error**:

```
[useHotelSettings] Error fetching settings: {
  code: "...",
  message: "...",
  details: "..."
}
```

---

### 4. Loading Individual Settings

**When**: AboutUsModal or HotelPhotoGalleryModal loads

```
[useHotelSetting] Fetching setting for hotelId: 086e11e4-..., key: about_us
[useHotelSetting] Setting not found for key: about_us
```

OR

```
[useHotelSetting] Fetched setting about_us: { setting_value: "...", ... }
```

**What to check**:

- "Setting not found" = Normal for first time, will create on save
- Object returned = Setting exists in database

---

### 5. Settings Merge Logs

**When**: Database settings are merged with defaults

```
[SettingsProvider] useEffect triggered with dbSettings: []
[SettingsProvider] No DB settings found, using defaults
```

OR

```
[SettingsProvider] Loaded setting: aboutSection = true
[SettingsProvider] Loaded setting: hotelAmenities = false
[SettingsProvider] Merged settings: {
  aboutSection: true,
  doNotDisturb: true,
  hotelPhotoGallery: true,
  hotelAmenities: false,
  ...
}
```

**What to check**:

- Each loaded setting shows its key and value
- Merged settings shows final state (DB settings override defaults)

---

### 6. Toggle Update Logs

**When**: User toggles a setting on/off

```
[SettingsProvider] updateSetting called: hotelAmenities = true
[SettingsProvider] Updating hotelAmenities to true for hotel 086e11e4-...
[SettingsProvider] Saving to Supabase: {
  hotel_id: "086e11e4-4775-4327-8448-3fa0ee7be0a5",
  setting_key: "hotelAmenities",
  setting_value: true
}
[SettingsProvider] Successfully saved to Supabase: [...]
[SettingsProvider] Invalidated queries for hotel: 086e11e4-...
```

**What to check**:

- Update request shows correct key and value
- "Successfully saved" = Database update worked
- "Invalidated queries" = Cache refreshed

**If Error**:

```
[SettingsProvider] Supabase error: {
  code: "...",
  message: "...",
  details: "..."
}
[SettingsProvider] Error updating setting: ...
[SettingsProvider] Reverted hotelAmenities back to false
```

---

## Common Error Scenarios

### Scenario 1: 406 Not Acceptable Errors

**Symptoms**: Multiple 406 errors in console

**Possible Causes**:

1. **Missing Table**: `hotel_settings` table doesn't exist
2. **Wrong Schema**: Table structure doesn't match expected columns
3. **RLS Policies**: Row Level Security blocking access
4. **Network Issue**: Supabase connection problem

**What to Check**:

```
[useHotelSettings] Error fetching settings: {
  code: "PGRST...",
  message: "...",
  hint: "..."
}
```

**Solutions**:

- Check Supabase table exists: `hotel_settings`
- Verify columns: `hotel_id`, `setting_key`, `setting_value`
- Check RLS policies allow SELECT/INSERT/UPDATE
- Verify Supabase URL and anon key are correct

---

### Scenario 2: No Settings Loading

**Symptoms**: All toggles show default values, never change

**Logs to Check**:

```
[SettingsProvider] Query state: { settingsCount: 0, settings: [] }
[SettingsProvider] No DB settings found, using defaults
```

**Cause**: No settings exist in database yet (normal for first time)

**Solution**: Toggle any setting to create first database entry

---

### Scenario 3: Settings Don't Persist

**Symptoms**: Toggles change but revert after page reload

**Logs to Check**:

```
[SettingsProvider] updateSetting called: ...
[SettingsProvider] Supabase error: ...
[SettingsProvider] Reverted ... back to ...
```

**Possible Causes**:

1. Database save failing (check error message)
2. RLS policies blocking INSERT/UPDATE
3. Missing permissions on table

---

### Scenario 4: Wrong Hotel ID

**Symptoms**: Settings loading for wrong hotel

**Logs to Check**:

```
[SettingsProvider] Initialized with hotelId: 086e11e4-...
[useHotelSettings] Fetching settings for hotelId: 086e11e4-...
```

**Solution**: Verify hotel ID matches the expected hotel

---

## How to Debug Step-by-Step

### Step 1: Check Initialization

1. Open browser console
2. Look for: `[SettingsProvider] Initialized with hotelId:`
3. Verify hotelId is not empty

### Step 2: Check Database Fetch

1. Look for: `[SettingsProvider] Query state:`
2. Check if `hasError: true`
3. If error, read the error message

### Step 3: Try Toggling a Setting

1. Click any toggle
2. Watch for: `[SettingsProvider] updateSetting called:`
3. Check if "Successfully saved" appears
4. If error appears, check the error code/message

### Step 4: Verify Supabase Table

1. Open Supabase dashboard
2. Go to Table Editor
3. Check if `hotel_settings` table exists
4. Verify table has these columns:
   - `id` (uuid, primary key)
   - `hotel_id` (uuid, foreign key)
   - `setting_key` (text)
   - `setting_value` (boolean)
   - `created_at`, `updated_at` (timestamps)

### Step 5: Check RLS Policies

1. In Supabase, go to Authentication > Policies
2. Check `hotel_settings` table has policies for:
   - SELECT (read)
   - INSERT (create)
   - UPDATE (modify)
3. Policies should allow operations for the current user

---

## Expected Behavior (Normal Flow)

### First Time (No Settings in DB):

```
[SettingsProvider] Initialized with hotelId: 086e11e4-...
[useHotelSettings] Fetching settings for hotelId: 086e11e4-...
[useHotelSettings] Fetched settings: []
[SettingsProvider] Query state: { settingsCount: 0, ... }
[SettingsProvider] No DB settings found, using defaults
```

### Toggle a Setting:

```
[SettingsProvider] updateSetting called: hotelAmenities = true
[SettingsProvider] Saving to Supabase: { ... }
[SettingsProvider] Successfully saved to Supabase: [...]
```

### After Reload (Settings Exist):

```
[SettingsProvider] Initialized with hotelId: 086e11e4-...
[useHotelSettings] Fetching settings for hotelId: 086e11e4-...
[useHotelSettings] Fetched settings: [{ setting_key: "hotelAmenities", setting_value: true, ... }]
[SettingsProvider] Query state: { settingsCount: 1, ... }
[SettingsProvider] Loaded setting: hotelAmenities = true
[SettingsProvider] Merged settings: { ... }
```

---

## Next Steps

1. **Open browser console** (F12)
2. **Navigate to Settings page**
3. **Check the logs** using this guide
4. **Try toggling a setting**
5. **Share the console logs** if you need help debugging

The logs will show exactly where the issue is occurring in the data flow.
