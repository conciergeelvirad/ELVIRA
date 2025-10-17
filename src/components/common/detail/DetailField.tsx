/**
 * DetailField Component
 *
 * Reusable component for displaying labeled fields in detail modals
 */

import React from "react";

interface DetailFieldProps {
  label: string;
  value?: string | number | React.ReactNode;
  className?: string;
  mono?: boolean; // For monospace text like IDs
  hidden?: boolean; // Conditional rendering
  fontWeight?: "normal" | "medium" | "semibold";
}

export const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  className = "",
  mono = false,
  hidden = false,
  fontWeight = "normal",
}) => {
  if (hidden || !value) return null;

  const fontWeightClass = {
    normal: "",
    medium: "font-medium",
    semibold: "font-semibold",
  }[fontWeight];

  return (
    <div className={className}>
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </h3>
      <p
        className={`text-sm text-gray-900 ${
          mono ? "font-mono" : ""
        } ${fontWeightClass}`}
      >
        {value}
      </p>
    </div>
  );
};
