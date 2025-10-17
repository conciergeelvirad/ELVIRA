import React from "react";
import { cn } from "../../../utils";
import { DataField, formatFieldValue } from "./FieldFormatters";
import { getFieldIcon } from "./FieldIcons";
import { CopyButton } from "../ui/CopyButton";

interface FieldDisplayProps {
  field: DataField;
  showIcons?: boolean;
  compact?: boolean;
}

export const FieldDisplay: React.FC<FieldDisplayProps> = ({
  field,
  showIcons = false,
  compact = false,
}) => {
  const formattedValue = formatFieldValue(field);

  return (
    <div className={cn("space-y-1", field.className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcons && getFieldIcon(field)}
          <span
            className={cn(
              "font-medium text-gray-700",
              compact ? "text-sm" : "text-sm"
            )}
          >
            {field.label}
          </span>
        </div>
        {field.copyable && <CopyButton value={field.value} />}
      </div>
      <div className={cn("text-gray-900", compact ? "text-sm" : "text-base")}>
        {formattedValue}
      </div>
    </div>
  );
};
