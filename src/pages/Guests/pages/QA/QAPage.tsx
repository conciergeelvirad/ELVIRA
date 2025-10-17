/**
 * Q&A Page
 *
 * Browse frequently asked questions organized by category
 * Ask questions and get AI-powered answers
 */

import { useMemo, useState } from "react";
import {
  useActiveQARecommendations,
  groupByCategory,
} from "../../../../hooks/queries/hotel-management/qa-recommendations";
import { getGuestSession } from "../../../../services/guestAuth.service";
import { EmptyState } from "../../components/ui";
import { QASearchBox, QAAIResponse, QACategorySection } from "./components";
import { useAIQuestion } from "./hooks/useAIQuestion";

export const QAPage = () => {
  // Get hotel ID from guest session
  const session = getGuestSession();
  const hotelId = session?.guestData?.hotel_id || "";

  // AI Question handling
  const {
    question,
    setQuestion,
    aiAnswer,
    askError,
    isAsking,
    handleAskQuestion,
    handleKeyPress,
  } = useAIQuestion(hotelId);

  // Fetch active Q&A recommendations
  const { data: qaItems = [], isLoading } = useActiveQARecommendations(hotelId);

  // Group Q&A by category
  const categorizedQA = useMemo(() => {
    return groupByCategory(qaItems);
  }, [qaItems]);

  // Track expanded items (category-index format)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    const newExpanded = new Set(expandedItems);

    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }

    setExpandedItems(newExpanded);
  };

  if (isLoading) {
    return (
      <div>
        <QASearchBox
          question={question}
          isAsking={isAsking}
          onQuestionChange={setQuestion}
          onAsk={handleAskQuestion}
          onKeyPress={handleKeyPress}
        />

        <div className="px-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Loading questions...
          </h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (qaItems.length === 0) {
    return (
      <div>
        <QASearchBox
          question={question}
          isAsking={isAsking}
          onQuestionChange={setQuestion}
          onAsk={handleAskQuestion}
          onKeyPress={handleKeyPress}
        />

        <QAAIResponse aiAnswer={aiAnswer} error={askError} />

        <EmptyState
          emoji="❓"
          title="No Q&A available"
          message="But you can still ask questions using the search box above"
        />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <QASearchBox
        question={question}
        isAsking={isAsking}
        onQuestionChange={setQuestion}
        onAsk={handleAskQuestion}
        onKeyPress={handleKeyPress}
      />

      <QAAIResponse aiAnswer={aiAnswer} error={askError} />

      {/* Browse Q&A Header */}
      <div className="px-4 mb-2">
        <h2 className="text-sm font-semibold text-gray-700">
          Or browse common questions:
        </h2>
      </div>

      {/* Q&A Items grouped by category */}
      <div className="px-4">
        {Object.entries(categorizedQA).map(([category, items]) => (
          <QACategorySection
            key={category}
            category={category}
            items={items}
            expandedItems={expandedItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>
    </div>
  );
};
