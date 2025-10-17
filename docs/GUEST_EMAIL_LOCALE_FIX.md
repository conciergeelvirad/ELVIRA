# Guest Email Locale Error Fix

## 🔴 Problem

The `create-guest-with-translation` edge function is failing with the error:

```
❌ [ASYNC] Background email error: Incorrect locale information provided
```

## 🔍 Root Cause

The edge function receives a **language name** (e.g., "urdu", "spanish", "english") but JavaScript's `toLocaleString()` method requires a proper **locale code** (e.g., "ur-PK", "es-ES", "en-US").

### Example of the Issue:

```typescript
// ❌ This will fail:
const date = new Date();
date.toLocaleString("urdu"); // ERROR: Invalid locale

// ✅ This works:
date.toLocaleString("ur-PK"); // Success!
```

## 🔧 Solution

### 1. **Frontend Fix - Use Utility Function**

We've created a utility module to convert language names to locale codes:

**File**: `src/utils/localization/languageToLocale.ts`

**Usage in Frontend**:

```typescript
import { formatDateForLanguage, getLocaleFromLanguage } from "@/utils/localization";

// Format dates for email display
const expiryDate = new Date(guest.access_code_expires_at);
const formattedDate = formatDateForLanguage(expiryDate, guest.language);
// "urdu" → formats as "ur-PK" → "۱۷/۱۰/۲۰۲۵، ۱۰:۰۱"

// Get locale code for API calls
const locale = getLocaleFromLanguage("spanish"); // Returns "es-ES"
```

### 2. **Edge Function Fix** ⭐ **CRITICAL**

You need to update the edge function code to use proper locale codes. Since edge functions are deployed separately, you need to:

#### **Step A: Copy the Language-to-Locale Utility to Edge Function**

Create this file in your edge function directory:

**File**: `supabase/functions/create-guest-with-translation/languageToLocale.ts`

```typescript
const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-PT",
  chinese: "zh-CN",
  japanese: "ja-JP",
  korean: "ko-KR",
  arabic: "ar-SA",
  hindi: "hi-IN",
  bengali: "bn-BD",
  urdu: "ur-PK",
  russian: "ru-RU",
  turkish: "tr-TR",
  vietnamese: "vi-VN",
  thai: "th-TH",
  // Add more as needed...
};

export function getLocaleFromLanguage(language: string): string {
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_TO_LOCALE_MAP[normalized] || "en-US";
}

export function formatDateForLanguage(date: Date, language: string): string {
  const locale = getLocaleFromLanguage(language);
  try {
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale.startsWith("en-"),
    });
  } catch (error) {
    console.error(`Error formatting date for locale ${locale}:`, error);
    return date.toLocaleString("en-US");
  }
}
```

#### **Step B: Update Edge Function to Use Locale Codes**

In your edge function's main file (`index.ts`), find where dates are formatted and replace:

**Before (❌ Causes Error):**

```typescript
const expiryDate = new Date(codeExpiresAt);
const formattedExpiry = expiryDate.toLocaleString(language); // WRONG!
```

**After (✅ Fixed):**

```typescript
import { formatDateForLanguage, getLocaleFromLanguage } from "./languageToLocale.ts";

const expiryDate = new Date(codeExpiresAt);
const formattedExpiry = formatDateForLanguage(expiryDate, language);
```

#### **Step C: Complete Edge Function Fix Pattern**

Look for ALL instances of `toLocaleString()` in the edge function and replace them:

```typescript
// ❌ REPLACE THIS:
date.toLocaleString(language)
date.toLocaleString(requestData.language)
new Date(...).toLocaleString(guestLanguage)

// ✅ WITH THIS:
formatDateForLanguage(date, language)
```

### 3. **Example: Complete Edge Function Date Formatting**

```typescript
import { formatDateForLanguage } from "./languageToLocale.ts";

// In your email content generation:
const emailContent = {
  expiryDate: formatDateForLanguage(
    new Date(codeExpiresAt), 
    requestData.language
  ),
  currentDate: formatDateForLanguage(
    new Date(), 
    requestData.language
  ),
};

// In the email HTML:
const htmlEmail = `
  <p>Your access code expires on: ${emailContent.expiryDate}</p>
  <p>Email sent on: ${emailContent.currentDate}</p>
