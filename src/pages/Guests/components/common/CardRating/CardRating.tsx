/**
 * Card Rating Component
 *
 * Reusable rating display for cards
 * Shows star icon, rating number, and review count
 */

import { Star } from "lucide-react";

export interface CardRatingProps {
  rating: number;
  reviewCount?: number;
  showStars?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const CardRating = ({
  rating,
  reviewCount,
  showStars = true,
  size = "md",
  className = "",
}: CardRatingProps) => {
  // Size configurations
  const sizeConfig = {
    sm: { icon: 12, text: "text-xs", font: "font-semibold" },
    md: { icon: 16, text: "text-sm", font: "font-bold" },
    lg: { icon: 20, text: "text-base", font: "font-bold" },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Star Icon */}
      {showStars && (
        <Star size={config.icon} className="fill-yellow-400 text-yellow-400" />
      )}

      {/* Rating Number */}
      <span className={`${config.text} ${config.font}`}>
        {rating.toFixed(1)}
      </span>

      {/* Review Count */}
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className={`${config.text} text-gray-500`}>({reviewCount})</span>
      )}
    </div>
  );
};
