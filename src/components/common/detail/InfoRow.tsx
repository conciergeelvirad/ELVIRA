/**
 * Info Row Component
 *
 * A standardized component for displaying label-value pairs in detail views.
 * Provides consistent styling and layout options.
 *
 * @example Simple info row
 * <InfoRow label="Email" value="user@example.com" />
 *
 * @example With icon
 * <InfoRow
 *   label="Phone"
 *   value="+1234567890"
 *   icon={<Phone className="w-4 h-4" />}
 * />
 *
 * @example Vertical layout
 * <InfoRow label="Description" value="Long text..." vertical />
 */

import React from "react";
import { cn } from "../../../utils";

interface InfoRowProps {
  /** Field label */
  label: string;
  /** Field value (can be string or React element) */
  value: React.ReactNode;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Vertical layout (stacked) */
  vertical?: boolean;
  /** Label className override */
  labelClassName?: string;
  /** Value className override */
  valueClassName?: string;
}

/**
 * InfoRow - Standardized label-value pair display
 */
export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon,
  className,
  vertical = false,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div
      className={cn(
        vertical ? "flex flex-col gap-1" : "flex items-center gap-2",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="flex-shrink-0 text-gray-500">{icon}</span>}
        <span className={cn("text-sm text-gray-600", labelClassName)}>
          {label}:
        </span>
      </div>
      <span className={cn("text-sm font-medium text-gray-900", valueClassName)}>
        {value}
      </span>
    </div>
  );
};

/**
 * Info Section - Container for multiple InfoRows
 */
interface InfoSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {title}
        </h3>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
};
