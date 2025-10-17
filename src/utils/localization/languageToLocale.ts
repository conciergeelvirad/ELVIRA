/**
 * Language to Locale Mapping
 * Converts simple language names to proper locale codes for date/time formatting
 */

export const LANGUAGE_TO_LOCALE_MAP: Record<string, string> = {
  // English variants
  english: "en-US",
  "english (us)": "en-US",
  "english (uk)": "en-GB",
  
  // European languages
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
  
  // Middle Eastern & South Asian
  arabic: "ar-SA",
  hebrew: "he-IL",
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
  persian: "fa-IR",
  
  // Other languages
  swahili: "sw-KE",
  zulu: "zu-ZA",
  afrikaans: "af-ZA",
  ukrainian: "uk-UA",
  bulgarian: "bg-BG",
  croatian: "hr-HR",
  serbian: "sr-RS",
  slovak: "sk-SK",
  slovenian: "sl-SI",
};

/**
 * Converts a language name to a proper locale code
 * Falls back to 'en-US' if language is not found
 * 
 * @param language - Language name (e.g., "spanish", "urdu", "english")
 * @returns Locale code (e.g., "es-ES", "ur-PK", "en-US")
 * 
 * @example
 * ```typescript
 * getLocaleFromLanguage("spanish") // Returns "es-ES"
 * getLocaleFromLanguage("urdu")    // Returns "ur-PK"
 * getLocaleFromLanguage("unknown") // Returns "en-US" (fallback)
 * ```
 */
export function getLocaleFromLanguage(language: string): string {
  const normalizedLanguage = language.toLowerCase().trim();
  return LANGUAGE_TO_LOCALE_MAP[normalizedLanguage] || "en-US";
}

/**
 * Formats a date in the guest's locale
 * 
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDateForLanguage(new Date(), "spanish")
 * // Returns: "17/10/2025, 10:01:03"
 * 
 * formatDateForLanguage(new Date(), "english")
 * // Returns: "10/17/2025, 10:01:03 AM"
 * ```
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
    // Fallback to en-US if locale formatting fails
    return date.toLocaleString("en-US");
  }
}

/**
 * Formats a date as a short date string (no time)
 * 
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDateShort(new Date(), "french")
 * // Returns: "17/10/2025"
 * ```
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
    console.error(`❌ Error formatting date for locale ${locale}:`, error);
    return date.toLocaleDateString("en-US");
  }
}

/**
 * Formats a time string
 * 
 * @param date - Date to format
 * @param language - Guest's preferred language
 * @returns Formatted time string
 * 
 * @example
 * ```typescript
 * formatTimeForLanguage(new Date(), "german")
 * // Returns: "10:01"
 * ```
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
    return date.toLocaleTimeString("en-US");
  }
}

/**
 * Validates if a locale is supported
 * 
 * @param language - Language to check
 * @returns true if language has a locale mapping
 */
export function isLanguageSupported(language: string): boolean {
  const normalizedLanguage = language.toLowerCase().trim();
  return normalizedLanguage in LANGUAGE_TO_LOCALE_MAP;
}

/**
 * Gets all supported languages
 * 
 * @returns Array of supported language names
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_TO_LOCALE_MAP);
}
