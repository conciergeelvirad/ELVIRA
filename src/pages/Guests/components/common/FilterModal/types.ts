export interface FilterOptions {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  showOnlyRecommended: boolean;
  selectedRestaurants?: string[]; // For DineIn page
  selectedServiceTypes?: string[]; // For DineIn page (e.g., "breakfast", "lunch", "dinner")
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories: string[];
  maxPrice: number;
  currentFilters: FilterOptions;
  restaurants?: Array<{ id: string; name: string }>; // Optional: For DineIn page
  serviceTypes?: string[]; // Optional: For DineIn page
}
