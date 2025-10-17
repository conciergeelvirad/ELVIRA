/**
 * Modal Item Image Component
 *
 * Displays item image with category and price badges
 */

interface ModalItemImageProps {
  imageUrl?: string;
  title: string;
  category: string;
  price?: number;
  getCategoryStyle: () => string;
}

export const ModalItemImage = ({
  imageUrl,
  title,
  category,
  price,
  getCategoryStyle,
}: ModalItemImageProps) => {
  return (
    <div className="relative w-full h-48 sm:h-56 bg-gray-200 rounded-lg overflow-hidden mb-3">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span className="text-sm">No image available</span>
        </div>
      )}

      {/* Category Badge - Top Left */}
      <div className="absolute top-2 left-2">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg ${getCategoryStyle()}`}
        >
          {category}
        </span>
      </div>

      {/* Price Badge - Top Right */}
      {price !== undefined && (
        <div className="absolute top-2 right-2 bg-gray-900/90 text-white px-2.5 py-1 rounded-lg shadow-lg">
          <span className="text-sm font-bold">${price.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};
