/**
 * Languages Constants
 *
 * @deprecated Use getLanguageOptions() from @/utils/localization instead
 * This constant is kept for backward compatibility but will be removed in future versions.
 * 
 * @example
 * // Old way (deprecated):
 * import { LANGUAGES } from "@/utils/constants";
 * 
 * // New way (recommended):
 * import { getLanguageOptions } from "@/utils/localization";
 * const languages = getLanguageOptions();
 */

import { getLanguageOptions } from "../localization";

/**
 * @deprecated Use getLanguageOptions() from @/utils/localization instead
 * This generates the list dynamically from supported locales
 */
export const LANGUAGES = getLanguageOptions().map(lang => lang.label);

export type Language = string;
