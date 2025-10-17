/**
 * FilterPriceRange Component
 *
 * Dual-handle price range slider (Airbnb-style)
 */

interface FilterPriceRangeProps {
  priceRange: { min: number; max: number };
  maxPrice: number;
  onChange: (priceRange: { min: number; max: number }) => void;
}

export const FilterPriceRange = ({
  priceRange,
  maxPrice,
  onChange,
}: FilterPriceRangeProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
        <span className="text-sm text-gray-600">
          ${priceRange.min} - ${priceRange.max}
        </span>
      </div>
      <div className="relative pt-1 pb-4">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 rounded-lg">
          {/* Active range highlight */}
          <div
            className="absolute h-2 bg-blue-600 rounded-lg"
            style={{
              left: `${(priceRange.min / maxPrice) * 100}%`,
              right: `${100 - (priceRange.max / maxPrice) * 100}%`,
            }}
          />
        </div>

        {/* Min slider */}
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange.min}
          onChange={(e) =>
            onChange({
              ...priceRange,
              min: Math.min(Number(e.target.value), priceRange.max),
            })
          }
          className="absolute w-full top-1 h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: priceRange.min > maxPrice - 100 ? 5 : 3 }}
        />

        {/* Max slider */}
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceRange.max}
          onChange={(e) =>
            onChange({
              ...priceRange,
              max: Math.max(Number(e.target.value), priceRange.min),
            })
          }
          className="absolute w-full top-1 h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};
