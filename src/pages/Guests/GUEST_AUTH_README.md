# Guest Authentication Flow

## Overview

This document describes the guest authentication system that allows hotel guests to access their dashboard using their room number and verification code.

## Authentication Process

### 1. Guest Login Page (`/guest`)

- Guests enter their **room number** and **access code** (verification code)
- The form validates and submits the credentials

### 2. Authentication Service (`guestAuth.service.ts`)

The `authenticateGuest` function performs the following steps:

1. **Query Database**: Searches the `guests` table for an active guest with the provided room number
2. **Validate Guest**: Checks if a matching guest exists and is active (`is_active = true`)
3. **Check Expiration**: Verifies that the access code hasn't expired (`access_code_expires_at > now`)
4. **Verify Code**: Compares the provided verification code with `hashed_verification_code`
5. **Return Result**: Returns success with guest data or an error message

### 3. Session Management

Upon successful authentication:

- Guest session data is stored in `localStorage`
- User is redirected to `/guest/dashboard`

### 4. Guest Dashboard (`/guest/dashboard`)

- Loads guest session from `localStorage`
- Validates session hasn't expired
- Displays "Connected as guest" message
- Redirects to login if session is invalid

## Database Schema

### `guests` Table Fields Used

```typescript
{
  id: string; // Guest unique identifier
  room_number: string; // Room number (used for login)
  hashed_verification_code: string; // Verification code (currently plain text)
  guest_name: string; // Guest's full name
  hotel_id: string; // Associated hotel
  is_active: boolean; // Guest active status
  access_code_expires_at: string; // Access expiration timestamp
}
```

## Logging

The system includes comprehensive console logging for debugging:

### Login Page Logs

- 🚀 Form submission
- 📝 Input validation
- 🔐 Authentication initiation
- 📊 Authentication results
- ✅ Success scenarios
- ⚠️ Warning scenarios
- 🧭 Navigation events

### Authentication Service Logs

- 🔐 Authentication start
- 📋 Input parameters
- 📊 Database query results
- 👤 Guest found information
- ⏰ Expiration checks
- 🔍 Verification process
- ✅ Success confirmation
- ❌ Failure reasons
- 💾 Session storage
- 📬 Session retrieval
- 🗑️ Session clearing

### Dashboard Logs

- 🏠 Component lifecycle
- ✅ Session validation
- ⚠️ Expiration warnings
- 🎨 Render events

## Security Notes

⚠️ **IMPORTANT**: The current implementation uses **plain text comparison** for verification codes.

### Production Recommendations:

1. **Use bcrypt for password hashing**:

   ```typescript
   import bcrypt from "bcrypt";

   // When creating a guest
   const hashedCode = await bcrypt.hash(verificationCode, 10);

   // When authenticating
   const isValid = await bcrypt.compare(
     verificationCode,
     guest.hashed_verification_code
   );
   ```

2. **Implement rate limiting** to prevent brute force attacks

3. **Use HTTPS** in production

4. **Consider JWT tokens** instead of localStorage for session management

5. **Add CSRF protection**

6. **Implement session timeout** with automatic logout

## Usage Example

### For Testing

To test the guest authentication, you need a guest record in the database:

```sql
INSERT INTO guests (
  hotel_id,
  room_number,
  guest_name,
  hashed_verification_code,
  is_active,
  access_code_expires_at
) VALUES (
  'your-hotel-id',
  '105',
  'John Doe',
  '998218',  -- This should be hashed in production
  true,
  NOW() + INTERVAL '30 days'
);
```

Then login with:

- **Room Number**: `105`
- **Access Code**: `998218`

## File Structure

```
src/
├── pages/
│   ├── auth/
│   │   └── GuestLoginPage.tsx      # Guest login form
│   └── Guests/
│       ├── GuestDashboard.tsx       # Guest dashboard
│       ├── components/              # Guest-specific components
│       ├── hooks/                   # Guest-specific hooks
│       └── index.ts                 # Exports
├── services/
│   └── guestAuth.service.ts        # Guest authentication logic
└── App.tsx                         # Route configuration
```

## Routes

- `/guest` - Guest login page
- `/guest/dashboard` - Guest dashboard (requires authentication)
- `/login` - Staff login page (default)

## Future Enhancements

1. **Guest-specific features**:

   - Room service ordering
   - Concierge chat
   - Hotel information
   - Check-out management

2. **Enhanced security**:

   - Two-factor authentication
   - Biometric support
   - Device fingerprinting

3. **Better UX**:

   - Remember device
   - Quick access QR codes
   - Push notifications

4. **Analytics**:
   - Login tracking
   - Feature usage
   - Guest preferences
