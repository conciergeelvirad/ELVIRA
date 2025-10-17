import React from "react";
import { cn } from "../../../../utils";
import { LoadingState } from "./LoadingState";

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  backdrop?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Loading...",
  children,
  backdrop = true,
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center z-50",
            backdrop && "bg-white bg-opacity-75"
          )}
        >
          <LoadingState message={message} />
        </div>
      )}
    </div>
  );
};
