import { getSupportedLanguages, LANGUAGE_TO_LOCALE_MAP } from "./languageToLocale";

export interface LanguageOption {
  value: string;
  label: string;
  locale: string;
  category: "popular" | "european" | "asian" | "middle-eastern" | "other";
}

/**
 * Categorizes languages for better UI organization
 */
function categorizeLanguage(language: string): LanguageOption["category"] {
  const popularLanguages = ["english", "spanish", "french", "german", "chinese", "japanese", "arabic"];
  const europeanLanguages = [
    "italian", "portuguese", "dutch", "swedish", "norwegian", "danish", "finnish",
    "polish", "czech", "hungarian", "romanian", "greek", "turkish", "russian",
    "ukrainian", "bulgarian", "croatian", "serbian", "slovak", "slovenian"
  ];
  const asianLanguages = [
    "chinese", "japanese", "korean", "thai", "vietnamese", "indonesian", "malay", "tagalog"
  ];
  const middleEasternLanguages = [
    "arabic", "hebrew", "hindi", "bengali", "urdu", "punjabi", "tamil", "telugu",
    "marathi", "gujarati", "kannada", "malayalam", "persian"
  ];

  if (popularLanguages.includes(language)) return "popular";
  if (europeanLanguages.includes(language)) return "european";
  if (asianLanguages.includes(language)) return "asian";
  if (middleEasternLanguages.includes(language)) return "middle-eastern";
  return "other";
}

/**
 * Formats language name for display (capitalizes properly)
 */
function formatLanguageName(language: string): string {
  return language
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Gets all supported languages with their metadata
 */
export function getLanguageOptions(): LanguageOption[] {
  const languages = getSupportedLanguages();
  
  return languages.map(lang => ({
    value: lang,
    label: formatLanguageName(lang),
    locale: LANGUAGE_TO_LOCALE_MAP[lang],
    category: categorizeLanguage(lang),
  })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Gets languages grouped by category
 */
export function getGroupedLanguageOptions() {
  const options = getLanguageOptions();
  
  return {
    popular: options.filter(opt => opt.category === "popular"),
    european: options.filter(opt => opt.category === "european"),
    asian: options.filter(opt => opt.category === "asian"),
    middleEastern: options.filter(opt => opt.category === "middle-eastern"),
    other: options.filter(opt => opt.category === "other"),
  };
}

/**
 * Gets only the most popular languages for quick selection
 */
export function getPopularLanguages(): LanguageOption[] {
  const popularLangList = [
    "english",
    "spanish",
    "french",
    "german",
    "italian",
    "portuguese",
    "chinese",
    "japanese",
    "korean",
    "arabic",
    "hindi",
    "russian",
  ];

  return getLanguageOptions().filter(opt => 
    popularLangList.includes(opt.value)
  );
}
