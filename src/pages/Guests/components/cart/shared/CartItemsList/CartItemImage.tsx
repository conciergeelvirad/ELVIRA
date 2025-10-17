/**
 * CartItemImage Component
 *
 * Displays cart item image with fallback
 * Consistent sizing and styling across all carts
 */

import { ShoppingBag } from "lucide-react";

interface CartItemImageProps {
  imageUrl?: string | null;
  itemName: string;
  size?: "sm" | "md" | "lg";
}

export const CartItemImage = ({
  imageUrl,
  itemName,
  size = "md",
}: CartItemImageProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const iconSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg overflow-hidden
        bg-gray-100
        flex-shrink-0
        flex items-center justify-center
      `}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={itemName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Replace with fallback icon if image fails to load
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) {
              (fallback as HTMLElement).style.display = "flex";
            }
          }}
        />
      ) : (
        <ShoppingBag className={`${iconSizeClasses[size]} text-gray-400`} />
      )}
      {/* Fallback icon (hidden by default, shown on image error) */}
      <ShoppingBag
        className={`${iconSizeClasses[size]} text-gray-400`}
        style={{ display: imageUrl ? "none" : "flex" }}
      />
    </div>
  );
};
