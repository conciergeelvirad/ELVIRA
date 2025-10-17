/**
 * Card Image Component
 *
 * Reusable image component for all card types
 * Features:
 * - Lazy loading
 * - Error handling with fallback
 * - Loading spinner
 * - Hover scale effect
 * - Gradient overlay
 * - Custom aspect ratio
 */

import { useState } from "react";

export interface CardImageProps {
  src?: string;
  alt: string;
  fallbackEmoji?: string;
  fallbackText?: string;
  aspectRatio?: "square" | "video" | "portrait"; // 1:1, 16:9, 3:4
  showGradient?: boolean;
  className?: string;
}

export const CardImage = ({
  src,
  alt,
  fallbackEmoji = "🖼️",
  fallbackText = "No image",
  aspectRatio = "video",
  showGradient = true,
  className = "",
}: CardImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Map aspect ratio to Tailwind classes
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  return (
    <div
      className={`relative w-full ${aspectRatioClass} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${className}`}
    >
      {/* Image */}
      {src && !imageError ? (
        <>
          {/* Loading Spinner */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Actual Image */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      ) : (
        /* Fallback */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="text-4xl mb-2">{fallbackEmoji}</div>
            <span className="text-sm text-gray-400">{fallbackText}</span>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      )}
    </div>
  );
};
