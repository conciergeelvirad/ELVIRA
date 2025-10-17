/**
 * QA AI Response Component
 *
 * Displays AI answer or error message
 */

interface QAAIResponseProps {
  aiAnswer: string | null;
  error: string | null;
}

export const QAAIResponse = ({ aiAnswer, error }: QAAIResponseProps) => {
  if (!aiAnswer && !error) return null;

  return (
    <div className="px-4 mb-3">
      {/* AI Answer Display */}
      {aiAnswer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-green-600 text-lg">✓</div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-green-800 mb-1">
                Answer:
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {aiAnswer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
