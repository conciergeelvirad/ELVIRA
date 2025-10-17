/**
 * QA Search Box Component
 *
 * Allows guests to ask questions and get AI-powered answers
 */

import { Send, Loader2 } from "lucide-react";

interface QASearchBoxProps {
  question: string;
  isAsking: boolean;
  onQuestionChange: (question: string) => void;
  onAsk: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const QASearchBox = ({
  question,
  isAsking,
  onQuestionChange,
  onAsk,
  onKeyPress,
}: QASearchBoxProps) => {
  return (
    <div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 mb-3">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Ask a Question
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your question here..."
          disabled={isAsking}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={onAsk}
          disabled={isAsking || !question.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isAsking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Asking...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="text-sm">Ask</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
