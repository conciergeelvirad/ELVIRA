import { ReactNode } from "react";
import { GridContainer } from "./GridContainer";
import type { GridColumns, GridGap } from "../../../utils/ui/layout/grid";

interface GridProps {
  children: ReactNode;
  columns?: GridColumns;
  gap?: GridGap;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, ...props }) => {
  return <GridContainer {...props}>{children}</GridContainer>;
};
