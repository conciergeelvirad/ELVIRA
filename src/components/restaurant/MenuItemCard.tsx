import React from "react";
import { Menu } from "lucide-react";
import type { MenuItem } from "../../hooks/queries/hotel-management/restaurants";
import { GenericCard, CardActionFooter } from "../common/data-display";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onClick?: () => void;
  onEdit?: (menuItem: MenuItem) => void;
  onDelete?: (menuItem: MenuItem) => void;
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
      title={<span className="line-clamp-1">{menuItem.name}</span>}
      badge={{
        label: status,
        variant: "soft",
        className: menuItem.is_active
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600",
      }}
      price={{
        value: menuItem.price,
        currency: "$",
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
