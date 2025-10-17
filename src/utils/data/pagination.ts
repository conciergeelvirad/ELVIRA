export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};

export const calculatePaginationInfo = (
  currentPage: number,
  pageSize: number,
  totalItems: number
) => {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return {
    startItem,
    endItem,
    totalPages,
    canGoPrevious,
    canGoNext,
  };
};

// Helper function to calculate total pages
export const calculateTotalPages = (
  totalItems: number,
  pageSize: number
): number => {
  return Math.ceil(totalItems / pageSize);
};

// Helper function to get default pagination state
export const getDefaultPagination = () => ({
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalItems: 0,
});
