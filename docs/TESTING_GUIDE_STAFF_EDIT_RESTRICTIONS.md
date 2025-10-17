# Quick Testing Guide - Hotel Staff Edit Restrictions

## 🧪 How to Test

### Prerequisites

- Have at least two users in the system:
  - One with position "Hotel Staff" (not Manager)
  - One with position "Hotel Admin" or "Hotel Staff" + Manager department

### Test Scenario 1: Hotel Staff Editing Own Profile ✅

1. **Login as Hotel Staff** (non-manager)
2. Navigate to **Hotel Staff** page → **Staff Management** tab
3. Find and click on **your own profile** in the list
4. **Expected**: Edit button should be visible in the detail modal
5. Click **Edit** button
6. **Expected**: Only these fields should be visible:
   - Full Name
   - Email
   - Phone Number
   - Date of Birth
   - City
   - Zip Code
   - Address
   - Emergency Contact Name
   - Emergency Contact Phone
7. Make changes to any personal field (e.g., change phone number)
8. Click **Save Changes**
9. **Expected**: Changes should save successfully
10. **Check Console**: Should see logs like:
    ```
    🔍 [StaffForm] Current user position: Hotel Staff
    🔍 [StaffForm] Is edit mode: true
    🔒 [StaffForm] Restricting to personal data fields only
    📋 [StaffForm] Filtered fields: [list of personal fields]
    🔄 [useStaffCRUD] Update initiated for staff ID: ...
    ⚠️ [useStaffCRUD] Staff updates skipped (position/department not in form)
    ✅ [useStaffCRUD] Staff update successful
    ```

### Test Scenario 2: Hotel Staff Viewing Other Profiles 🚫

1. **Stay logged in as Hotel Staff**
2. Click on **another staff member** (not your profile)
3. **Expected**:
   - Detail modal opens
   - **NO Edit button visible**
   - **NO Delete button visible**
4. Can only view information

### Test Scenario 3: Admin/Manager Editing Any Staff ✅

1. **Login as Admin or Manager**
2. Navigate to **Hotel Staff** page → **Staff Management** tab
3. Click on **any staff member**
4. **Expected**: Both Edit and Delete buttons visible
5. Click **Edit** button
6. **Expected**: ALL fields should be visible:
   - Full Name
   - Position
   - Department
   - Email
   - Phone Number
   - Date of Birth
   - City
   - Zip Code
   - Address
   - Emergency Contact Name
   - Emergency Contact Phone
7. Make changes to any field
8. Click **Save Changes**
9. **Expected**: All changes should save successfully
10. **Check Console**: Should see logs like:
    ```
    🔍 [StaffForm] Current user position: Hotel Admin
    ✅ [StaffForm] All fields available
    🔄 [useStaffCRUD] Update initiated for staff ID: ...
    ✅ [useStaffCRUD] Staff updates included: {position: ..., department: ...}
    ✅ [useStaffCRUD] Staff update successful
    ```

## 🔍 What to Look For in Console

### When Hotel Staff opens edit form for themselves:

```
👤 [HotelStaffPage] Hotel Staff editing own profile: [staff-id]
🔍 [StaffForm] Current user position: Hotel Staff
🔍 [StaffForm] Is edit mode: true
🔒 [StaffForm] Restricting to personal data fields only
📋 [StaffForm] Filtered fields: (9) ["name", "email", "phone", ...]
```

### When Hotel Staff tries to edit someone else:

```
🚫 [HotelStaffPage] Hotel Staff cannot edit other profiles
```

(Edit modal should NOT open)

### When saving changes as Hotel Staff:

```
💾 [HotelStaffPage] Edit submit triggered
👤 [HotelStaffPage] Current user: Hotel Staff
🔄 [useStaffCRUD] Update initiated for staff ID: [id]
📝 [useStaffCRUD] Form data received: {name: "...", email: "...", phone: "..."}
⚠️ [useStaffCRUD] Staff updates skipped (position/department not in form)
📋 [useStaffCRUD] Personal data updates: {...}
✅ [useStaffCRUD] Staff update successful
```

### When saving changes as Admin/Manager:

```
💾 [HotelStaffPage] Edit submit triggered
👤 [HotelStaffPage] Current user: Hotel Admin
🔄 [useStaffCRUD] Update initiated for staff ID: [id]
📝 [useStaffCRUD] Form data received: {name: "...", position: "...", department: "...", ...}
✅ [useStaffCRUD] Staff updates included: {position: "...", department: "..."}
📋 [useStaffCRUD] Personal data updates: {...}
✅ [useStaffCRUD] Staff update successful
```

## ✅ Expected Behavior Summary

| User Type                 | Can Edit Own Profile | Can Edit Others | Fields Available   | Can Delete |
| ------------------------- | -------------------- | --------------- | ------------------ | ---------- |
| Hotel Staff (non-manager) | ✅ Yes               | ❌ No           | Personal data only | ❌ No      |
| Hotel Admin               | ✅ Yes               | ✅ Yes          | All fields         | ✅ Yes     |
| Hotel Staff (Manager)     | ✅ Yes               | ✅ Yes          | All fields         | ✅ Yes     |

## 🐛 Troubleshooting

### Issue: Hotel Staff can't save changes

- **Check**: Look for error logs in console
- **Verify**: Position is exactly "Hotel Staff" (case-sensitive)
- **Check**: User is editing their own profile (staff.id === currentUser.id)

### Issue: Fields not filtering correctly

- **Check**: `currentUserPosition` prop is being passed to StaffForm
- **Check**: `isEditMode` is true when opening edit modal
- **Look for**: Field filtering logs in console

### Issue: Update fails

- **Check**: Network tab for API errors
- **Check**: Supabase RLS policies allow Hotel Staff to update their own records
- **Look for**: Error logs in console with ❌ prefix

## 📊 Database Considerations

Make sure your Supabase RLS policies allow:

1. Hotel Staff to UPDATE their own records in `hotel_staff_personal_data`
2. Hotel Staff to READ but not UPDATE `hotel_staff` table (position/department)
3. Admins/Managers to UPDATE all records

Example RLS policy for personal data:

```sql
-- Allow staff to update their own personal data
CREATE POLICY "Staff can update own personal data"
ON hotel_staff_personal_data
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM hotel_staff WHERE id = staff_id
  )
);
```
