export const cuisineTypes = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "French",
  "Spanish",
  "Mediterranean",
  "American",
  "Other",
] as const;

export const foodTypes = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Kosher",
  "Halal",
  "Seafood",
  "BBQ",
  "Fast Food",
  "Fine Dining",
] as const;

export interface RestaurantFormData {
  name: string;
  cuisine: (typeof cuisineTypes)[number];
  description: string;
  food_types: string[];
  is_active: boolean;
  opening_hours?: string;
  closing_hours?: string;
  contact_number?: string;
  max_capacity?: number;
}

export interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  initialData?: Partial<RestaurantFormData>;
  title?: string;
  isLoading?: boolean;
}
