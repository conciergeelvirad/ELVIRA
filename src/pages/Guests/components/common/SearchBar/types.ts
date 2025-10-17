/**
 * SearchBar Component Types
 *
 * Shared search bar component for guest pages with search, filter, and cart functionality
 */

export interface SearchBarProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;

  /**
   * Current search value
   */
  value: string;

  /**
   * Callback when search value changes
   */
  onSearchChange: (value: string) => void;

  /**
   * Callback when filter button is clicked
   */
  onFilterClick?: () => void;

  /**
   * Number of items in cart (0 hides the cart button)
   */
  cartItemCount?: number;

  /**
   * Callback when cart button is clicked
   */
  onCartClick?: () => void;

  /**
   * Show/hide filter button
   */
  showFilter?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}
