import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn, getPaginationRange } from "../../../utils";
import { PaginationButton } from "./PaginationButton";
import {
  BUTTON_BASE,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
} from "../../../constants/styles";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  variant?: "full" | "compact";
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  variant = "full",
  className,
}: PaginationProps) => {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>

        {onPageSizeChange && variant === "full" && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {variant === "full" && (
          <PaginationButton
            icon={ChevronsLeft}
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            label="First page"
          />
        )}

        <PaginationButton
          icon={ChevronLeft}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          label="Previous page"
        />

        {variant === "full" && (
          <div className="flex items-center gap-1">
            {getPaginationRange(currentPage, totalPages).map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..."}
                className={cn(
                  "min-w-[2.5rem] px-3 py-1.5 text-sm",
                  BUTTON_BASE,
                  page === currentPage
                    ? BUTTON_PRIMARY
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : BUTTON_SECONDARY
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {variant === "compact" && (
          <div className="px-3 py-1.5 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
        )}

        <PaginationButton
          icon={ChevronRight}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          label="Next page"
        />

        {variant === "full" && (
          <PaginationButton
            icon={ChevronsRight}
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            label="Last page"
          />
        )}
      </div>
    </div>
  );
};
