import { GridColumn } from '../../../types/table';
import { SKELETON_BASE, CARD_PADDING } from '../../../constants/styles';

interface GridLoadingSkeletonProps {
  columns: GridColumn[];
  count: number;
}

export const GridLoadingSkeleton = ({ columns, count }: GridLoadingSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="bg-white rounded-xl shadow overflow-hidden">
          <div className={`${CARD_PADDING} space-y-4`}>
            {columns.map((column) => (
              <div key={column.key}>
                <div className={`h-3 w-20 ${SKELETON_BASE} mb-2`} />
                <div className={`h-4 w-full ${SKELETON_BASE}`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
