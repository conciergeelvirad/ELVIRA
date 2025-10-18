/**
 * Category Filter Component
 *
 * Allows filtering by entity category (amenity, product, menu item categories)
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
}) => {
  return (
    <FilterPanel.Section title="Category">
      {categories.map((category) => (
        <FilterPanel.Checkbox
          key={category}
          label={category.charAt(0).toUpperCase() + category.slice(1)}
          checked={selectedCategories.includes(category)}
          onChange={() => onCategoryToggle(category)}
        />
      ))}
    </FilterPanel.Section>
  );
};
