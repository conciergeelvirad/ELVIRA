import React from "react";
import { Menu, Star } from "lucide-react";
import type { MenuItem } from "../../../../../hooks/queries/hotel-management/restaurants";
import {
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
  onEdit?: (menuItem: MenuItem) => void;
  onDelete?: (menuItem: MenuItem) => void;
  onRecommendedToggle?: (id: string, newValue: boolean) => Promise<void>;
  currency?: string;
}

/**
 * Menu Item Card Component
 *
 * Displays a menu item in grid view with image, details, and action buttons.
 * Uses GenericCard for consistent styling across all entity types.
 */
export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  menuItem,
  onClick,
  onEdit,
  onDelete,
  onRecommendedToggle,
  currency = "$",
}) => {
  const status = menuItem.is_active ? "Active" : "Inactive";

  // Build sections for content area
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  // Category badge
  sections.push({
    content: (
      <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded">
        {menuItem.category}
      </span>
    ),
  });

  // Description
  if (menuItem.description) {
    sections.push({
      content: (
        <p className="text-sm text-gray-600 line-clamp-2">
          {menuItem.description}
        </p>
      ),
    });
  }

  return (
    <GenericCard
      image={menuItem.image_url || undefined}
      imageFallback={<Menu className="w-16 h-16 text-gray-400" />}
      title={
        <div className="flex items-center gap-1">
          {onRecommendedToggle && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                console.log("⭐ RECOMMENDED STAR CLICKED (Menu Item):", {
                  menuItemId: menuItem.id,
                  menuItemName: menuItem.name,
                  currentValue: menuItem.hotel_recommended,
                  newValue: !menuItem.hotel_recommended,
                });
                try {
                  await onRecommendedToggle(
                    menuItem.id,
                    !menuItem.hotel_recommended
                  );
                } catch (error) {
                  console.error("❌ Recommended toggle failed:", error);
                }
              }}
              className="hover:scale-110 transition-transform"
              title={
                menuItem.hotel_recommended
                  ? "Remove from recommended"
                  : "Mark as recommended"
              }
            >
              <Star
                className={`w-4 h-4 flex-shrink-0 ${
                  menuItem.hotel_recommended
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          )}
          {!onRecommendedToggle && menuItem.hotel_recommended && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
          <span className="line-clamp-1">{menuItem.name}</span>
        </div>
      }
      badge={{
        label: status,
        variant: "soft",
        className: menuItem.is_active
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600",
      }}
      price={{
        value: menuItem.price,
        currency: currency,
        className: "text-xl font-bold text-orange-600",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(menuItem) : undefined}
          onDelete={onDelete ? () => onDelete(menuItem) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};
