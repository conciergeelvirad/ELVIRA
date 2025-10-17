import React from "react";
import { cn } from "../../../utils";
import { DataField } from "./FieldFormatters";
import { FieldDisplay } from "./FieldDisplay";
import { getLayoutClasses } from "../layout/layoutUtils";

// Re-export for convenience
export type { DataField };

interface DataDisplayCardProps {
  title?: string;
  subtitle?: string;
  fields: DataField[];
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3 | 4;
  showIcons?: boolean;
  compact?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
}

export const DataDisplayCard: React.FC<DataDisplayCardProps> = ({
  title,
  subtitle,
  fields,
  layout = "vertical",
  columns = 2,
  showIcons = false,
  compact = false,
  className,
  headerActions,
}) => {
  const visibleFields = fields.filter((field) => !field.hidden);

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden",
        className
      )}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-2">{headerActions}</div>
            )}
          </div>
        </div>
      )}

      <div className={cn("p-6", compact && "p-4")}>
        {visibleFields.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No data to display</p>
          </div>
        ) : (
          <div className={getLayoutClasses(layout, columns)}>
            {visibleFields.map((field) => (
              <FieldDisplay
                key={field.key}
                field={field}
                showIcons={showIcons}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
