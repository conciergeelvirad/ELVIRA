# 🚨 URGENT: Guest Email Locale Error - Quick Fix Guide

## ⚡ **The Problem (In 30 Seconds)**

Your edge function `create-guest-with-translation` is crashing when trying to send emails because it's using **language names** like `"urdu"` in `toLocaleString()`, which requires **locale codes** like `"ur-PK"`.

```typescript
// ❌ This crashes:
date.toLocaleString("urdu")  // Invalid!

// ✅ This works:
date.toLocaleString("ur-PK")  // Valid locale code
```

## 🔧 **The Fix (3 Steps)**

### **Step 1: Locate Your Edge Function**

Your edge function should be in one of these locations:
- `supabase/functions/create-guest-with-translation/`
- A separate Supabase project repository
- Your Supabase dashboard (Functions section)

### **Step 2: Add the Locale Utility**

Create this file in your edge function directory:

**File**: `create-guest-with-translation/languageToLocale.ts`

```typescript
const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
  english: "en-US", spanish: "es-ES", french: "fr-FR",
  german: "de-DE", italian: "it-IT", portuguese: "pt-PT",
  chinese: "zh-CN", japanese: "ja-JP", korean: "ko-KR",
  arabic: "ar-SA", hindi: "hi-IN", urdu: "ur-PK",
  bengali: "bn-BD", russian: "ru-RU", turkish: "tr-TR",
  vietnamese: "vi-VN", thai: "th-TH", dutch: "nl-NL",
  swedish: "sv-SE", norwegian: "no-NO", polish: "pl-PL",
};

export function getLocaleFromLanguage(language: string): string {
  return LANGUAGE_TO_LOCALE_MAP[language?.toLowerCase()?.trim()] || "en-US";
}

export function formatDateForLanguage(date: Date, language: string): string {
  const locale = getLocaleFromLanguage(language);
  try {
    return date.toLocaleString(locale, {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
      hour12: locale.startsWith("en-"),
    });
  } catch (error) {
    console.error(`Error formatting date for ${locale}:`, error);
    return date.toLocaleString("en-US");
  }
}
```

### **Step 3: Update Your Edge Function**

In your `index.ts` file, find where you format dates and replace:

```typescript
// ❌ FIND THIS:
const expiryDate = new Date(codeExpiresAt);
const formattedDate = expiryDate.toLocaleString(requestData.language);

// ✅ REPLACE WITH THIS:
import { formatDateForLanguage } from "./languageToLocale.ts";

const expiryDate = new Date(codeExpiresAt);
const formattedDate = formatDateForLanguage(expiryDate, requestData.language);
```

## 🚀 **Deploy & Test**

```bash
# Deploy updated function
supabase functions deploy create-guest-with-translation

# Watch logs
supabase functions logs create-guest-with-translation --follow

# Test creating a guest with Urdu language
# Should now work without errors!
```

## ✅ **Success Indicators**

Before Fix:
```
❌ [ASYNC] Background email error: Incorrect locale information provided
```

After Fix:
```
✅ Email content translated to urdu
✅ Translated email sent successfully
```

## 🆘 **Where to Find the Edge Function Code**

1. **Check your Supabase project folder** for a `functions/` directory
2. **Or log into Supabase Dashboard** → Your Project → Edge Functions
3. **Or check your repository** for `supabase/functions/`

## 📋 **Complete Fix Locations**

Search for these patterns in your edge function and replace them:

```typescript
// Pattern 1: Direct toLocaleString
date.toLocaleString(language)
→ formatDateForLanguage(date, language)

// Pattern 2: With options
date.toLocaleString(requestData.language, options)
→ formatDateForLanguage(date, requestData.language)

// Pattern 3: In email template
`Date: ${new Date().toLocaleString(lang)}`
→ `Date: ${formatDateForLanguage(new Date(), lang)}`
```

## 🎯 **Frontend is Already Fixed**

The frontend now has the utility at:
- `src/utils/localization/languageToLocale.ts` ✅
- Exported from `src/utils/index.ts` ✅

**You only need to fix the edge function!**

## 📊 **Test Cases After Fix**

| Language | Input | Expected Locale | Should Work? |
|----------|-------|----------------|--------------|
| english  | `"english"` | `en-US` | ✅ Yes |
| spanish  | `"spanish"` | `es-ES` | ✅ Yes |
| urdu     | `"urdu"` | `ur-PK` | ✅ Yes |
| unknown  | `"klingon"` | `en-US` (fallback) | ✅ Yes |

---

**Time to Fix**: ~10 minutes  
**Priority**: 🔴 Critical  
**Impact**: Enables email sending for all languages
