import React from "react";
import { cn } from "../../../../utils";
import {
  LoadingSize,
  LoadingColor,
  loadingDotSizes,
  loadingDotColors,
} from "./loadingConstants";

// Shared dot animation component
export interface LoadingDotsProps {
  size?: LoadingSize;
  color?: LoadingColor;
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = "md",
  color = "primary",
  className,
}) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            loadingDotSizes[size],
            loadingDotColors[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};
