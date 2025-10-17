/**
 * LoadingSkeleton Component
 *
 * Reusable loading skeleton for filterable list pages
 * Displays a search bar placeholder and skeleton cards
 */

import React from "react";
import { SearchBar } from "../common/SearchBar/SearchBar";

interface LoadingSkeletonProps {
  searchPlaceholder?: string;
  skeletonCount?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  searchPlaceholder = "Search...",
  skeletonCount = 5,
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
      <div className="space-y-3">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div
            key={i}
            className="flex gap-3 h-24 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
