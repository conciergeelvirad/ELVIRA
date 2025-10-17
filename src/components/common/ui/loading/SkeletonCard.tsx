import React from "react";
import { cn } from "../../../../utils";
import { Card } from "../Card";
import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton width={48} height={48} rounded />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </Card>
  );
};
