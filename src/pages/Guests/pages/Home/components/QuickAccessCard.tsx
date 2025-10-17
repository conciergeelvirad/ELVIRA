/**
 * Quick Access Card Component
 *
 * Reusable card component for quick access sections like:
 * - Amenities
 * - Dine In
 * - Hotel Shop
 * - Q&A
 *
 * Features a title and description in a clean card layout
 */

interface QuickAccessCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export const QuickAccessCard = ({
  title,
  description,
  onClick,
}: QuickAccessCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation overflow-hidden"
    >
      {/* Title with background */}
      <div className="bg-indigo-50/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Description without background */}
      <div className="bg-white px-4 py-3">
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </button>
  );
};
