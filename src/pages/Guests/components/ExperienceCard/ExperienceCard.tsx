/**
 * Experience Card Component
 *
 * A modern, reusable card component for displaying experiences (restaurants, tours, activities)
 *
 * Refactored to use common components:
 * - CardImage: Image display with lazy loading
 * - CardRating: Star rating display
 *
 * Features:
 * - Full-width image with lazy loading
 * - Category badge overlay
 * - Title and short description
 * - Rating with stars
 * - Price indicator
 * - Distance/time info
 * - Hover effects
 * - Mobile-optimized touch targets
 */

import { MapPin, Clock, Heart } from "lucide-react";
import { CardImage } from "../common/CardImage";
import { CardRating } from "../common/CardRating";

export interface ExperienceCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number; // 1-4 for $ to $$$$
  price?: string; // Formatted price like "$25.00" or "€15-30"
  distance?: string; // e.g., "1.2 km"
  estimatedTime?: string; // e.g., "15-20 min"
  tags?: string[]; // e.g., ["Vegetarian", "Fast Service"]
  isFavorite?: boolean;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
}

export const ExperienceCard = ({
  title,
  description,
  imageUrl,
  category,
  rating,
  reviewCount,
  priceLevel,
  price,
  distance,
  estimatedTime,
  tags = [],
  isFavorite = false,
  onClick,
  onFavoriteToggle,
}: ExperienceCardProps) => {
  // Render price level as dollar signs
  const renderPriceLevel = () => {
    if (!priceLevel) return null;
    return (
      <span className="text-gray-600 text-sm font-medium">
        {"$".repeat(priceLevel)}
        <span className="text-gray-300">{"$".repeat(4 - priceLevel)}</span>
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
    >
      {/* Image Container with Overlay Badges */}
      <div className="relative">
        <CardImage
          src={imageUrl}
          alt={title}
          fallbackEmoji="🍽️"
          fallbackText="No image"
          aspectRatio="video"
          className="h-48"
        />

        {/* Category Badge - Top Left */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}

        {/* Favorite Button - Top Right */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              } transition-colors`}
            />
          </button>
        )}

        {/* Distance/Time Badge - Bottom Left */}
        {(distance || estimatedTime) && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {distance && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full shadow-lg">
                <MapPin className="w-3 h-3" />
                {distance}
              </span>
            )}
            {estimatedTime && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full shadow-lg">
                <Clock className="w-3 h-3" />
                {estimatedTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Rating & Price Level Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          {rating !== undefined && (
            <CardRating rating={rating} reviewCount={reviewCount} size="md" />
          )}

          {/* Price Level or Price */}
          {(priceLevel || price) && (
            <div className="flex items-center">
              {price ? (
                <span className="text-sm font-semibold text-gray-900">
                  {price}
                </span>
              ) : (
                renderPriceLevel()
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
