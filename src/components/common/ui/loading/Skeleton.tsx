import React from "react";
import { cn } from "../../../../utils";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = false,
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        "bg-gray-200 animate-pulse",
        rounded ? "rounded-full" : "rounded",
        className
      )}
      style={style}
    />
  );
};
