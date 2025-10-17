import React from "react";
import { cn } from "../../../../utils";
import { Skeleton } from "./Skeleton";

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <div
      className={cn("bg-white rounded-lg border overflow-hidden", className)}
    >
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} height={20} width="80%" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height={16} width="90%" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
