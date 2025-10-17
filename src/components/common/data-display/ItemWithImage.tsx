/**
 * ItemWithImage Component
 *
 * Reusable component for displaying an item with image thumbnail,
 * name, and description in table views. Follows the standardized
 * pattern across all hotel management tables.
 *
 * Usage:
 * <ItemWithImage
 *   imageUrl={item.image_url}
 *   title={item.name}
 *   description={item.description}
 *   badge="MINI BAR" // Optional badge
 * />
 */

import React from "react";
import { Star } from "lucide-react";

interface ItemWithImageProps {
  imageUrl?: string | null;
  title: string;
  description?: string | null;
  badge?: string | null;
  fallbackIcon?: React.ReactNode; // Optional icon to show when no image
  isRecommended?: boolean; // Show star icon for recommended items
}

/**
 * Displays an item with image thumbnail on the left and
 * title/description on the right
 */
export const ItemWithImage: React.FC<ItemWithImageProps> = ({
  imageUrl,
  title,
  description,
  badge,
  fallbackIcon,
  isRecommended = false,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Image/Icon Container */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                (e.currentTarget.nextSibling as HTMLElement).style.display =
                  "flex";
              }
            }}
          />
        ) : fallbackIcon ? (
          <div className="text-gray-400">{fallbackIcon}</div>
        ) : (
          <div className="text-gray-400 text-xs font-medium">No Img</div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-900 truncate">{title}</span>
          {isRecommended && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
        </div>
        {description && (
          <div className="text-sm text-gray-500 line-clamp-2 break-words">
            {description}
          </div>
        )}
        {badge && (
          <div className="mt-1">
            <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Compact version with smaller image for dense tables
 */
export const ItemWithImageCompact: React.FC<ItemWithImageProps> = ({
  imageUrl,
  title,
  description,
  badge,
  fallbackIcon,
  isRecommended = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Image/Icon Container - Smaller */}
      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                (e.currentTarget.nextSibling as HTMLElement).style.display =
                  "flex";
              }
            }}
          />
        ) : fallbackIcon ? (
          <div className="text-gray-400 text-sm">{fallbackIcon}</div>
        ) : (
          <div className="text-gray-400 text-xs">No</div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {title}
          </span>
          {isRecommended && (
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
        </div>
        {description && (
          <div className="text-xs text-gray-500 line-clamp-2 break-words">
            {description}
          </div>
        )}
        {badge && (
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
