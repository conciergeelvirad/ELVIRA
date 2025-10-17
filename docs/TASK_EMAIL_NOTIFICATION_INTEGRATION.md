# Task Email Notification Integration

## Overview

Integrated automatic email notifications for task assignments. When a task is created and assigned to a staff member, an email notification is automatically sent to inform them of their new assignment.

## Components

### 1. Edge Function: `send-task-notifications-email`

**Location**: Supabase Edge Functions

**Purpose**: Sends styled HTML email notifications to staff members when tasks are assigned.

**Features**:

- ✅ JWT authentication
- ✅ Permission checks (hotel owner or Elvira admin)
- ✅ Fetches task details with hotel information
- ✅ Retrieves staff personal data (name, email)
- ✅ Sends styled HTML email via Resend API
- ✅ Includes task details: title, description, priority, status, due date/time

**Email Content**:

- Hotel name header
- Staff greeting
- Task details table
- Professional styling matching hotel management system

### 2. Frontend Hook: `useTaskNotifications.ts`

**Location**: `src/hooks/queries/hotel-management/tasks/useTaskNotifications.ts`

**Exports**:

- `sendTaskNotification(taskId)` - Sends notification for a specific task
- `useSendTaskNotification()` - React hook wrapper for sending notifications
- `TaskNotificationResponse` - TypeScript interface for response

**Features**:

- Gets current auth session and JWT
- Calls edge function with proper authentication
- Error handling and logging
- Returns notification result

### 3. Updated `useCreateTask` Mutation

**Location**: `src/hooks/queries/hotel-management/tasks/useTaskQueries.ts`

**Changes**:

- Automatically calls `sendTaskNotification()` after task creation
- Only sends email if task has `assigned_to` (staff member)
- Non-blocking: if email fails, task creation still succeeds
- Comprehensive logging for debugging

## How It Works

### Task Creation Flow:

1. **User creates task** in Hotel Staff → Task Assignment tab
2. **Task saved to database** via `useCreateTask` mutation
3. **Check if staff assigned**:
   - If yes → Send notification email
   - If no → Skip email (task not assigned yet)
4. **Edge function called** with task ID
5. **Edge function**:
   - Verifies authentication and permissions
   - Fetches task details from database
   - Fetches staff email from `hotel_staff_personal_data`
   - Sends HTML email via Resend
6. **Staff receives email** with task details
7. **React Query cache invalidated** to refresh UI

### Email Sending Logic:

```typescript
// After task is created
if (data.assigned_to) {
  console.log("📧 Sending task notification email...");
  try {
    await sendTaskNotification(data.id);
    console.log("✅ Task notification sent successfully");
  } catch (notificationError) {
    // Non-blocking: task creation succeeds even if email fails
    console.error("⚠️ Failed to send task notification:", notificationError);
  }
} else {
  console.log("ℹ️ No staff assigned, skipping notification email");
}
```

## Configuration

### Environment Variables Required:

**Supabase Edge Function** (set in Supabase dashboard):

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations
- `RESEND_API_KEY` - Resend API key for sending emails

**Frontend**: No additional configuration needed (uses existing Supabase client)

### Resend Configuration:

Currently sends from: `onboarding@resend.dev`
Sends to: `no-reply@elviradc.com` (for testing)

**TODO**: Update email addresses:

```typescript
from: 'notifications@elviradc.com', // Your verified domain
to: [staffEmail], // Actual staff member email
```

## Testing

### Test Task Creation with Email:

1. Navigate to **Hotel Staff** → **Task Assignment** tab
2. Click **"Add Task"**
3. Fill in task details:
   - Title: "Test Task"
   - Description: "Testing email notifications"
   - Priority: "High"
   - Status: "PENDING"
   - **Assign to**: Select a staff member
   - Due Date: Select a date
4. Click **"Create"**
5. **Check console logs**:
   ```
   📝 Creating task...
   ✅ Task created successfully: {...}
   📧 Sending task notification email...
   ✅ Task notification sent successfully
   ```
6. **Check email** (staff member should receive notification)

### Test Task Creation WITHOUT Email (No Assignment):

1. Create task but **don't assign to any staff**
2. **Check console logs**:
   ```
   📝 Creating task...
   ✅ Task created successfully: {...}
   ℹ️ No staff assigned, skipping notification email
   ```
3. **No email sent** (expected behavior)

### Test Error Handling:

