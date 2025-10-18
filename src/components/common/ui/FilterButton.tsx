import { ButtonHTMLAttributes, forwardRef } from "react";
import { Filter } from "lucide-react";
import { IconButton } from "./IconButton";

interface FilterButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  active?: boolean;
  size?: "sm" | "md" | "lg";
  badgeCount?: number; // Number of active filters to show as badge
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ active = false, size = "md", badgeCount, className, ...props }, ref) => {
    return (
      <div className="relative">
        <IconButton
          ref={ref}
          icon={Filter}
          variant={active ? "solid" : "default"}
          size={size}
          className={className}
          {...props}
        />
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </div>
    );
  }
);

FilterButton.displayName = "FilterButton";
