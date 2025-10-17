/**
 * Filter Panel Component
 *
 * A reusable, composable filter panel component that can be used across different pages.
 * Uses a compound component pattern for maximum flexibility.
 */

import React, { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export interface FilterSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
  className?: string;
}

export interface FilterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export interface FilterActionsProps {
  onReset: () => void;
  resultCount?: number;
  totalCount?: number;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main Filter Panel Container
 *
 * @example
 * <FilterPanel isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} title="Filters">
 *   <FilterPanel.Section title="Categories">
 *     <FilterPanel.Checkbox label="Restaurant" checked={...} onChange={...} />
 *   </FilterPanel.Section>
 *   <FilterPanel.Actions onReset={handleReset} resultCount={10} totalCount={50} />
 * </FilterPanel>
 */
export const FilterPanel: React.FC<FilterPanelProps> & {
  Section: React.FC<FilterSectionProps>;
  Checkbox: React.FC<FilterCheckboxProps>;
  Slider: React.FC<FilterSliderProps>;
  Actions: React.FC<FilterActionsProps>;
} = ({ isOpen, onToggle, children, title = "Filters", className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Filter Header - More compact */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Filter Content - More compact spacing */}
      {isOpen && (
        <div className="px-3 pb-3 space-y-4 border-t border-gray-200 pt-3">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Filter Section - Groups related filters together
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      <h3 className="text-xs font-medium text-gray-600 mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
};

/**
 * Filter Checkbox - Individual checkbox filter item
 */
const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
  icon,
  className = "",
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-xs text-gray-700 flex items-center gap-1">
        {icon}
        {label}
      </span>
    </label>
  );
};

/**
 * Filter Slider - Range slider for numeric filters
 */
const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  className = "",
}) => {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs font-medium text-blue-600">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
};

/**
 * Filter Actions - Reset button and result counter
 */
const FilterActions: React.FC<FilterActionsProps> = ({
  onReset,
  resultCount,
  totalCount,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between pt-2 border-t border-gray-200 ${className}`}
    >
      <button
        onClick={onReset}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Reset
      </button>
      {resultCount !== undefined && totalCount !== undefined && (
        <div className="text-xs text-gray-500">
          {resultCount} of {totalCount}
        </div>
      )}
    </div>
  );
};

// Attach sub-components to main component
FilterPanel.Section = FilterSection;
FilterPanel.Checkbox = FilterCheckbox;
FilterPanel.Slider = FilterSlider;
FilterPanel.Actions = FilterActions;
