/**
 * QA Recommendations Transformers
 *
 * Contains data transformation functions (currently minimal, but ready for expansion).
 */

import type { QARecommendation } from "./qaRecommendation.types";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract unique categories from QA recommendations
 *
 * @param recommendations - Array of QA recommendations
 * @returns Array of unique category names
 */
export const extractUniqueCategories = (
  recommendations: QARecommendation[]
): string[] => {
  const categories = recommendations
    .map((rec) => rec.category)
    .filter((category): category is string => category !== null);

  return Array.from(new Set(categories)).sort();
};

/**
 * Group QA recommendations by category
 *
 * @param recommendations - Array of QA recommendations
 * @returns Object with categories as keys and arrays of recommendations as values
 */
export const groupByCategory = (
  recommendations: QARecommendation[]
): Record<string, QARecommendation[]> => {
  return recommendations.reduce((acc, rec) => {
    const category = rec.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rec);
    return acc;
  }, {} as Record<string, QARecommendation[]>);
};

/**
 * Filter recommendations by search text
 *
 * Searches in question, answer, and category fields.
 *
 * @param recommendations - Array of QA recommendations
 * @param searchText - Text to search for
 * @returns Filtered array of recommendations
 */
export const filterBySearchText = (
  recommendations: QARecommendation[],
  searchText: string
): QARecommendation[] => {
  if (!searchText.trim()) return recommendations;

  const lowerSearch = searchText.toLowerCase();

  return recommendations.filter((rec) => {
    const question = rec.question?.toLowerCase() || "";
    const answer = rec.answer?.toLowerCase() || "";
    const category = rec.category?.toLowerCase() || "";

    return (
      question.includes(lowerSearch) ||
      answer.includes(lowerSearch) ||
      category.includes(lowerSearch)
    );
  });
};

/**
 * Sort recommendations by category, then by creation date
 *
 * @param recommendations - Array of QA recommendations
 * @returns Sorted array
 */
export const sortByCategoryAndDate = (
  recommendations: QARecommendation[]
): QARecommendation[] => {
  return [...recommendations].sort((a, b) => {
    // First sort by category
    const catA = a.category || "";
    const catB = b.category || "";

    if (catA !== catB) {
      return catA.localeCompare(catB);
    }

    // Then by creation date (newest first)
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });
};
