/**
 * Localization Utilities
 * 
 * This module provides utilities for converting between language names and locale codes,
 * and formatting dates/times in different locales.
 */

export {
  LANGUAGE_TO_LOCALE_MAP,
  getLocaleFromLanguage,
  formatDateForLanguage,
  formatDateShort,
  formatTimeForLanguage,
  isLanguageSupported,
  getSupportedLanguages,
} from "./languageToLocale";

export {
  type LanguageOption,
  getLanguageOptions,
  getGroupedLanguageOptions,
  getPopularLanguages,
} from "./languageOptions";
