/**
 * Restaurant Table Header Component
 *
 * Sortable table header with column labels and sort indicators
 */

import React from "react";
import { ChevronUp } from "lucide-react";

interface TableHeader {
  key: string;
  label: string;
  sortable: boolean;
}

interface RestaurantTableHeaderProps {
  headers: TableHeader[];
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
}

export const RestaurantTableHeader: React.FC<RestaurantTableHeaderProps> = ({
  headers,
  sortKey,
  sortDirection,
  onSort,
}) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header.key}
            onClick={() => header.sortable && onSort(header.key)}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              header.sortable ? "cursor-pointer hover:bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center">
              {header.label}
              {header.sortable && sortKey === header.key && (
                <ChevronUp
                  className={`ml-1 w-4 h-4 transition-transform ${
                    sortDirection === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
