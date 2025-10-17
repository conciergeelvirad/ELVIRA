/**
 * SearchBar Component
 *
 * Reusable search bar with optional filter and cart buttons
 * Used across guest pages (menu, services, shop, tours)
 *
 * Features:
 * - Search input with icon
 * - Optional filter button
 * - Optional cart button (auto-hides when count = 0)
 * - Cart badge with item count
 * - Fully responsive
 * - Accessible
 */

import { Search, Filter, ShoppingCart } from "lucide-react";
import { SearchBarProps } from "./types";

export const SearchBar = ({
  placeholder = "Search...",
  value,
  onSearchChange,
  onFilterClick,
  cartItemCount = 0,
  onCartClick,
  showFilter = true,
  className = "",
}: SearchBarProps) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="
            block w-full pl-9 pr-2.5 py-2
            text-sm
            border border-gray-300 rounded-lg
            focus:ring-1 focus:ring-green-500 focus:border-transparent
            placeholder-gray-400
            text-gray-900
            transition-colors
          "
          aria-label="Search"
        />
      </div>

      {/* Filter Button */}
      {showFilter && onFilterClick && (
        <button
          onClick={onFilterClick}
          className="
            p-2
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 hover:border-gray-400
            active:bg-gray-100
            focus:outline-none focus:ring-1 focus:ring-green-500
            transition-all
            flex items-center justify-center
            flex-shrink-0
          "
          aria-label="Filter options"
        >
          <Filter className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {/* Cart Button (only shows when cart has items) */}
      {cartItemCount > 0 && onCartClick && (
        <button
          onClick={onCartClick}
          className="
            relative p-2
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 hover:border-gray-400
            active:bg-gray-100
            focus:outline-none focus:ring-1 focus:ring-green-500
            transition-all
            flex items-center justify-center
            flex-shrink-0
          "
          aria-label={`Cart with ${cartItemCount} items`}
        >
          <ShoppingCart className="h-4 w-4 text-gray-600" />

          {/* Cart Badge */}
          {cartItemCount > 0 && (
            <span
              className="
                absolute -top-0.5 -right-0.5
                bg-red-500 text-white
                text-[10px] font-bold
                rounded-full
                h-4 w-4
                flex items-center justify-center
                border border-white
              "
            >
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};
