# Guest Creation with Translation Integration

## Overview

Complete integration of multi-guest creation with automatic email translation based on guest's preferred language.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. GuestManagementPage                                        │
│     └─> useGuestCRUD hook                                      │
│         └─> DynamicForm with enableMultiGuest={true}          │
│             └─> MultiGuestCarousel                            │
│                 └─> Collects multiple guest data              │
│                                                                 │
│  2. Form Submission                                            │
│     └─> transformCreate()                                      │
│         └─> Prepares data with additional_guests_data[]       │
│                                                                 │
│  3. useCreateGuest mutation                                    │
│     └─> Calls Edge Function: create-guest-with-translation    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              EDGE FUNCTION: create-guest-with-translation       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Validate authentication & input data                       │
│  2. Hash verification code                                     │
│  3. Insert into guests table                                   │
│  4. Insert into guest_personal_data table                      │
│     └─> Stores additional_guests_data as JSONB                │
│  5. Insert into room_cleaning_status table                     │
│  6. Get hotel name from database                               │
│  7. TRANSLATE email content (if language ≠ English)            │
│     └─> Parallel OpenAI API calls                             │
│         ├─> Subject line                                       │
│         ├─> Greeting                                           │
│         ├─> Welcome text                                       │
│         ├─> Section titles                                     │
│         ├─> Instructions list                                  │
│         └─> Services list                                      │
│  8. Send translated email via Resend API                       │
│  9. Return success response                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Components Modified

### 1. **DynamicForm.tsx**

**Location**: `src/components/common/crud/DynamicForm.tsx`

**Changes**:

- Added multi-guest data store: `guestDataStore`
- Tracks current guest index: `currentGuestIndex`
- Collects all guest data before submission
- Stores additional guests in `_additionalGuests` field
- React.useEffect hook aggregates all guest data

**Key Functions**:

```typescript
// Save & switch between guests
const handleGuestChange = (newIndex: number) => { ... }

// Add new guest slot
const handleGuestAdd = (newIndex: number) => { ... }

// Auto-collect additional guests (useEffect)
// Stores in formActions.updateField("_additionalGuests", additionalGuests)
```

### 2. **useGuestCRUD.tsx**

**Location**: `src/pages/Hotel/hooks/useGuestCRUD.tsx`

**Changes**:

- Enhanced `transformCreate` function
- Collects `_additionalGuests` from form data
- Passes `additional_guests_data` to edge function
- Defaults language to "english" if not provided
- Added comprehensive logging

**Data Transformation**:

```typescript
transformCreate: (data) => ({
  guestData: { ... },
  personalData: {
    first_name, last_name, guest_email,
    phone_number, date_of_birth,
    country, language: data.language || "english",
    additional_guests_data: additionalGuests.length > 0 ? additionalGuests : undefined
  }
})
```

### 3. **useGuestQueries.ts**

**Location**: `src/hooks/queries/hotel-management/guests/useGuestQueries.ts`

**Changes**:

- `useCreateGuest()` now calls edge function instead of direct DB insert
- Prepares data for `create-guest-with-translation` endpoint
- Returns email status, language, and detailed message
- Comprehensive error logging

**Edge Function Call**:

```typescript
const { data, error } = await supabase.functions.invoke(
  "create-guest-with-translation",
  { body: requestData }
);
```

## Edge Function Details

### **create-guest-with-translation**

**Endpoint**: `/functions/v1/create-guest-with-translation`

**Input Parameters**:

```typescript
{
  hotelId: string;
  roomNumber: string;
  verificationCode: string; // 6-digit access code
  firstName: string;
  lastName: string;
  guestEmail: string;
  telephone?: string;
  dateOfBirth?: string;
  country: string;
  language: string; // Guest's preferred language
  codeExpiresAt: string; // ISO date
  isActive?: boolean;
  dndStatus?: boolean;
  additionalGuests?: Array<GuestData>; // Multiple guests
}
```

**Response**:

```typescript
{
  success: boolean;
  guestId: string;
  guestName: string;
  roomNumber: string;
  language: string;
  emailSent: boolean;
  message: string;
}
```

**Translation Process**:

1. Checks if `language !== "english"`
2. Makes parallel OpenAI API calls to translate:
   - Email subject
   - Greeting text
   - Welcome message
   - Section titles (How to Access, What You Can Do)
   - All instruction steps
   - All service items
3. Formats date/time in guest's locale
4. Sends fully translated HTML email

## Database Schema

### **guests table**

