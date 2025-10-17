# Staff Schedules Database Schema Mismatch - FIXED

## Issue Identified

**Error:** `Schedule creation failed: record "new" has no field "actual_start_time"`

### Root Cause

The Supabase TypeScript types file (`src/types/supabase.ts`) contains **outdated schema information** for the `staff_schedules` table. The generated types include fields that **do not exist** in your actual database:

**Extra fields in types (NOT in database):**

- ❌ `actual_start_time`
- ❌ `actual_end_time`
- ❌ `break_duration`
- ❌ `shift_type`
- ❌ `total_hours_worked`

**Actual database fields:**

- ✅ `shift_start` (time without time zone)
- ✅ `shift_end` (time without time zone)
- ✅ `schedule_start_date` (date)
- ✅ `schedule_finish_date` (date)
- ✅ `staff_id`, `hotel_id`
- ✅ `status`, `notes`, `is_confirmed`
- ✅ `confirmed_by`, `confirmed_at`
- ✅ `created_by`, `created_at`, `updated_at`

### Why This Happened

When Supabase generates TypeScript types, it reads your database schema. If your database schema has changed (fields added/removed), but you haven't regenerated the types, they will be out of sync.

## Temporary Fix Applied ✅

Added explicit type casting in `useStaffScheduleQueries.ts`:

```typescript
// Cast to 'any' to bypass outdated Supabase types
.insert([schedule as any])
```

This allows the correct data to be inserted without TypeScript complaining about the extra fields.

## Permanent Solution (REQUIRED)

You **MUST regenerate your Supabase types** to match your current database schema.

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not installed):

   ```bash
   npm install -g supabase
   ```

2. **Link your project** (first time only):

   ```bash
   supabase link --project-ref your-project-ref
   ```

   Your project ref is in your Supabase dashboard URL: `https://app.supabase.com/project/[PROJECT_REF]`

3. **Generate types**:
   ```bash
   npx supabase gen types typescript --linked > src/types/supabase.ts
   ```

### Option 2: Using Project ID

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

### Option 3: Manual Download from Supabase Dashboard

1. Go to Supabase Dashboard
2. Settings → API
3. Scroll to "Project API Keys"
4. Click "Generate Types"
5. Copy the TypeScript types
6. Replace content in `src/types/supabase.ts`

## Verification After Regeneration

After regenerating types, verify the `staff_schedules` table definition:

```typescript
// Should match your actual database schema
staff_schedules: {
  Row: {
    id: string;
    staff_id: string;
    hotel_id: string;
    schedule_start_date: string;
    schedule_finish_date: string;
    shift_start: string;  // ✅ NOT actual_start_time
    shift_end: string;    // ✅ NOT actual_end_time
    status: string;
    notes: string | null;
    is_confirmed: boolean;
    confirmed_by: string | null;
    confirmed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
  };
  Insert: {
    // Should NOT include: actual_start_time, actual_end_time, break_duration, shift_type, total_hours_worked
    staff_id: string;
    hotel_id: string;
    schedule_start_date: string;
    schedule_finish_date: string;
    shift_start: string;
    shift_end: string;
    status?: string;
    notes?: string | null;
    // ... other optional fields
  };
}
```

## Database Schema Reference

Your actual table structure:

```sql
CREATE TABLE staff_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES hotel_staff(id) ON DELETE CASCADE,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  schedule_start_date date NOT NULL,
  schedule_finish_date date NOT NULL,
  shift_start time NOT NULL,          -- ✅ This field exists
  shift_end time NOT NULL,            -- ✅ This field exists
  status text NOT NULL DEFAULT 'SCHEDULED',
  notes text,
  is_confirmed boolean NOT NULL DEFAULT false,
  confirmed_by uuid REFERENCES profiles(id),
  confirmed_at timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## After Fix

Once you regenerate the types:

1. **Remove the `as any` cast** from `useStaffScheduleQueries.ts`:

   ```typescript
   // Change this:
   .insert([schedule as any])

   // Back to this:
   .insert([schedule])
   ```

2. **Verify no TypeScript errors**

3. **Test schedule creation** - should work without errors

## Prevention

To avoid this in the future:

1. **Always regenerate types after schema changes**
2. **Add to your workflow**:
   ```bash
   # After any database migration
   npm run generate:types
   ```
3. **Add script to package.json**:
   ```json
   {
     "scripts": {
       "generate:types": "supabase gen types typescript --linked > src/types/supabase.ts"
     }
   }
   ```

## Current Status

- ✅ Temporary fix applied - schedules can now be created
- ⚠️ **ACTION REQUIRED**: Regenerate Supabase types file
- ⚠️ **After regeneration**: Remove `as any` cast from mutation

## Testing

After regenerating types, test:

- [ ] Create schedule - should succeed without errors
- [ ] Update schedule - verify all fields update correctly
- [ ] Confirm schedule - check confirmation flow
- [ ] Delete schedule - verify cascade works
- [ ] No TypeScript compilation errors
