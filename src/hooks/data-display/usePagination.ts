import { useState, useCallback, useMemo } from "react";
import { calculatePaginationInfo } from "../../utils/data/pagination";

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
}

// Data-aware pagination for CRUDPageTemplate
export interface UsePaginationWithDataReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedItems: T[];
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  resetPagination: () => void;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
}: UsePaginationOptions): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const paginationInfo = useMemo(
    () => calculatePaginationInfo(currentPage, pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, paginationInfo.totalPages));
      setCurrentPage(validPage);
    },
    [paginationInfo.totalPages]
  );

  const nextPage = useCallback(() => {
    if (paginationInfo.canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginationInfo.canGoNext]);

  const previousPage = useCallback(() => {
    if (paginationInfo.canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginationInfo.canGoPrevious]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages: paginationInfo.totalPages,
    startItem: paginationInfo.startItem,
    endItem: paginationInfo.endItem,
    canGoPrevious: paginationInfo.canGoPrevious,
    canGoNext: paginationInfo.canGoNext,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
  };
};

// Data-aware pagination hook for CRUDPageTemplate
export function usePaginationWithData<T>(
  data: T[],
  initialPageSize: number = 10
): UsePaginationWithDataReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const handlePageChange = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
}
