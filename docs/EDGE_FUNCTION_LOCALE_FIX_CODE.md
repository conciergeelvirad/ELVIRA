# Edge Function Code Template for `create-guest-with-translation`

## Complete languageToLocale.ts File for Edge Function

Create this file in your edge function directory:

**Path**: `supabase/functions/create-guest-with-translation/languageToLocale.ts`

```typescript
/**
 * Language to Locale Mapping for Edge Function
 * This maps simple language names to proper IETF BCP 47 locale codes
 */

const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
  // English variants
  english: "en-US",
  "english (us)": "en-US",
  "english (uk)": "en-GB",
  
  // Major European languages
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  portuguese: "pt-PT",
  "portuguese (brazil)": "pt-BR",
  dutch: "nl-NL",
  swedish: "sv-SE",
  norwegian: "no-NO",
  danish: "da-DK",
  finnish: "fi-FI",
  polish: "pl-PL",
  czech: "cs-CZ",
  hungarian: "hu-HU",
  romanian: "ro-RO",
  greek: "el-GR",
  turkish: "tr-TR",
  russian: "ru-RU",
  ukrainian: "uk-UA",
  bulgarian: "bg-BG",
  croatian: "hr-HR",
  serbian: "sr-RS",
  slovak: "sk-SK",
  slovenian: "sl-SI",
  
  // Asian languages
  chinese: "zh-CN",
  "chinese (simplified)": "zh-CN",
  "chinese (traditional)": "zh-TW",
  japanese: "ja-JP",
  korean: "ko-KR",
  thai: "th-TH",
  vietnamese: "vi-VN",
  indonesian: "id-ID",
  malay: "ms-MY",
  tagalog: "tl-PH",
  
  // Middle Eastern languages
  arabic: "ar-SA",
  "arabic (egypt)": "ar-EG",
  "arabic (uae)": "ar-AE",
  hebrew: "he-IL",
  persian: "fa-IR",
  
  // South Asian languages
  hindi: "hi-IN",
  bengali: "bn-BD",
  urdu: "ur-PK",
  punjabi: "pa-IN",
  tamil: "ta-IN",
  telugu: "te-IN",
  marathi: "mr-IN",
  gujarati: "gu-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
  
  // African languages
  swahili: "sw-KE",
  zulu: "zu-ZA",
  afrikaans: "af-ZA",
};

/**
 * Converts a language name to a proper locale code
 * @param language - Language name (e.g., "spanish", "urdu")
 * @returns IETF BCP 47 locale code (e.g., "es-ES", "ur-PK")
 */
export function getLocaleFromLanguage(language: string): string {
  if (!language) return "en-US";
  
  const normalized = language.toLowerCase().trim();
  const locale = LANGUAGE_TO_LOCALE_MAP[normalized];
  
  if (!locale) {
    console.warn(`⚠️ Unknown language "${language}", defaulting to en-US`);
    return "en-US";
  }
  
  return locale;
}

/**
 * Formats a date in the guest's locale
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted date string with error handling
 */
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
    console.error(`❌ Error formatting date for locale ${locale}:`, error);
    // Fallback to ISO string if all else fails
    return date.toISOString().replace("T", " ").substring(0, 16);
  }
}

/**
 * Formats a date as short date string (no time)
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted date string
 */
export function formatDateShort(date: Date, language: string): string {
  const locale = getLocaleFromLanguage(language);
  
  try {
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error(`❌ Error formatting short date for locale ${locale}:`, error);
    return date.toISOString().substring(0, 10);
  }
}

/**
 * Formats time only
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted time string
 */
export function formatTimeForLanguage(date: Date, language: string): string {
  const locale = getLocaleFromLanguage(language);
  
  try {
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale.startsWith("en-"),
    });
  } catch (error) {
    console.error(`❌ Error formatting time for locale ${locale}:`, error);
    return date.toISOString().substring(11, 16);
  }
}
```

## How to Update Your index.ts

### 1. Add Import at Top

```typescript
// Add this import at the top of your index.ts file
import { 
  formatDateForLanguage, 
  formatDateShort, 
  getLocaleFromLanguage 
} from "./languageToLocale.ts";
```

### 2. Replace Date Formatting in Email Template

**Find this section** (approximately where you build the email HTML):

```typescript
// ❌ OLD CODE (CAUSES ERROR):
const expiryDate = new Date(requestData.codeExpiresAt);
const emailDate = expiryDate.toLocaleString(requestData.language);

const emailHTML = `
  <p>Your access code expires on: ${expiryDate.toLocaleString(requestData.language)}</p>
  <p>Email generated on: ${new Date().toLocaleString(requestData.language)}</p>
