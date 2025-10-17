/**
 * Recommended Item Modal Component
 *
 * Displays detailed information about a recommended item (product, amenity, or menu item)
 * Features:
 * - Full-screen mobile-optimized modal
 * - Image display
 * - Full description
 * - Price information
 * - Category badge
 * - Close button
 */

import { X } from "lucide-react";
import { RecommendedItem } from "../../../../hooks/queries";

interface RecommendedItemModalProps {
  item: RecommendedItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendedItemModal = ({
  item,
  isOpen,
  onClose,
}: RecommendedItemModalProps) => {
  if (!isOpen || !item) return null;

  // Get category styling
  const getCategoryStyle = () => {
    switch (item.type) {
      case "product":
        return "bg-blue-100 text-blue-800";
      case "amenity":
        return "bg-green-100 text-green-800";
      case "menu_item":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Modal Container - Slides up on mobile */}
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-b-lg animate-in slide-in-from-bottom duration-300 sm:animate-in sm:fade-in">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex-1">
            {item.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Image Section */}
          {item.imageUrl ? (
            <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden mb-6">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span
              className={`inline-block text-sm font-semibold px-3 py-1.5 rounded-full ${getCategoryStyle()}`}
            >
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {item.title}
          </h3>

          {/* Price */}
          {item.price !== undefined && (
            <div className="mb-6">
              <div className="inline-flex items-baseline gap-1 bg-gray-900 text-white px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-300">USD</span>
              </div>
            </div>
          )}

          {/* Description */}
          {item.description ? (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-500 italic">
                No description available for this item.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {item.type === "product" && (
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors touch-manipulation">
                Add to Cart
              </button>
            )}
            {item.type === "amenity" && (
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors touch-manipulation">
                Book Now
              </button>
            )}
            {item.type === "menu_item" && (
              <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors touch-manipulation">
                Order Now
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors touch-manipulation"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
