/**
 * EmptyState Component
 *
 * Reusable empty state for filterable list pages
 * Displays search bar and a friendly empty state message
 */

import React from "react";
import { SearchBar } from "../common/SearchBar/SearchBar";

interface EmptyStateProps {
  searchPlaceholder?: string;
  emoji?: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchPlaceholder = "Search...",
  emoji = "📦",
  title,
  message,
}) => {
  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <SearchBar
          placeholder={searchPlaceholder}
          value=""
          onSearchChange={() => {}}
          showFilter={false}
        />
      </div>
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <div className="text-6xl mb-4">{emoji}</div>
        <p className="text-gray-600 mb-2">{title}</p>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
};
