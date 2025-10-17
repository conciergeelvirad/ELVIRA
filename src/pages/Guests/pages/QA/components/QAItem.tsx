/**
 * QA Item Component
 *
 * Individual collapsible Q&A item
 */

import { ChevronDown, ChevronUp } from "lucide-react";

interface QAItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const QAItem = ({
  question,
  answer,
  isExpanded,
  onToggle,
}: QAItemProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Question - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-medium text-sm text-gray-900 pr-3 leading-snug">
          {question || "No question available"}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Answer - Expandable */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {answer || "No answer available"}
          </p>
        </div>
      )}
    </div>
  );
};
