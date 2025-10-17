import { GridContainer } from "./GridContainer";
import {
  GridColumns,
  GridGap,
  getSkeletonCount,
} from "../../../utils/ui/layout/grid";
import { SkeletonCard } from "../ui/loading/SkeletonCard";

interface GridLoadingStateProps {
  columns?: GridColumns;
  gap?: GridGap;
  count?: number;
  className?: string;
}

/**
 * Loading state component for grids using skeleton cards
 */
export const GridLoadingState: React.FC<GridLoadingStateProps> = ({
  columns = 3,
  gap = "md",
  count,
  className,
}) => {
  const skeletonCount = count || getSkeletonCount(columns);

  return (
    <GridContainer columns={columns} gap={gap} className={className}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </GridContainer>
  );
};
