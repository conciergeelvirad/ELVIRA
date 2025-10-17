# Staff Chat Foreign Key Fix - Complete ✅

**Date:** October 14, 2025  
**Status:** Complete  
**Issue:** Foreign key constraint violation when creating staff conversations

---

## 🐛 Problem Identified

### Error Message

```
Error creating conversation:
{code: '23503', details: null, hint: null, message: 'Insert or update on table "staff_conversation_participants" violates foreign key constraint "staff_conversation_participants_staff_id_fkey"'}
```

### Root Cause

The code was using incorrect ID references when creating conversations:

1. **What we were doing wrong:**

   - Using `hotel_staff.id` (auth user ID) as the `staff_id` in participants table
   - The `staff_conversation_participants.staff_id` column has a foreign key to `hotel_staff_personal_data.id`

2. **Database Schema:**

   ```
   hotel_staff (id = auth.users.id)
   ↓
   hotel_staff_personal_data (id = UUID, staff_id = hotel_staff.id)
   ↓
   staff_conversation_participants (staff_id = hotel_staff_personal_data.id) ← FK constraint here!
   ```

3. **The Mismatch:**
   - We were passing `hotel_staff.id` → FK expects `hotel_staff_personal_data.id`
   - This caused the foreign key constraint violation

---

## 🔧 Solution Implemented

### 1. Fixed Conversation Creation (`useStaffChatQueries.ts`)

**Before:**

```typescript
// Get current user's hotel_id
const { data: currentStaff, error: staffError } = await supabase
  .from("hotel_staff")
  .select("hotel_id")
  .eq("id", userId)
  .single();

// Add both participants using hotel_staff IDs (WRONG!)
const { error: partError } = await supabase
  .from("staff_conversation_participants")
  .insert([
    { conversation_id: conversation.id, staff_id: userId },
    { conversation_id: conversation.id, staff_id: participantId },
  ]);
```

**After:**

```typescript
// Get current user's personal data ID and hotel_id
const { data: currentStaff, error: currentStaffError } = await supabase
  .from("hotel_staff_personal_data")
  .select("id, hotel_staff!staff_id(id, hotel_id)")
  .eq("staff_id", userId)
  .single();

// Get participant's personal data ID
const { data: participantPersonalData, error: participantError } =
  await supabase
    .from("hotel_staff_personal_data")
    .select("id")
    .eq("staff_id", participantId)
    .single();

// Add both participants using hotel_staff_personal_data IDs (CORRECT!)
const { error: partError } = await supabase
  .from("staff_conversation_participants")
  .insert([
    { conversation_id: conversation.id, staff_id: currentStaff.id },
    { conversation_id: conversation.id, staff_id: participantPersonalData.id },
  ]);
```

### 2. Fixed Duplicate Conversation Check (`useStaffChat.ts`)

**Before:**

```typescript
// Checking using hotel_staff.id (WRONG!)
const { data: myConversations, error: myConvsError } = await supabase
  .from("staff_conversation_participants")
  .select("conversation_id")
  .eq("staff_id", currentUserId); // currentUserId is hotel_staff.id

const { data: sharedConversations, error: sharedError } = await supabase
  .from("staff_conversation_participants")
  .select("conversation_id")
  .eq("staff_id", staffId) // staffId is hotel_staff.id
  .in("conversation_id", myConversationIds);
```

**After:**

```typescript
// Get current user's personal data ID
const { data: currentPersonalData, error: currentError } = await supabase
  .from("hotel_staff_personal_data")
  .select("id")
  .eq("staff_id", currentUserId)
  .single();

// Get target staff's personal data ID
const { data: targetPersonalData, error: targetError } = await supabase
  .from("hotel_staff_personal_data")
  .select("id")
  .eq("staff_id", staffId)
  .single();

// Checking using hotel_staff_personal_data.id (CORRECT!)
const { data: myConversations, error: myConvsError } = await supabase
  .from("staff_conversation_participants")
  .select("conversation_id")
  .eq("staff_id", currentPersonalData.id);

const { data: sharedConversations, error: sharedError } = await supabase
  .from("staff_conversation_participants")
  .select("conversation_id")
  .eq("staff_id", targetPersonalData.id)
  .in("conversation_id", myConversationIds);
```

