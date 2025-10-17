/**
 * Menu Item Card Component
 *
 * Compact horizontal card for menu items (Uber Eats / Lieferando style)
 * Features:
 * - Image on the left
 * - Title, description, price on the right
 * - Tags for service type and special type
 * - Star icon for recommended items
 * - Mobile-optimized compact design
 */

import { useState } from "react";
import { Star } from "lucide-react";
import { AddToCartButton } from "../cart";
import { useCart } from "../../../../contexts/CartContext";

export interface MenuItemCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price: string;
  tags?: string[];
  category?: string;
  isAvailable?: boolean;
  isRecommended?: boolean;
  onClick?: () => void;
  // Cart functionality
  showCartButton?: boolean;
  itemType?: "food" | "product";
  numericPrice?: number; // For cart functionality
  serviceType?: "restaurant_booking" | "room_service"; // For food items
  restaurantId?: string; // Restaurant ID for food items
}

export const MenuItemCard = ({
  id,
  title,
  description,
  imageUrl,
  price,
  tags = [],
  category,
  isAvailable = true,
  isRecommended = false,
  onClick,
  showCartButton = false,
  itemType = "food",
  numericPrice,
  serviceType,
  restaurantId,
}: MenuItemCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { canAddFoodItem } = useCart();

  // Check if this item conflicts with cart
  const serviceTypeConflict =
    itemType === "food" && serviceType && showCartButton
      ? !canAddFoodItem(serviceType).canAdd
      : false;

  // Get existing service type for warning message
  const existingServiceType =
    itemType === "food" && serviceType && showCartButton
      ? canAddFoodItem(serviceType).existingServiceType
      : undefined;

  const handleCardClick = () => {
    // Only trigger onClick if not clicking the cart button
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex gap-0 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Image - Left Side */}
      <div className="relative flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
        )}

        {/* Recommended Star Badge */}
        {isRecommended && (
          <div className="absolute top-2 left-2 bg-amber-500 rounded-full p-1 shadow-md">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}

        {/* Add to Cart Button - Bottom Right Corner */}
        {showCartButton && numericPrice !== undefined && isAvailable && (
          <div
            className="absolute bottom-1.5 right-1.5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <AddToCartButton
              itemId={id}
              itemName={title}
              itemPrice={numericPrice}
              itemImage={imageUrl}
              itemType={itemType}
              itemDescription={description}
              itemCategory={category}
              size="sm"
              disabled={!isAvailable || serviceTypeConflict}
              serviceType={serviceType}
              restaurantId={restaurantId}
            />
          </div>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 min-w-0 flex flex-col justify-between p-3">
        {/* Title and Price Row */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
              {title}
            </h3>
            <span className="text-sm font-bold text-gray-900 flex-shrink-0">
              {price}
            </span>
          </div>

          {/* Description */}

          {description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Service Type Conflict Warning */}
          {serviceTypeConflict && existingServiceType && (
            <p className="text-xs text-red-600 font-medium mb-2">
              ⚠️ Cart has{" "}
              {existingServiceType === "restaurant_booking"
                ? "restaurant"
                : "room service"}{" "}
              items
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
