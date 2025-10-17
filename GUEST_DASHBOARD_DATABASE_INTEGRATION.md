# Guest Dashboard Database Integration Plan

## Overview

This document outlines the plan to wire the Guest Dashboard components with the Supabase database.

---

## Database Schema Analysis

### 1. **DND Button** → `guests.dnd_status`

**Table**: `guests`
**Column**: `dnd_status` (boolean)

```typescript
{
  dnd_status: boolean; // Default: false
}
```

### 2. **Announcement Ticker** → `announcements`

**Table**: `announcements`
**Columns**: `title`, `description`, `is_active`

```typescript
{
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}
```

### 3. **About Us Section** → `hotel_settings`

**Table**: `hotel_settings`
**Columns**: `about_us`, `about_us_button`

```typescript
{
  id: string;
  hotel_id: string;
  setting_key: string;
  setting_value: boolean;
  about_us: string | null;
  about_us_button: string | null;
  images_url: string | null; // For photo gallery
  created_at: string | null;
  updated_at: string | null;
}
```

### 4. **Photo Gallery** → `hotel_settings.images_url`

**Table**: `hotel_settings`
**Column**: `images_url` (string | null)

Note: The `images_url` field can store:

- Single URL
- JSON array of URLs: `["url1", "url2", "url3"]`
- Comma-separated URLs: `"url1,url2,url3"`

### 5. **Emergency Contacts** → `emergency_contacts`

**Table**: `emergency_contacts`
**Columns**: `contact_name`, `phone_number`, `is_active`

```typescript
{
  id: string;
  hotel_id: string;
  contact_name: string;
  phone_number: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}
```

---

## Existing Query Hooks Available

### ✅ Already Implemented:

1. **Announcements**:

   - `useAnnouncements(hotelId)` - Get all announcements
   - Located: `src/hooks/queries/hotel-management/announcements`

2. **Emergency Contacts**:

   - `useEmergencyContacts(hotelId)` - Get all emergency contacts
   - Located: `src/hooks/queries/hotel-management/emergency-contacts`

3. **Hotel Settings**:
   - `useHotelSettings(hotelId)` - Get all hotel settings
   - Located: `src/hooks/queries/useHotelSettings.ts`

### ❌ To Be Created:

1. **Guest DND Status**:
   - `useUpdateGuestDND()` - Update guest's do not disturb status
   - Need to create mutation hook

---

## Implementation Plan by Component

### 1️⃣ **DND Button in Header**

**Current State**: Mock/Static
**Target**: `guests.dnd_status`

**Required Changes**:

- Create `useUpdateGuestDND()` mutation hook
- Update `GuestHeader.tsx` to use real DND status from `guestData`
- Add toggle mutation to update database

**Files to Modify**:

- `src/pages/Guests/components/shared/GuestHeader.tsx`
- Create: `src/hooks/queries/useGuestQueries.ts` (if not exists)

**Implementation**:

```typescript
// Hook
export const useUpdateGuestDND = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      dndStatus,
    }: {
      guestId: string;
      dndStatus: boolean;
    }) => {
      const { data, error } = await supabase
        .from("guests")
        .update({ dnd_status: dndStatus })
        .eq("id", guestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest"] });
    },
  });
};

// Component
const { mutate: updateDND } = useUpdateGuestDND();
const handleDNDToggle = () => {
  updateDND({ guestId: guestData.id, dndStatus: !guestData.dnd_status });
};
```

---

### 2️⃣ **Announcement Ticker**

**Current State**: Mock data
**Target**: `announcements` table

**Required Changes**:

- Use existing `useAnnouncements(hotelId)` hook
- Filter active announcements
- Display `title` and `description` in ticker

**Files to Modify**:

- `src/pages/Guests/components/shared/AnnouncementBanner.tsx`
- `src/pages/Guests/GuestDashboard.tsx` (pass hotelId)

**Implementation**:

```typescript
import { useAnnouncements } from "@/hooks/queries/hotel-management/announcements";

const AnnouncementBanner = ({ hotelId }: { hotelId: string }) => {
  const { data: announcements } = useAnnouncements(hotelId);

  const activeAnnouncements = announcements?.filter((a) => a.is_active) || [];

  const announcementText = activeAnnouncements
    .map((a) => `${a.title} — ${a.description}`)
    .join("     •     ");

  // ... rest of component
};
```

---

### 3️⃣ **About Us Section**

**Current State**: Hardcoded hotel info
**Target**: `hotel_settings.about_us`, `hotel_settings.about_us_button`

**Required Changes**:

- Use existing `useHotelSettings(hotelId)` hook
- Extract `about_us` and `about_us_button` from settings
- Handle null/empty states with defaults

**Files to Modify**:

- `src/pages/Guests/pages/Home/components/AboutUsSection.tsx`
- `src/pages/Guests/pages/Home/HomePage.tsx` (pass hotelId)

**Implementation**:

```typescript
import { useHotelSettings } from "@/hooks/queries/useHotelSettings";

const AboutUsSection = ({ hotelId }: { hotelId: string }) => {
  const { data: settings } = useHotelSettings(hotelId);

  const aboutUsSetting = settings?.find(
    (s) => s.setting_key === "aboutSection"
  );
  const aboutUsText =
    aboutUsSetting?.about_us || "Default hotel description...";
  const buttonText = aboutUsSetting?.about_us_button || "Booking";

  // ... rest of component
};
```