`;
```

**Replace with**:

```typescript
// ✅ NEW CODE (FIXED):
const expiryDate = new Date(requestData.codeExpiresAt);
const emailDate = formatDateForLanguage(expiryDate, requestData.language);

const emailHTML = `
  <p>Your access code expires on: ${formatDateForLanguage(expiryDate, requestData.language)}</p>
  <p>Email generated on: ${formatDateForLanguage(new Date(), requestData.language)}</p>
`;
```

### 3. Example: Complete Email Generation Section

```typescript
// After all database operations, before sending email:

const expiryDate = new Date(requestData.codeExpiresAt);
const currentDate = new Date();

// Get properly formatted dates
const formattedExpiry = formatDateForLanguage(expiryDate, requestData.language);
const formattedCurrent = formatDateShort(currentDate, requestData.language);

console.log(`📅 Formatting dates for language: ${requestData.language}`);
console.log(`📅 Locale: ${getLocaleFromLanguage(requestData.language)}`);
console.log(`📅 Expiry: ${formattedExpiry}`);

// Build email content
const emailContent = {
  subject: translatedSubject || `Welcome to ${hotelName}`,
  greeting: translatedGreeting || `Dear ${requestData.firstName},`,
  welcomeText: translatedWelcome || "Welcome to our hotel!",
  expiryDate: formattedExpiry,
  currentDate: formattedCurrent,
  // ... other content
};

// Generate HTML email
const htmlEmail = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h2>${emailContent.subject}</h2>
      <p>${emailContent.greeting}</p>
      <p>${emailContent.welcomeText}</p>
      
      <div>
        <strong>Your Access Code:</strong> ${requestData.verificationCode}<br>
        <strong>Expires:</strong> ${emailContent.expiryDate}<br>
        <strong>Email sent:</strong> ${emailContent.currentDate}
      </div>
      
      <!-- Rest of your email template -->
    </body>
  </html>
`;

// Send email via Resend
const emailResponse = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "noreply@yourdomain.com",
    to: requestData.guestEmail,
    subject: emailContent.subject,
    html: htmlEmail,
  }),
});
```

## Common Patterns to Replace

### Pattern 1: Simple Date Formatting
```typescript
// ❌ Before:
date.toLocaleString(language)

// ✅ After:
formatDateForLanguage(date, language)
```

### Pattern 2: Date in Template Literal
```typescript
// ❌ Before:
`Expires: ${new Date(expiry).toLocaleString(requestData.language)}`

// ✅ After:
`Expires: ${formatDateForLanguage(new Date(expiry), requestData.language)}`
```

### Pattern 3: Date with Options
```typescript
// ❌ Before:
date.toLocaleString(lang, { year: 'numeric', month: '2-digit', day: '2-digit' })

// ✅ After:
formatDateShort(date, lang)
```

### Pattern 4: Time Only
```typescript
// ❌ Before:
date.toLocaleTimeString(lang)

// ✅ After:
formatTimeForLanguage(date, lang)
```

## Testing Your Fix

Add these debug logs right before email sending:

```typescript
console.log("🔍 [EMAIL DEBUG] Starting email generation");
console.log("🔍 Language:", requestData.language);
console.log("🔍 Locale:", getLocaleFromLanguage(requestData.language));
console.log("🔍 Expiry Date:", formatDateForLanguage(new Date(requestData.codeExpiresAt), requestData.language));
console.log("🔍 Current Date:", formatDateForLanguage(new Date(), requestData.language));
```

## Error Handling

The utility includes comprehensive error handling:

```typescript
// If locale is invalid, it:
1. Logs a warning
2. Falls back to en-US
3. Never throws an error
4. Always returns a valid date string
```

## Deploy Command

```bash
# Navigate to your project
cd your-supabase-project

# Deploy the function
supabase functions deploy create-guest-with-translation

# Verify deployment
supabase functions list

# Test immediately
supabase functions logs create-guest-with-translation --follow
```

## Success Checklist

After deploying, create a test guest and verify:

- [ ] ✅ Guest created successfully
- [ ] ✅ No "Incorrect locale information" error
- [ ] ✅ Email sent successfully
- [ ] ✅ Date formatted correctly in email
- [ ] ✅ Works with "urdu" language
- [ ] ✅ Works with "spanish" language
- [ ] ✅ Works with "english" language
- [ ] ✅ Falls back to en-US for unknown languages

---

**This is the complete fix for the locale error!**
