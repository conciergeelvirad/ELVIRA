# Settings-Driven Sidebar Navigation - Complete Guide

## Overview

The sidebar navigation menu is now **dynamically controlled by hotel settings** stored in the Supabase database. When a setting toggle is turned OFF in the Control Panel, the corresponding menu item automatically disappears from the sidebar.

## How It Works

### 1. Database Layer (`hotel_settings` table)

Each hotel has settings stored as rows:

```typescript
{
  hotel_id: "uuid",
  setting_key: "hotelAmenities",  // Toggle name
  setting_value: true,             // ON/OFF state
  // ... other columns
}
```

### 2. Settings Context (`SettingsContext.tsx`)

- Fetches all settings from Supabase on load
- Converts database rows into `SettingsState` object
- Provides real-time updates when toggles change
- Used by both Control Panel and Sidebar

```typescript
const { settings } = useSettings();
// settings = { hotelAmenities: true, hotelShop: false, ... }
```

### 3. Navigation Mapping (`utils/ui/navigation.ts`)

Maps setting toggles to sidebar menu items:

```typescript
SETTINGS_TO_NAVIGATION_MAP = {
  hotelAmenities: "amenities", // Toggle → Menu ID
  hotelShop: "hotel-shop",
  roomServiceRestaurant: "hotel-restaurant",
  liveChatSupport: "chat-management",
  hotelAnnouncements: "announcements",
  qaRecommendations: "qa-recommendations",
  emergencyContacts: "emergency-contacts",
  toursExcursions: "third-party-management",
};
```

### 4. Sidebar Component (`components/layout/Sidebar.tsx`)

Filters navigation items before rendering:

```typescript
const visibleNavItems = HOTEL_NAVIGATION.filter((item) =>
  shouldShowNavigationItem(item.id, settings)
);
```

## Complete Mapping Table

| Setting Toggle              | Database Key            | Sidebar Menu Item          | Controllable? |
| --------------------------- | ----------------------- | -------------------------- | ------------- |
| **About Section**           | `aboutSection`          | _(none)_                   | N/A           |
| **Do Not Disturb**          | `doNotDisturb`          | _(none)_                   | N/A           |
| **Hotel Photo Gallery**     | `hotelPhotoGallery`     | _(none)_                   | N/A           |
| **Hotel Amenities**         | `hotelAmenities`        | **AMENITIES**              | ✓ Yes         |
| **Hotel Shop**              | `hotelShop`             | **HOTEL SHOP**             | ✓ Yes         |
| **Tours & Excursions**      | `toursExcursions`       | **THIRD PARTY MANAGEMENT** | ✓ Yes         |
| **Room Service/Restaurant** | `roomServiceRestaurant` | **HOTEL RESTAURANT**       | ✓ Yes         |
| **Local Restaurants**       | `localRestaurants`      | _(sub-feature)_            | N/A           |
| **Live Chat Support**       | `liveChatSupport`       | **CHAT MANAGEMENT**        | ✓ Yes         |
| **Hotel Announcements**     | `hotelAnnouncements`    | **ANNOUNCEMENTS**          | ✓ Yes         |
| **Q&A + Recommendations**   | `qaRecommendations`     | **Q&A + RECOMMENDATIONS**  | ✓ Yes         |
| **Emergency Contacts**      | `emergencyContacts`     | **EMERGENCY CONTACTS**     | ✓ Yes         |
| **Public Transport**        | `publicTransport`       | _(sub-feature)_            | N/A           |

## Always Visible Menu Items

These **core features** are always shown, regardless of settings:

✅ **OVERVIEW** - Dashboard analytics  
✅ **HOTEL STAFF** - Staff management  
✅ **GUEST MANAGEMENT** - Guest tracking  
✅ **AI SUPPORT** - AI assistant  
✅ **SETTINGS** - Configuration panel

## User Flow Example

### Scenario: Hotel wants to hide the Shop feature

1. **Admin opens Settings** → Control Panel tab
2. **Finds "Hotel Shop" toggle** in Guest Services section
3. **Turns toggle OFF** → Saved to database
4. **Sidebar updates instantly** → "HOTEL SHOP" menu disappears
5. **All staff members see the change** → Consistent across users

