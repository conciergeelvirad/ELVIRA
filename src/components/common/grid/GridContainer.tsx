import { ReactNode } from "react";
import { cn } from "../../../utils";
import {
  getGridLayoutClasses,
  GridColumns,
  GridGap,
} from "../../../utils/ui/layout/grid";

interface GridContainerProps {
  children: ReactNode;
  columns?: GridColumns;
  gap?: GridGap;
  className?: string;
}

/**
 * Responsive grid container with consistent spacing
 */
export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  columns = 3,
  gap = "md",
  className,
}) => {
  return (
    <div className={cn(getGridLayoutClasses(columns, gap), className)}>
      {children}
    </div>
  );
};
