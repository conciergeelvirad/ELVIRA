import React from "react";
import { Button } from "../Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { ButtonHTMLAttributes } from "react";

export interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  // Determine spinner color based on variant
  const getSpinnerColor = () => {
    return variant === "outline" || variant === "ghost" ? "primary" : "white";
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" color={getSpinnerColor()} className="mr-2" />
      )}
      {children}
    </Button>
  );
};
