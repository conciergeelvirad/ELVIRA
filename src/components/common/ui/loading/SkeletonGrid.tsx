import React from "react";
import { cn } from "../../../../utils";
import { SkeletonCard } from "./SkeletonCard";

export interface SkeletonGridProps {
  items?: number;
  columns?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  items = 6,
  columns = 3,
  className,
}) => {
  const colMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        colMap[columns as keyof typeof colMap] || colMap[3],
        className
      )}
    >
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};
