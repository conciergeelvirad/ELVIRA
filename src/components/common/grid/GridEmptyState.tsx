import { ReactNode } from "react";
import { cn } from "../../../utils";

interface GridEmptyStateProps {
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state component for grids
 */
export const GridEmptyState: React.FC<GridEmptyStateProps> = ({
  message = "No items available",
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow",
        className
      )}
    >
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <p className="text-gray-500 text-center mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