### Technical Flow:

```
User clicks toggle OFF
  ↓
SettingsContext.updateSetting()
  ↓
Supabase UPDATE hotel_settings SET setting_value = false
  ↓
React Query cache invalidation
  ↓
SettingsContext re-renders with new data
  ↓
Sidebar.tsx filters out "hotel-shop" menu item
  ↓
Menu item removed from UI
```

## Benefits

### ✅ **Database Persistence**

- Settings survive page refreshes
- Changes sync across all tabs/devices
- Audit trail in database

### ✅ **Real-time Updates**

- Toggle change → Sidebar updates instantly
- No page reload required
- Optimistic UI for fast feedback

### ✅ **Consistent Experience**

- All staff see same menu structure
- Hotel controls their own features
- No code changes needed to customize

### ✅ **Simplified Management**

- One Control Panel to rule them all
- Visual toggles instead of config files
- Clear labels and organization

## Code Architecture

### File Structure

```
src/
├── contexts/
│   └── SettingsContext.tsx          # Fetches & manages settings
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx              # Filters menu items
│   └── settings/
│       └── ControlPanel.tsx         # Toggle UI
├── utils/
│   └── ui/
│       └── navigation.ts            # Mapping logic
└── constants/
    └── navigation/
        └── hotel.ts                 # Menu item definitions
```

### Key Functions

#### `shouldShowNavigationItem(navId, settings)`

```typescript
// Returns true/false if menu item should be visible
// Core items (no mapping) → always true
// Feature items → returns toggle state from settings
```

#### `updateSetting(key, value)`

```typescript
// Updates setting in database
// Invalidates cache → triggers re-render
// Sidebar automatically updates
```

## Testing Guide

### Test Case 1: Toggle OFF hides menu item

1. Navigate to Settings → Control Panel
2. Find "Hotel Amenities" toggle (should be ON)
3. Click to turn OFF
4. **Expected:** "AMENITIES" menu item disappears from sidebar
5. Refresh page
6. **Expected:** "AMENITIES" still hidden (persisted)

### Test Case 2: Toggle ON shows menu item

1. Settings → Control Panel
2. Find "Hotel Shop" toggle (if OFF)
3. Click to turn ON
4. **Expected:** "HOTEL SHOP" appears in sidebar
5. **Expected:** Can navigate to shop page

### Test Case 3: Core items always visible

1. Turn OFF all toggles in Control Panel
2. **Expected:** Overview, Staff, Guests, AI, Settings still visible
3. **Expected:** Only feature-based items hidden

### Test Case 4: Multi-user consistency

1. User A turns OFF "Chat Management"
2. User B refreshes their browser
3. **Expected:** User B sees "CHAT MANAGEMENT" hidden
4. **Expected:** Both users see identical menu

## Troubleshooting

### Menu item not hiding?

- Check console logs: `[Navigation] <item> controlled by <toggle>: <state>`
- Verify setting exists in database: `hotel_settings` table
- Confirm mapping in `SETTINGS_TO_NAVIGATION_MAP`

### Menu item always visible?

- Check if it's a core feature (Overview, Staff, etc.)
- Verify mapping is not `null` in navigation.ts
- Check `shouldShowNavigationItem` logic

### Changes not persisting?

- Check Supabase connection
- Verify RLS policies allow update
- Check React Query cache invalidation

## Future Enhancements

### Possible Additions:

1. **Role-based visibility** - Different menus for different roles
2. **Custom menu order** - Drag-and-drop reordering
3. **Nested menus** - Sub-items controlled by settings
4. **Menu groups** - Collapsible sections
5. **Icon customization** - Hotel chooses icons

---

## Summary

✅ **Sidebar menu is now database-driven**  
✅ **Settings toggles control menu visibility**  
✅ **Changes are instant and persistent**  
✅ **Core features always available**  
✅ **Easy to manage through Control Panel**

The system provides a **powerful, flexible way** for hotels to customize their dashboard without touching code!