---

## 📝 Key Changes

### File: `src/hooks/queries/chat/useStaffChatQueries.ts`

1. **Query Current Staff:**

   - Changed from `hotel_staff` to `hotel_staff_personal_data` table
   - Join to `hotel_staff` to get `hotel_id`
   - Use `currentStaff.id` (personal data ID) for participants

2. **Query Participant:**

   - Added query to fetch participant's personal data ID
   - Use `participantPersonalData.id` for participants

3. **Insert Participants:**
   - Use `hotel_staff_personal_data.id` values instead of `hotel_staff.id`

### File: `src/hooks/features/useStaffChat.ts`

1. **Fetch Personal Data IDs:**

   - Added queries to fetch both current user and target staff personal data IDs
   - Convert `hotel_staff.id` → `hotel_staff_personal_data.id` before querying participants

2. **Check Existing Conversations:**
   - Use `hotel_staff_personal_data.id` values when querying participants table
   - Ensures we're checking with the correct FK reference

---

## ✅ Validation

### No TypeScript Errors

- ✅ `useStaffChat.ts` - No errors
- ✅ `useStaffChatQueries.ts` - No errors

### Expected Behavior

1. **Create Conversation:** Should now successfully create conversation with correct participant IDs
2. **Check Duplicates:** Should correctly find existing conversations using proper FK references
3. **No FK Violations:** Foreign key constraints will be satisfied

---

## 🔄 Data Flow Diagram

```
User Action: Click on staff member to start conversation
↓
useStaffChat.createNewConversation(staffId)  [staffId = hotel_staff.id]
↓
1️⃣ Fetch current user personal data ID
   hotel_staff.id → hotel_staff_personal_data.id (via staff_id FK)
↓
2️⃣ Fetch target staff personal data ID
   staffId → hotel_staff_personal_data.id (via staff_id FK)
↓
3️⃣ Check for existing conversations
   Query staff_conversation_participants using personal_data.id values
↓
4️⃣ If no existing conversation:
   Create conversation → Insert participants with personal_data.id values
   ✅ FK constraint satisfied!
```

---

## 🧪 Testing Steps

1. **Login as a staff member**
2. **Navigate to Chat Management**
3. **Click on a staff member** in the contacts list
4. **Verify:**
   - ✅ No console errors
   - ✅ Conversation is created successfully
   - ✅ Participants are added without FK violations
   - ✅ Messages can be sent and received

---

## 📚 Related Files

- `src/hooks/features/useStaffChat.ts` - Fixed duplicate checking logic
- `src/hooks/queries/chat/useStaffChatQueries.ts` - Fixed conversation creation mutation
- `src/utils/transforms/staffChat.transforms.ts` - No changes needed (already correct)
- `src/components/chat/StaffChatInterface.tsx` - No changes needed

---

## 💡 Lessons Learned

1. **Foreign Key Relationships Matter:** Always verify which table a FK points to
2. **Database Schema Understanding:** Critical to understand the full relationship chain
3. **ID Mapping:** `hotel_staff.id` (auth) ≠ `hotel_staff_personal_data.id` (profile)
4. **Query the Right Table:** When dealing with FKs, query the table that the FK references

---

## 🎯 Next Steps

- [ ] Monitor conversation creation in production
- [ ] Consider adding indexes on `hotel_staff_personal_data.staff_id` if not already present
- [ ] Add unit tests for conversation creation logic
- [ ] Consider caching personal data IDs to reduce queries

---

**Status:** ✅ **COMPLETE - Ready for Testing**