`;
```

## 📋 Deployment Checklist

### ✅ **Step 1: Update Edge Function Code**

1. Add `languageToLocale.ts` to edge function directory
2. Import the utility in `index.ts`
3. Replace all `toLocaleString(language)` calls
4. Test locally with `supabase functions serve`

### ✅ **Step 2: Deploy Updated Edge Function**

```bash
# Deploy the updated function
supabase functions deploy create-guest-with-translation

# Verify deployment
supabase functions list
```

### ✅ **Step 3: Test with Different Languages**

```bash
# Monitor logs
supabase functions logs create-guest-with-translation --follow
```

Test creating guests with:
- ✅ English (`language: "english"`)
- ✅ Spanish (`language: "spanish"`)
- ✅ Urdu (`language: "urdu"`)
- ✅ French (`language: "french"`)

### ✅ **Step 4: Verify Email Delivery**

Check that emails are sent successfully with properly formatted dates in each language.

## 🧪 Testing the Fix

### **Test 1: Create Guest with Urdu**

```typescript
const guestData = {
  firstName: "Ahmed",
  lastName: "Khan",
  language: "urdu",
  // ... other fields
};

// Should format date as: "۱۷/۱۰/۲۰۲۵" (Urdu numerals)
```

### **Test 2: Create Guest with Spanish**

```typescript
const guestData = {
  firstName: "María",
  lastName: "García",
  language: "spanish",
  // ... other fields
};

// Should format date as: "17/10/2025, 10:01"
```

### **Test 3: Edge Case - Unknown Language**

```typescript
const guestData = {
  language: "klingon", // Not in our map
  // ... other fields
};

// Should fallback to: "10/17/2025, 10:01 AM" (en-US)
```

## 🔍 Debugging

### **Check Edge Function Logs**

```bash
supabase functions logs create-guest-with-translation --limit 50
```

Look for:
- ✅ `"Email content translated to {language}"`
- ✅ `"Translated email sent"`
- ❌ `"Background email error"`

### **Verify Locale Conversion**

Add logging in the edge function:

```typescript
console.log(`📍 Language: ${requestData.language}`);
console.log(`📍 Locale: ${getLocaleFromLanguage(requestData.language)}`);
console.log(`📍 Formatted Date: ${formatDateForLanguage(new Date(), requestData.language)}`);
```

## 📊 Expected Behavior After Fix

### **Before Fix:**
```
❌ [ASYNC] Background email error: Incorrect locale information provided
✅ Guest created (but email failed)
```

### **After Fix:**
```
✅ Guest created successfully
✅ Email content translated to urdu
✅ Translated email sent
📧 Email sent: YES
🌍 Language: urdu
```

## 🚨 Important Notes

1. **Edge functions are separate deployments** - Frontend changes don't automatically update them
2. **Always test locally first** using `supabase functions serve`
3. **Language names must match** between frontend and edge function
4. **Fallback is always en-US** if locale is not found
5. **All edge function dependencies** must be included in the function's directory

## 📁 File Structure

```
your-project/
├── src/
│   └── utils/
│       └── localization/
│           ├── index.ts
│           └── languageToLocale.ts  ← Frontend utility ✅
│
└── supabase/
    └── functions/
        └── create-guest-with-translation/
            ├── index.ts              ← Main edge function
            └── languageToLocale.ts  ← Copy of utility ⭐ ADD THIS
```

## ✅ Quick Fix Summary

1. **Copy** `languageToLocale.ts` to your edge function directory
2. **Import** the utility in edge function's `index.ts`
3. **Replace** all `toLocaleString(language)` with `formatDateForLanguage(date, language)`
4. **Deploy** the updated edge function
5. **Test** with different languages

## 🆘 If Still Not Working

1. Check edge function logs for detailed error messages
2. Verify environment variables are set (`OPENAI_API_KEY`, `RESEND_API_KEY`)
3. Ensure language values match exactly (lowercase, no extra spaces)
4. Test with a simple language first (e.g., "english")
5. Add more logging to identify exact failure point

---

**Status**: 🔧 Fix Ready for Deployment
**Priority**: 🔴 Critical - Blocks guest email functionality
**Estimated Fix Time**: 15 minutes
