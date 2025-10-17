# Staff Members Panel - Debugging Session

## 🔍 Issue Identified

The staff members are not showing up in the Staff Communication sidebar even though the query has been implemented.

## 🛠️ Changes Made for Debugging

### 1. **Fixed Database Query Relationship**

**Problem**: Originally querying from `hotel_staff` with wrong relationship syntax:

```typescript
// ❌ WRONG - This foreign key doesn't exist
hotel_staff_personal_data:hotel_staff_personal_data_id (...)
```

**Solution**: Query from `hotel_staff_personal_data` table (which has `staff_id` FK):

```typescript
// ✅ CORRECT
hotel_staff_personal_data.select(`
    first_name,
    last_name,
    email,
    avatar_url,
    staff_id,
    hotel_staff:staff_id (
      id,
      employee_id,
      position,
      hotel_id,
      status
    )
  `);
```

### 2. **Added Comprehensive Logging**

#### In `useHotelStaffMembers()`:

```typescript
console.log("👤 Current user ID:", userId);
console.log("🏨 Current hotel ID:", hotelId);
console.log("📋 Querying hotel_staff_personal_data...");
console.log("📊 Query result:", { hasError, error, dataLength, data });
console.log("✅ Raw hotel staff data:", hotelStaff);
console.log("✅ Processed hotel staff:", validStaff);
```

#### In `ChatManagementPage`:

```typescript
console.log("🔄 Preparing staff chat data:", {
  conversationsCount,
  staffMembersCount,
  conversationsData,
  staffData,
});
console.log("📝 Existing conversations:", existingConversations);
console.log("👥 Staff member conversations:", staffMemberConversations);
console.log("🆕 New staff contacts:", newStaffContacts);
console.log("✅ Total staff contacts:", allContacts.length, allContacts);
```

### 3. **Updated Data Transformation**

Changed the transformation logic to match the new query structure:

**Before**:

```typescript
// Expected: staff.hotel_staff_personal_data
const personalData = staff.hotel_staff_personal_data;
```

**After**:

```typescript
// New structure: record has personal data at top level
{
  id: staffData.id,
  employee_id: staffData.employee_id,
  position: staffData.position,
  hotel_staff_personal_data: {
    first_name: record.first_name,
    last_name: record.last_name,
    email: record.email,
    avatar_url: record.avatar_url,
  },
}
```

## 🔍 What to Check in Console

When you open the Staff Communication tab, you should see:

### Step 1: Query Execution

```
🔹 Fetching hotel staff members...
👤 Current user ID: <uuid>
🏨 Current hotel ID: <uuid>
📋 Querying hotel_staff_personal_data...
```

### Step 2: Query Results

```
📊 Query result: {
  hasError: false,
  error: null,
  dataLength: X,
  data: [...]
}
✅ Raw hotel staff data: [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    avatar_url: null,
    staff_id: "...",
    hotel_staff: {
      id: "...",
      employee_id: "EMP001",
      position: "Manager",
      hotel_id: "...",
      status: "active"
    }
  },
  ...
]
```

### Step 3: Data Transformation

```
✅ Processed hotel staff: [
  {
    id: "...",
    employee_id: "EMP001",
    position: "Manager",
    hotel_staff_personal_data: {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      avatar_url: null
    }
  },
  ...
]
```

### Step 4: UI Preparation

```
🔄 Preparing staff chat data: {
  conversationsCount: 0,
  staffMembersCount: X,
  conversationsData: [],
  staffData: [...]
}
👥 Staff member conversations: [
  {
    id: "...",
    title: "Chat with John Doe",
    staffName: "John Doe",
    staffPosition: "Manager",
    staffAvatar: null,
    ...
  }
]
✅ Total staff contacts: X [...]
```

## 🐛 Common Issues to Look For

### Issue 1: No Data Returned

**Check**:

- Is `hotelStaffData` empty array `[]`?
- Look at the error in query result
- Check if there are active staff in the hotel

**Possible Causes**:

- No other staff members in the database
- All staff have status ≠ "active"
- RLS policies blocking the query
- Wrong hotel_id

### Issue 2: Data Transformation Failing

**Check**:

- Is `staffMemberConversations` empty even though `hotelStaffData` has items?
- Look for transformation errors

**Possible Causes**:

- `hotel_staff` array is empty in the response
- Missing or null data in personal data fields

### Issue 3: Filtered Out by Duplicates

**Check**:

- Are there items in `staffMemberConversations` but `newStaffContacts` is empty?

**Possible Causes**:

- Existing conversation IDs match staff IDs (unlikely but possible)

## 🔧 Quick Fixes

### If No Staff in Database:

```sql
-- Insert test staff member
INSERT INTO hotel_staff (hotel_id, employee_id, position, department, status)
VALUES ('your-hotel-id', 'EMP002', 'Receptionist', 'Front Desk', 'active');

INSERT INTO hotel_staff_personal_data (staff_id, first_name, last_name, email)
VALUES ('new-staff-id', 'Jane', 'Smith', 'jane@hotel.com');
```

### If RLS Policy Issue:

```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'hotel_staff_personal_data';

-- Create policy if missing
CREATE POLICY "Allow same hotel staff to view each other"
ON hotel_staff_personal_data
FOR SELECT
USING (
  staff_id IN (
    SELECT id FROM hotel_staff
    WHERE hotel_id = (
      SELECT hotel_id FROM hotel_staff
      WHERE id = auth.uid()
    )
  )
);
```

## 📊 Expected Behavior

After these changes:

1. ✅ Query executes without foreign key errors
2. ✅ Staff members from same hotel are fetched
3. ✅ Data is properly transformed
4. ✅ Staff list appears in the sidebar
5. ✅ Each staff member shows name, position, and avatar

## 🎯 Next Steps

Once staff members are visible:

1. [ ] Implement click handler to create conversation
2. [ ] Add loading skeleton for staff list
3. [ ] Add empty state when no staff found
4. [ ] Add error boundary for failed queries
5. [ ] Remove debug logging (or make it conditional)

---

**Status**: 🔍 **DEBUGGING IN PROGRESS**

Check the browser console for detailed logs to identify where the data flow is breaking.
