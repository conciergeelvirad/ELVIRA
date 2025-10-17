# Send Staff Calendar Integration - Complete

## Overview

Integrated the "Send Calendar" button with edge function to email staff schedules with confirmation modal and comprehensive logging.

## Files Created/Modified

### 1. **New Hook: `useSendStaffCalendar.ts`**

**Location**: `src/hooks/queries/hotel-management/staff/useSendStaffCalendar.ts`

**Purpose**: React Query mutation hook for sending calendar emails via edge function

**Key Features**:

- Calls `send-staff-calendar-mail` edge function
- Handles JWT authentication automatically
- Comprehensive logging for debugging
- TypeScript interfaces for request/response

**Usage**:

```typescript
const { mutate: sendCalendar, isPending } = useSendStaffCalendar();

sendCalendar(
  { hotelId },
  {
    onSuccess: (data) => console.log("Sent:", data.successfulEmails),
    onError: (error) => console.error("Failed:", error.message),
  }
);
```

### 2. **Updated: `StaffScheduleCalendar.tsx`**

**Location**: `src/pages/Hotel/components/staff/calendar/StaffScheduleCalendar.tsx`

**Changes**:

- ✅ Added `useSendStaffCalendar` hook
- ✅ Added `useConfirmDialog` hook for confirmation
- ✅ Added `useToast` for user feedback
- ✅ Implemented `handleSendCalendar` with:
  - Hotel ID validation
  - Confirmation modal before sending
  - Success/error toast notifications
  - Comprehensive console logging
- ✅ Added `ConfirmationModal` component to JSX

## Edge Function Integration

### **Function Name**: `send-staff-calendar-mail`

### **Request Body**:

```json
{
  "hotelId": "uuid-string"
}
```

### **Headers**:

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

### **Response**:

```json
{
  "success": true,
  "message": "Calendar emails sent! X successful, Y failed.",
  "totalStaff": 10,
  "successfulEmails": 9,
  "failedEmails": 1,
  "emailResults": [
    {
      "staffName": "John Doe",
      "staffEmail": "john@example.com",
      "success": true,
      "emailId": "re_xxx"
    }
  ],
  "recipient": "no-reply@elviradc.com"
}
```

## Permissions Required

The edge function checks:

- ✅ `profiles.role = 'hotel'`
- ✅ `hotel_staff.position = 'Hotel Admin'`
- ✅ `hotel_staff.department = 'Manager'`
- ✅ `hotel_staff.id = authenticatedUserId` (direct match)
- ✅ `hotel_staff.status = 'active'`
- ✅ OR `profiles.role = 'elvira_admin'`

## User Flow

1. **User clicks "Send Calendar" button**
2. **Confirmation modal appears**:
   - Title: "Send Calendar Emails"
   - Message: "This will send schedule emails to all active staff members..."
   - Buttons: "Cancel" | "Send Emails"
3. **If confirmed**:
   - Edge function is called
   - Loading state shown on modal
   - Console logs progress
4. **On Success**:
   - ✅ Toast: "Calendar emails sent successfully! X emails sent"
   - Console logs full results
5. **On Error**:
   - ❌ Toast: Error message
   - Console logs full error details

## Logging

### **Frontend Logs** (Browser Console):

```
🎯 handleSendCalendar triggered
🏨 Current hotelId: xxx-xxx-xxx
📋 Showing confirmation dialog...
✅ User confirmation: true
🚀 Initiating calendar email send...
📤 Sending request with hotelId: xxx

====================================
📧 SEND STAFF CALENDAR - START
====================================
🏨 Hotel ID: xxx-xxx-xxx
🌐 Supabase URL: https://...
🔐 Getting user session...
📋 Session status: Active
👤 User ID: xxx-xxx-xxx
📧 User email: user@example.com
🔑 Token length: 1234
📦 Request body: { "hotelId": "xxx" }
🚀 Calling edge function: send-staff-calendar-mail
📥 Edge function response received
✅ SUCCESS! Calendar emails sent
📊 Results: { ... }
  - Total staff: 10
  - Successful emails: 9
  - Failed emails: 1
====================================

🎉 CALENDAR EMAIL SUCCESS
====================================
📊 Full response data: { ... }
👥 Total staff: 10
✅ Successful emails: 9
❌ Failed emails: 1
📧 Recipient: no-reply@elviradc.com
====================================
```

