/**
 * Card Content Component
 *
 * Renders the content sections of a GenericCard.
 * Each section can have an icon and content.
 * Supports single column or grid layout (2 columns).
 */

import React from "react";
import type { CardSection } from "./types";

export interface CardContentProps {
  /** Array of content sections to display */
  sections: CardSection[];
  /** Number of columns for grid layout (1 for single column, 2 for two columns) */
  gridColumns?: 1 | 2;
}

export const CardContent: React.FC<CardContentProps> = ({
  sections,
  gridColumns = 1,
}) => {
  if (sections.length === 0) return null;

  const containerClasses =
    gridColumns === 2 ? "grid grid-cols-2 gap-x-4 gap-y-2" : "space-y-2";

  return (
    <div className={containerClasses}>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex items-center text-sm text-gray-600 ${
            section.className || ""
          }`}
        >
          {section.icon && (
            <span className="mr-2 flex-shrink-0 text-gray-400">
              {section.icon}
            </span>
          )}
          <span className={section.icon ? "" : "w-full"}>
            {section.content}
          </span>
        </div>
      ))}
    </div>
  );
};
