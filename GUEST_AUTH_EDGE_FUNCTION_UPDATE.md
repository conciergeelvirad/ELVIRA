# Guest Authentication Update - Edge Function Integration

## ✅ Changes Made

The guest authentication has been updated to use your existing **Edge Function** (`guest-auth`) instead of direct database queries. This properly handles bcrypt password verification through the `verify_guest_code` RPC function.

---

## 🔄 What Was Changed

### 1. **Guest Auth Service** (`src/services/guestAuth.service.ts`)

**Before**: Direct Supabase database queries with plain text comparison  
**After**: Calls the `guest-auth` Edge Function

#### Key Changes:

- ✅ Calls `/functions/v1/guest-auth` Edge Function
- ✅ Sends `roomNumber` and `verificationCode` in request body
- ✅ Receives JWT token, complete guest data, and hotel data
- ✅ Proper bcrypt verification via `verify_guest_code` RPC
- ✅ Updated TypeScript interfaces to match Edge Function response

#### New Response Structure:

```typescript
{
  success: boolean;
  token?: string;
  guestData?: {
    id: string;
    room_number: string;
    guest_name: string;
    hotel_id: string;
    is_active: boolean;
    access_code_expires_at: string;
    dnd_status: boolean;
    guest_personal_data?: {
      guest_email?: string | null;
      country?: string | null;
      language?: string | null;
    };
  };
  hotelData?: {
    name: string;
    city?: string | null;
    country?: string | null;
  };
  error?: string;
}
```

### 2. **Session Management** (`src/services/guestAuth.service.ts`)

- Updated to store full session data including JWT token
- Session now includes: `token`, `guestData`, `hotelData`
- Properly typed for TypeScript

### 3. **Guest Login Page** (`src/pages/auth/GuestLoginPage.tsx`)

- Updated to handle new response structure
- Stores token along with guest and hotel data
- Enhanced logging for debugging

### 4. **Guest Dashboard** (`src/pages/Guests/GuestDashboard.tsx`)

- Updated to read new session structure
- Validates session contains `guestData`
- Still performs expiration checking

---

## 🔐 Authentication Flow

```
1. User enters room number & verification code
   ↓
2. Frontend calls Edge Function at:
   POST {SUPABASE_URL}/functions/v1/guest-auth
   ↓
3. Edge Function calls verify_guest_code RPC:
   - Uses PostgreSQL crypt() for bcrypt verification
   - Returns guest.* if valid
   ↓
4. Edge Function:
   - Fetches complete guest + personal data
   - Fetches hotel information
   - Generates JWT token
   - Returns full response
   ↓
5. Frontend stores session and navigates to dashboard
```

---

## 🧪 Testing

### Test Credentials (from your screenshot):

- **Room Number**: `006`
- **Access Code**: The 6-digit code from check-in

### What to Check in Console:

1. **Edge Function Call**:

   ```
   🌐 [Guest Auth] Calling Edge Function: {url}/functions/v1/guest-auth
   ```

2. **Successful Response**:

   ```
   ✅ [Guest Auth] Authentication successful!
   👤 [Guest Auth] Guest data: {id, name, room, hotel_id}
   🏨 [Guest Auth] Hotel data: {name, city, country}
   ```

3. **Session Storage**:

   ```
   💾 [Guest Auth] Storing guest session in localStorage
   ```

4. **Navigation**:
   ```
   🧭 [Guest Login Page] Navigating to guest dashboard...
   ```

---

## 🔍 RPC Function Reference

Your `verify_guest_code` RPC function:

```sql
SELECT g.*
FROM public.guests g
WHERE g.room_number = p_room
  AND g.is_active = true
  AND g.hashed_verification_code = crypt(p_code, g.hashed_verification_code)
LIMIT 1;
```

This uses PostgreSQL's `crypt()` function which:

- Takes the plain text code (`p_code`)
- Uses the stored hash as the salt
- Returns true if the bcrypt hash matches

---

## 📋 Environment Variables Required

Make sure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The Edge Function also requires:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ELVIRA_JWT_SECRET=your_jwt_secret
```

---

## 🐛 Troubleshooting

### If authentication fails:

1. **Check Edge Function Logs** in Supabase Dashboard
2. **Check Browser Console** for detailed logs
3. **Verify guest exists** in database:
   ```sql
   SELECT * FROM guests WHERE room_number = '006' AND is_active = true;
   ```
4. **Verify RPC function** works:
   ```sql
   SELECT * FROM verify_guest_code('006', 'your_code');
   ```

### Common Issues:

| Issue            | Solution                              |
| ---------------- | ------------------------------------- |
| CORS error       | Edge Function has proper CORS headers |
| 401 Unauthorized | Check if guest is `is_active = true`  |
| 404 Not Found    | Verify Edge Function is deployed      |
| Invalid code     | RPC bcrypt verification is working    |

---

## 🎯 Next Steps

1. ✅ Test the login flow with valid credentials
2. ✅ Verify JWT token is stored in session
3. ✅ Check dashboard loads correctly
4. ✅ Verify expiration logic works

### Future Enhancements:

- Use the JWT token for authenticated API calls
- Add guest-specific features to the dashboard
- Implement session refresh mechanism
- Add logout functionality

---

## 📝 Files Modified

```
src/
├── services/
│   └── guestAuth.service.ts         ✅ Rewritten to call Edge Function
├── pages/
│   ├── auth/
│   │   └── GuestLoginPage.tsx       ✅ Updated for new response
│   └── Guests/
│       └── GuestDashboard.tsx        ✅ Updated for new session structure
```

---

## 🚀 Ready to Test!

Your guest authentication now properly uses:

- ✅ Bcrypt verification via RPC function
- ✅ Edge Function for secure authentication
- ✅ JWT token generation
- ✅ Complete guest and hotel data
- ✅ Comprehensive logging

Try logging in with room `006` and your verification code!
