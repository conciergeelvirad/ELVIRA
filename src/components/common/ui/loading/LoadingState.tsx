import React from "react";
import { cn } from "../../../../utils";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoadingDots } from "./LoadingUtils";
import { SkeletonText } from "./SkeletonText";
import { LoadingSize } from "./loadingConstants";

export interface LoadingStateProps {
  type?: "spinner" | "skeleton" | "dots";
  message?: string;
  className?: string;
  size?: LoadingSize;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = "spinner",
  message = "Loading...",
  className,
  size = "md",
}) => {
  const renderLoader = () => {
    switch (type) {
      case "dots":
        return <LoadingDots size={size} />;
      case "skeleton":
        return <SkeletonText lines={2} />;
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8",
        className
      )}
    >
      {renderLoader()}
      {message && (
        <p
          className={cn(
            "text-gray-600 mt-3",
            size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
};
