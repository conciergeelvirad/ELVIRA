# Settings Database Integration

## Overview

All toggle settings in the Control Panel now interact with the `hotel_settings` table in Supabase, providing persistent storage for hotel configuration.

## Database Schema

The `hotel_settings` table stores settings with the following structure:

```typescript
{
  hotel_id: string; // Foreign key to hotels table
  setting_key: string; // The name of the setting (e.g., "aboutSection")
  setting_value: boolean; // true for enabled, false for disabled
  // Additional metadata fields...
}
```

## Implementation Details

### 1. Settings Context (`src/contexts/SettingsContext.tsx`)

The `SettingsProvider` has been updated to:

- **Load settings from Supabase** using the `useHotelSettings` hook
- **Save toggle changes** to the database using upsert operations
- **Optimistic updates** for instant UI feedback
- **Error handling** with automatic rollback on failure

### 2. Query Hooks (`src/hooks/queries/useHotelSettings.ts`)

Reuses existing query hooks:

- `useHotelSettings(hotelId)` - Fetches all settings for a hotel
- `useHotelSetting(hotelId, settingKey)` - Fetches a single setting by key

### 3. Setting Keys

All toggle settings use camelCase keys that match the `SettingsState` interface:

**Layout & Branding:**

- `aboutSection` - Display hotel information and custom content
- `doNotDisturb` - Allow guests to toggle DND status
- `hotelPhotoGallery` - Upload and manage up to 8 photos

**Guest Services:**

- `hotelAmenities` - Hotel facilities and services information
- `hotelShop` - Purchase hotel merchandise and essentials
- `toursExcursions` - Book local tours and activities
- `roomServiceRestaurant` - Order food from hotel restaurant
- `localRestaurants` - Discover and book local dining options
- `liveChatSupport` - Direct communication with hotel reception

**Information & Communication:**

- `hotelAnnouncements` - Display important hotel news and updates
- `qaRecommendations` - Frequently asked questions and recommendations
- `emergencyContacts` - Essential emergency contact information
- `publicTransport` - Show public transport information

## How It Works

### 1. Loading Settings

When a user opens the Control Panel:

1. The `SettingsProvider` fetches all settings from `hotel_settings` table
2. Settings are converted to a `SettingsState` object
3. Missing settings use default values (most are `true` by default)
4. UI renders with current toggle states

### 2. Updating Settings

When a user toggles a setting:

1. **Optimistic Update**: UI updates immediately for responsiveness
2. **Database Save**: Setting is upserted to `hotel_settings` table
3. **Query Invalidation**: React Query refetches to ensure sync
4. **Error Handling**: On failure, toggle reverts to previous state

### 3. Data Flow

```
User Toggle → ControlPanel → useSettings hook
                                    ↓
                            SettingsContext
                                    ↓
                        Optimistic State Update
                                    ↓
                            Supabase Upsert
                                    ↓
                        Query Invalidation
                                    ↓
                            Refetch Settings
```

## Key Features

### ✅ Persistence

All toggle states are saved to the database and persist across sessions.

### ✅ Real-time Sync

Uses React Query for automatic cache invalidation and refetching.

### ✅ Optimistic Updates

UI updates instantly while the database operation happens in the background.

### ✅ Error Recovery

Failed updates automatically revert the toggle state and log errors.

### ✅ Default Values

New hotels or missing settings use sensible defaults defined in the context.

### ✅ Type Safety

Full TypeScript support with the `SettingsState` interface.

## Database Operations

### Upsert Operation

The system uses Supabase's upsert with conflict resolution:

```typescript
await supabase.from("hotel_settings").upsert(
  {
    hotel_id: hotelId,
    setting_key: key,
    setting_value: value,
  },
  {
    onConflict: "hotel_id,setting_key",
  }
);
```

This ensures:

- New settings are inserted
- Existing settings are updated
- No duplicate entries are created

## Special Settings

### About Us Section

- **setting_key**: `aboutSection`
- **Additional Data**: Stores text in `about_us`, `about_us_button`, and `about_us_url` keys
- **Modal**: Opens `AboutUsModal` for editing content

### Hotel Photo Gallery

- **setting_key**: `hotelPhotoGallery`
- **Additional Data**: Stores image URLs in `images_url` as JSON array
- **Modal**: Opens `HotelPhotoGalleryModal` for managing photos

## Testing

### Verify Database Integration

1. Toggle a setting in the Control Panel
2. Check the `hotel_settings` table in Supabase
3. Verify the row exists with correct `setting_key` and `setting_value`
4. Refresh the page and confirm the toggle state persists

### Test Error Handling

1. Disconnect from the internet
2. Toggle a setting
3. Observe the toggle revert when the save fails
4. Check console for error message

## Notes

- All toggles use the same `hotel_settings` table
- Setting keys must match the `SettingsState` interface
- Boolean values are stored directly (not as strings)
- The system is fully backwards compatible with existing data
- Additional setting metadata (text, URLs, etc.) uses separate keys
