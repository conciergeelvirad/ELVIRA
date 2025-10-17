/**
 * QA Category Section Component
 *
 * Displays a category header with Q&A items
 */

import { QAItem } from "./QAItem";
import type { QARecommendation } from "../../../../../hooks/queries/hotel-management/qa-recommendations";

interface QACategorySectionProps {
  category: string;
  items: QARecommendation[];
  expandedItems: Set<string>;
  onToggleItem: (category: string, index: number) => void;
}

export const QACategorySection = ({
  category,
  items,
  expandedItems,
  onToggleItem,
}: QACategorySectionProps) => {
  return (
    <div className="mb-4">
      {/* Category Header */}
      <div className="flex items-center mb-2">
        <h2 className="text-base font-bold text-gray-900">{category}</h2>
        <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
          {items.length}
        </span>
      </div>

      {/* Q&A Items */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const key = `${category}-${index}`;
          const isExpanded = expandedItems.has(key);

          return (
            <QAItem
              key={item.id}
              question={item.question || ""}
              answer={item.answer || ""}
              isExpanded={isExpanded}
              onToggle={() => onToggleItem(category, index)}
            />
          );
        })}
      </div>
    </div>
  );
};