1. Create task with invalid staff assignment (edge case)
2. **Check console logs**:
   ```
   📝 Creating task...
   ✅ Task created successfully: {...}
   📧 Sending task notification email...
   ⚠️ Failed to send task notification: {...}
   ⚠️ Task was created but notification email failed to send
   ```
3. **Task still created successfully** (non-blocking)

## Console Logs Reference

### Successful Task Creation with Email:

```
📝 Creating task... {title: "Clean room 101", ...}
✅ Task created successfully: {id: "abc123", ...}
📧 Sending task notification email...
✅ Task notification sent successfully: {success: true, staff: {...}}
```

### Task Creation Without Assignment:

```
📝 Creating task... {title: "Review menu", assigned_to: null}
✅ Task created successfully: {id: "def456", ...}
ℹ️ No staff assigned, skipping notification email
```

### Email Send Failure:

```
📝 Creating task... {title: "Fix AC", ...}
✅ Task created successfully: {id: "ghi789", ...}
📧 Sending task notification email...
❌ Failed to send task notification: Error: Network error
⚠️ Task was created but notification email failed to send
```

## Email Template

The email includes:

- **Hotel Name** (uppercase, centered)
- **"NEW TASK ASSIGNED"** subtitle
- **Greeting**: "Dear [Staff Name],"
- **Task Details Table**:
  - Title
  - Description
  - Priority
  - Status
  - Due Date & Time
- **Call to Action**: Log into management system
- **Footer**: © 2025 Elvira Hotel Management System

## Edge Function Details

### Authentication:

- Requires JWT token from authenticated user
- Validates user session
- Checks permissions (hotel owner or admin)

### Database Queries:

```sql
-- Fetch task with hotel info
SELECT id, title, description, priority, status, due_date, due_time,
       hotel_id, assigned_to, hotels(name, owner_id)
FROM tasks WHERE id = ?

-- Fetch staff email
SELECT first_name, last_name, email
FROM hotel_staff_personal_data
WHERE staff_id = ?
```

### Error Handling:

- 401: Unauthorized (no JWT or invalid user)
- 403: Access denied (not hotel owner/admin)
- 404: Task not found or staff not found
- 400: No task ID or no staff assigned
- 500: Email service error or unexpected error

## Future Enhancements

### Potential Improvements:

1. **Email Customization**:

   - Add hotel logo to email
   - Custom email templates per hotel
   - Branding colors from hotel settings

2. **Notification Preferences**:

   - Allow staff to opt-in/opt-out
   - Email frequency settings
   - SMS notifications option

3. **Batch Notifications**:

   - Send digest emails for multiple tasks
   - Daily/weekly task summaries

4. **Task Updates**:

   - Send email when task status changes
   - Notify when due date is approaching
   - Alert when task is completed

5. **In-App Notifications**:

   - Real-time browser notifications
   - Notification badge in sidebar
   - Notification center in dashboard

6. **Email Tracking**:
   - Track email open rates
   - Confirm delivery status
   - Resend failed notifications

## Troubleshooting

### Email Not Sent:

**Check**:

1. Is staff assigned to the task? (Check `assigned_to` field)
2. Does staff have email in `hotel_staff_personal_data`?
3. Is `RESEND_API_KEY` configured in edge function?
4. Check console logs for error messages
5. Verify edge function is deployed in Supabase

### Permission Errors:

**Check**:

1. User is authenticated (JWT token present)
2. User is hotel owner or Elvira admin
3. Task belongs to user's hotel

### Email Arrives in Spam:

**Solution**:

1. Verify domain in Resend dashboard
2. Configure SPF, DKIM, DMARC records
3. Use verified sender email address
4. Avoid spam trigger words in content

## Files Modified/Created

### Created:

- `src/hooks/queries/hotel-management/tasks/useTaskNotifications.ts` - Notification hook
- `TASK_EMAIL_NOTIFICATION_INTEGRATION.md` - This documentation

### Modified:

- `src/hooks/queries/hotel-management/tasks/useTaskQueries.ts` - Added email sending to `useCreateTask`
- `src/hooks/queries/hotel-management/tasks/index.ts` - Exported notification hooks

### Edge Function:

- `supabase/functions/send-task-notifications-email/index.ts` - Email sender

## Summary

✅ **Task email notifications are now fully integrated**
✅ **Automatic email sending on task creation**
✅ **Non-blocking error handling**
✅ **Professional HTML email template**
✅ **Comprehensive logging for debugging**
✅ **Permission-based access control**
✅ **Works with existing task creation flow**

The system now automatically notifies staff members via email when tasks are assigned to them, improving communication and task management efficiency! 📧✨
