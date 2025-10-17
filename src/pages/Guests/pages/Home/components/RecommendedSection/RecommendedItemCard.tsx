/**
 * Recommended Item Card Component
 *
 * Displays a recommended item (amenity, product, or menu item) with:
 * - Image
 * - Category badge at bottom
 * - Title
 * - Description
 * - Price (optional)
 */

interface RecommendedItemCardProps {
  id: string;
  type: "menu_item" | "product" | "amenity";
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  onClick?: () => void;
}

export const RecommendedItemCard = ({
  title,
  description,
  price,
  imageUrl,
  category,
  onClick,
}: RecommendedItemCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[200px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
    >
      {/* Image Section */}
      <div className="relative h-[140px] bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">No image</span>
          </div>
        )}

        {/* Price Badge (bottom right) */}
        {price !== undefined && (
          <div className="absolute bottom-2 right-2 bg-gray-900/80 text-white px-2.5 py-1 rounded-md">
            <span className="text-xs font-bold">${price.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>
        )}

        {/* Category Badge at Bottom */}
        {category && (
          <div className="mt-auto">
            <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
