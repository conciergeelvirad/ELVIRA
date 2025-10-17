# Guest Chat Phone Icon - Missing reception_phone Fix

## 🐛 Issue

The phone icon is not visible in the Guest Chat Modal header because the `reception_phone` field is not being fetched from the database by the Edge Function.

## 📊 Current State

### Frontend (✅ Already Updated)

1. **HotelData Interface** - Updated to include `reception_phone`:

   ```typescript
   export interface HotelData {
     name: string;
     city?: string | null;
     country?: string | null;
     reception_phone?: string | null; // ✅ Added
   }
   ```

2. **Component Chain** - All updated to pass `reception_phone`:
   - `GuestDashboard` → `GuestLayout` → `GuestChatModal` ✅
3. **Phone Icon UI** - Implemented in `GuestChatModal.tsx`:
   ```tsx
   {
     receptionPhone && (
       <a href={`tel:${receptionPhone}`}>
         <Phone className="w-5 h-5" />
       </a>
     );
   }
   ```

### Backend (❌ Needs Update)

The **guest-auth Edge Function** currently only fetches:

```typescript
hotelData: {
  name: string;
  city?: string | null;
  country?: string | null;
}
```

It needs to also fetch `reception_phone` from the `hotels` table.

## 🔧 Required Fix

### Edge Function Update Required

**File**: `supabase/functions/guest-auth/index.ts` (or similar)

**Current Query** (approximate):

```typescript
const { data: hotel } = await supabaseClient
  .from("hotels")
  .select("name, city, country")
  .eq("id", guestData.hotel_id)
  .single();
```

**Updated Query** (add reception_phone):

```typescript
const { data: hotel } = await supabaseClient
  .from("hotels")
  .select("name, city, country, reception_phone") // ✅ Add reception_phone
  .eq("id", guestData.hotel_id)
  .single();
```

**Updated Response**:

```typescript
return new Response(
  JSON.stringify({
    success: true,
    token: jwtToken,
    guestData: {
      // ... guest fields
    },
    hotelData: {
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      reception_phone: hotel.reception_phone, // ✅ Add this field
    },
  }),
  {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  }
);
```

## 🧪 Testing After Fix

1. **Deploy Edge Function** with updated query
2. **Clear localStorage** in browser to force new session
3. **Re-login** as guest with room number and verification code
4. **Open Chat Modal** - Phone icon should now appear in header
5. **Check Console Logs**:
   ```
   📞 [Guest Dashboard] Reception phone: +1234567890
   📞 [GuestChatModal] Reception phone: +1234567890
   ```

## 🎯 Alternative: Temporary Mock Data (For Testing Only)

If you want to test the UI immediately while waiting for the Edge Function update:

**File**: `src/pages/Guests/GuestDashboard.tsx`

```typescript
// Add mock data after getting session
const session = getGuestSession();
if (session && session.hotelData) {
  // Temporary mock data for testing
  session.hotelData.reception_phone = "+1-555-0123";
}
```

⚠️ **Note**: This is only for testing the UI. Remove it once the Edge Function is updated.

## 📋 Database Verification

Verify the `reception_phone` field exists in the hotels table:

```sql
SELECT id, name, reception_phone
FROM hotels
WHERE id = 'your-hotel-id';
```

If the field doesn't exist, add it:

```sql
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS reception_phone TEXT;

-- Update with actual phone number
UPDATE hotels
SET reception_phone = '+1-555-0100'
WHERE id = 'your-hotel-id';
```

## ✅ Success Criteria

- [ ] Edge Function updated to fetch `reception_phone`
- [ ] Phone icon visible in Guest Chat Modal header
- [ ] Clicking phone icon initiates call to reception
- [ ] Console logs show `reception_phone` value
- [ ] Icon only appears when phone number exists

## 📝 Console Logs Added for Debugging

Added logs to help track the data flow:

1. **GuestDashboard.tsx** (line 52):

   ```
   📞 [Guest Dashboard] Reception phone: {value}
   ```

2. **GuestChatModal.tsx** (line 54):
   ```
   📞 [GuestChatModal] Reception phone: {value}
   ```

Check these logs to verify if `reception_phone` is being received from the Edge Function.
