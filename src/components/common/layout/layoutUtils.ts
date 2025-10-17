// Layout utilities for DataDisplayCard
export const getLayoutClasses = (
  layout: "vertical" | "horizontal" | "grid",
  columns: 1 | 2 | 3 | 4
): string => {
  if (layout === "grid") {
    const colMap = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };
    return `grid ${colMap[columns]} gap-4`;
  }

  if (layout === "horizontal") {
    return "flex flex-wrap gap-6";
  }

  return "space-y-4";
};
