/**
 * Card Image Component
 *
 * Renders the image section of a GenericCard with:
 * - Image with error handling
 * - Fallback UI for failed images
 * - Badge overlay positioned on top-right
 */

import React, { useState } from "react";
import type { CardBadge } from "./types";

export interface CardImageProps {
  /** Image URL */
  image: string;
  /** Image height class (e.g., "h-48") */
  imageHeight: string;
  /** Alt text for image */
  imageAlt: string;
  /** Fallback element if image fails to load */
  imageFallback?: React.ReactNode;
  /** Optional badge to display over the image */
  badge?: CardBadge;
  /** Render function for badge */
  onRenderBadge: (badge: CardBadge) => React.ReactNode;
}

export const CardImage: React.FC<CardImageProps> = ({
  image,
  imageHeight,
  imageAlt,
  imageFallback,
  badge,
  onRenderBadge,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative ${imageHeight} bg-gray-100`}>
      {!imageError ? (
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          {imageFallback || (
            <div className="text-gray-400 text-center p-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Image unavailable</span>
            </div>
          )}
        </div>
      )}

      {/* Badge positioned inside image for image cards */}
      {badge && (
        <div className="absolute top-2 right-2">{onRenderBadge(badge)}</div>
      )}
    </div>
  );
};