```sql
- id (uuid)
- hotel_id (uuid)
- room_number (text)
- guest_name (text)
- hashed_verification_code (text)
- access_code_expires_at (timestamptz)
- is_active (boolean)
- dnd_status (boolean)
- created_by (uuid)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### **guest_personal_data table**

```sql
- guest_id (uuid) FK -> guests
- first_name (text)
- last_name (text)
- guest_email (text)
- phone_number (text)
- date_of_birth (date)
- country (text)
- language (text) ← Used for translation
- additional_guests_data (jsonb) ← Stores multiple guests
- updated_at (timestamptz)
```

## Logging & Debugging

### **Frontend Logs**:

```
🔄 [useGuestCRUD] transformCreate called with data: {...}
📋 [useGuestCRUD] Prepared main guest: {...}
👥 [useGuestCRUD] Additional guests count: X
👥 [useGuestCRUD] Additional guests data: [...]
✅ [useGuestCRUD] Final transformed data: {...}

🚀 [useCreateGuest] Starting guest creation process...
📦 [useCreateGuest] Guest data: {...}
📦 [useCreateGuest] Personal data: {...}
📤 [useCreateGuest] Calling edge function with data: {...}
✅ [useCreateGuest] Guest created successfully: {...}
📧 [useCreateGuest] Email sent: YES/NO
🌍 [useCreateGuest] Language: spanish
✅ [useCreateGuest] onSuccess - Invalidating queries
```

### **Edge Function Logs**:

```
📥 Preparing guest_personal_data insert: {...}
✅ guest_personal_data insert successful for guest_id: xxx
✅ room_cleaning_status inserted for hotel_id: xxx, room: 101
✅ Email content translated to spanish
✅ Translated email sent: {...}
```

### **Error Logs**:

```
❌ [useCreateGuest] Edge function error: {...}
❌ [useCreateGuest] Edge function returned failure: {...}
💥 [useCreateGuest] Mutation error: {...}
❌ guest_personal_data insert error: {...}
❌ room_cleaning_status insert error: {...}
⚠️ Translation failed, using English: {...}
```

## Testing Checklist

### ✅ **Single Guest Creation**

- [ ] Fill out form for one guest
- [ ] Select language (e.g., Spanish)
- [ ] Submit form
- [ ] Verify guest created in database
- [ ] Check email received in selected language

### ✅ **Multi-Guest Creation**

- [ ] Fill out main guest (Guest 1)
- [ ] Click "Add Another Guest"
- [ ] Fill out Guest 2 with different data
- [ ] Click "Add Another Guest"
- [ ] Fill out Guest 3
- [ ] Navigate back to Guest 1 - data should persist
- [ ] Submit form
- [ ] Verify main guest in `guests` table
- [ ] Verify additional guests in `guest_personal_data.additional_guests_data`
- [ ] Check email sent to main guest in their language

### ✅ **Language Translation**

- [ ] Test with English (no translation)
- [ ] Test with Spanish (should translate)
- [ ] Test with French (should translate)
- [ ] Test with German (should translate)
- [ ] Verify all email sections translated correctly

### ✅ **Error Handling**

- [ ] Invalid email address - should show error
- [ ] Missing required fields - should show validation
- [ ] Edge function failure - should display error message
- [ ] Translation failure - should fallback to English
- [ ] Email send failure - guest still created

## Supported Languages

Currently configured in `src/utils/constants/languages.ts`:

- English, Spanish, French, German, Italian, Portuguese
- Chinese (Simplified & Traditional), Japanese, Korean
- Arabic, Russian, Hindi, Bengali, Urdu
- And 30+ more languages...

## Environment Variables Required

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
RESEND_API_KEY=re_your-resend-key
```

## Future Enhancements

1. **Batch Email Sending**: Send separate emails to all additional guests
2. **SMS Notifications**: Send access code via SMS in guest's language
3. **Template Customization**: Allow hotels to customize email templates
4. **Language Auto-Detection**: Detect language from guest's email/phone
5. **Offline Mode**: Queue emails if translation/send fails
6. **Analytics**: Track which languages are most common

## Deployment

1. **Deploy Edge Function**:

```bash
supabase functions deploy create-guest-with-translation
```

2. **Set Environment Variables**:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set RESEND_API_KEY=re_...
```

3. **Test Locally**:

```bash
supabase functions serve create-guest-with-translation
```

4. **Monitor Logs**:

```bash
supabase functions logs create-guest-with-translation
```

## Success Criteria

✅ Guest created in database
✅ Personal data stored with language preference
✅ Additional guests stored in JSONB array
✅ Email translated to guest's language
✅ Email sent successfully
✅ Room cleaning status created
✅ All errors logged comprehensively

---

**Last Updated**: October 17, 2025
**Status**: ✅ Ready for Testing
**Next Steps**: Deploy and test with real guest data