### **Error Logs** (if failed):

```
====================================
💥 CRITICAL ERROR in sendStaffCalendar
====================================
Error type: Error
Error message: Failed to send a request to the Edge Function
Full error object: { ... }
====================================

💥 CALENDAR EMAIL ERROR
====================================
Error object: Error { ... }
Error message: Failed to send...
====================================
```

## Edge Function Details

### **Correct Column Names Used**:

- ✅ `schedule_start_date` (date)
- ✅ `schedule_finish_date` (date)
- ✅ `shift_start` (time)
- ✅ `shift_end` (time)
- ✅ `status` (SCHEDULED, CONFIRMED, COMPLETED, CANCELLED)
- ✅ `notes` (text)
- ✅ `hotel_id` (uuid)
- ✅ `staff_id` (uuid)

### **Email Content**:

- 📧 Professional HTML email with hotel branding
- 📅 Shows next 30 days of schedules
- 📊 Date ranges for multi-day shifts
- 🎨 Color-coded status badges
- 📝 Important reminders section
- ✉️ Plain text fallback

### **Email Recipient** (Currently Testing):

- To: `no-reply@elviradc.com` (test account)
- From: `onboarding@resend.dev`
- Subject: `Your Work Schedule - {Hotel Name}`

**Note**: Change recipient to `staffEmail` in production

## Testing Checklist

- [ ] Click "Send Calendar" button
- [ ] Verify confirmation modal appears
- [ ] Click "Cancel" - should close without sending
- [ ] Click "Send Calendar" again
- [ ] Click "Send Emails" - should trigger sending
- [ ] Check browser console for detailed logs
- [ ] Verify toast notification appears
- [ ] Check Supabase Edge Function logs
- [ ] Verify email received at no-reply@elviradc.com
- [ ] Check email formatting and content
- [ ] Test with multiple staff members
- [ ] Test with staff having no schedules
- [ ] Test permission denied scenario

## Troubleshooting

### **Error: "Failed to send a request to the Edge Function"**

**Possible causes**:

1. Edge function not deployed
2. Function name mismatch
3. CORS issue
4. Network timeout

**Debug steps**:

1. Check browser console for full error logs
2. Check Supabase Dashboard > Edge Functions > Logs
3. Verify function is deployed: `send-staff-calendar-mail`
4. Check if user has proper permissions
5. Verify RESEND_API_KEY is set in edge function secrets

### **Error: "Access denied"**

**Cause**: User doesn't have required permissions

**Required**:

- Profile role: `hotel`
- Staff position: `Hotel Admin`
- Staff department: `Manager`

### **No emails received**

**Check**:

1. Edge function logs in Supabase
2. Resend API dashboard for send status
3. Current recipient is test account: `no-reply@elviradc.com`
4. Change to actual staff emails in production

## Next Steps

1. **Deploy Edge Function**:

   ```bash
   supabase functions deploy send-staff-calendar-mail
   ```

2. **Set Environment Variables**:

   ```bash
   supabase secrets set RESEND_API_KEY=your_key_here
   ```

3. **Test thoroughly** with comprehensive logs

4. **Switch to production email** (change recipient in edge function)

5. **Monitor logs** for any issues

## Production Checklist

- [ ] Edge function deployed
- [ ] RESEND_API_KEY configured
- [ ] Permissions tested
- [ ] Email template approved
- [ ] Switch from test recipient to actual staff emails
- [ ] Error handling verified
- [ ] Rate limiting considered
- [ ] Email delivery monitoring set up

---

**Status**: ✅ Integration Complete with Comprehensive Logging
**Last Updated**: October 16, 2025
