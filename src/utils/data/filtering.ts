export const getValueByAccessor = <T extends Record<string, any>>(
  data: T,
  accessor: keyof T | ((item: T) => any) | string | undefined,
  key: string
): any => {
  if (accessor) {
    if (typeof accessor === "function") {
      return accessor(data);
    }
    return data[accessor];
  }
  return data[key];
};

export const calculateColSpan = (options: {
  columnsLength: number;
  selectable?: boolean;
  expandable?: boolean;
}): number => {
  const { columnsLength, selectable = false, expandable = false } = options;
  return columnsLength + (selectable ? 1 : 0) + (expandable ? 1 : 0);
};
