import { ReactNode } from "react";
import { cn } from "../../../utils";
import {
  getTableContainerClasses,
  getTableWrapperClasses,
  getTableClasses,
} from "../../../utils/ui/layout/table";

interface TableContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Table container with consistent styling and overflow handling
 */
export const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(getTableContainerClasses(className))}>
      <div className={getTableWrapperClasses()}>
        <table className={getTableClasses()}>{children}</table>
      </div>
    </div>
  );
};