---

### 4️⃣ **Photo Gallery**

**Current State**: Mock image URLs
**Target**: `hotel_settings.images_url`

**Required Changes**:

- Use existing `useHotelSettings(hotelId)` hook
- Parse `images_url` field (could be JSON array or comma-separated)
- Display gallery images from database

**Files to Modify**:

- `src/pages/Guests/pages/Home/components/PhotoGallerySection.tsx`
- `src/pages/Guests/pages/Home/HomePage.tsx` (pass hotelId)

**Implementation**:

```typescript
import { useHotelSettings } from "@/hooks/queries/useHotelSettings";

const PhotoGallerySection = ({ hotelId }: { hotelId: string }) => {
  const { data: settings } = useHotelSettings(hotelId);

  const gallerySetting = settings?.find(
    (s) => s.setting_key === "hotelPhotoGallery"
  );

  // Parse images_url (could be JSON array or comma-separated string)
  const parseImageUrls = (imagesUrl: string | null): string[] => {
    if (!imagesUrl) return [];

    try {
      // Try parsing as JSON array
      const parsed = JSON.parse(imagesUrl);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If not JSON, split by comma
      return imagesUrl
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }

    return [];
  };

  const imageUrls = parseImageUrls(gallerySetting?.images_url || null);

  const photos = imageUrls.map((url, index) => ({
    id: `photo-${index}`,
    imageUrl: url,
    title: `Hotel Photo ${index + 1}`,
  }));

  // ... rest of component
};
```

---

### 5️⃣ **Emergency Contacts Section**

**Current State**: Mock contacts
**Target**: `emergency_contacts` table

**Required Changes**:

- Use existing `useEmergencyContacts(hotelId)` hook
- Filter active contacts
- Display `contact_name` and `phone_number`

**Files to Modify**:

- `src/pages/Guests/pages/Home/components/EmergencyContactsSection.tsx`
- `src/pages/Guests/pages/Home/HomePage.tsx` (pass hotelId)

**Implementation**:

```typescript
import { useEmergencyContacts } from "@/hooks/queries/hotel-management/emergency-contacts";

const EmergencyContactsSection = ({ hotelId }: { hotelId: string }) => {
  const { data: contacts } = useEmergencyContacts(hotelId);

  const activeContacts = contacts?.filter((c) => c.is_active) || [];

  const formattedContacts = activeContacts.map((c) => ({
    id: c.id,
    name: c.contact_name,
    phoneNumber: c.phone_number,
  }));

  // ... rest of component
};
```

---

## Required New Files

### 1. Guest Queries Hook (if not exists)

**File**: `src/hooks/queries/useGuestQueries.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export const useUpdateGuestDND = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      dndStatus,
    }: {
      guestId: string;
      dndStatus: boolean;
    }) => {
      const { data, error } = await supabase
        .from("guests")
        .update({ dnd_status: dndStatus })
        .eq("id", guestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest"] });
    },
  });
};
```

---

## Data Flow

### Getting hotelId to Guest Components

The `hotelId` needs to flow from authentication → guest dashboard → components:

1. **GuestAuthService** returns `guestData` with `hotel_id`
2. **GuestDashboard** receives `guestData` and passes `hotel_id` to child components
3. **HomePage** receives `hotelId` and passes to all sections
4. Each section uses `hotelId` to fetch its specific data

**Update Required**:

```typescript
// GuestDashboard.tsx
<HomePage guestData={guestData} hotelId={guestData.hotel_id} />;

// HomePage.tsx
interface HomePageProps {
  guestData: GuestData;
  hotelId: string;
}

export const HomePage = ({ guestData, hotelId }: HomePageProps) => {
  // Pass hotelId to sections
  return (
    <>
      <AnnouncementBanner hotelId={hotelId} />
      <AboutUsSection hotelId={hotelId} />
      <PhotoGallerySection hotelId={hotelId} />
      <EmergencyContactsSection hotelId={hotelId} />
    </>
  );
};
```

---

## Implementation Order

### Phase 1: Simple Integrations (Read-Only)

1. ✅ Emergency Contacts (existing hook, filter active)
2. ✅ Announcements (existing hook, filter active, format text)
3. ✅ Photo Gallery (existing hook, parse images_url)
4. ✅ About Us (existing hook, extract fields)

### Phase 2: Interactive Feature (Write)

5. ✅ DND Button (create mutation hook, update on toggle)

---

## Testing Checklist

- [ ] Emergency contacts display correctly from database
- [ ] Only active emergency contacts are shown
- [ ] Announcements scroll with title + description
- [ ] Only active announcements are displayed
- [ ] About Us section shows database text
- [ ] About Us button text is customizable
- [ ] Photo gallery displays images from database
- [ ] Handles empty/null images_url gracefully
- [ ] DND button reflects current guest status
- [ ] DND toggle updates database
- [ ] DND change persists across sessions
- [ ] All components handle loading states
- [ ] All components handle error states
- [ ] Fallback to defaults when data is missing

---

## Next Steps

Ready to implement these integrations one by one. Which component would you like to start with?

1. Emergency Contacts (easiest)
2. Announcements
3. Photo Gallery
4. About Us
5. DND Button

Let me know and I'll proceed with the implementation!
