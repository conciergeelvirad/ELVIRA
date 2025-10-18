import React from "react";
import { TopItemsChart } from "../charts";
import type { TopItem } from "../../types/overview.types";

interface TopItemsSectionProps {
  topAmenities: TopItem[];
  topProducts: TopItem[];
  topMenuItems: TopItem[];
  loading?: boolean;
}

/**
 * Top items section with bar charts
 */
export const TopItemsSection: React.FC<TopItemsSectionProps> = ({
  topAmenities,
  topProducts,
  topMenuItems,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <TopItemsChart
        title="🏆 Most Requested Amenities"
        items={topAmenities}
        loading={loading}
      />
      <TopItemsChart
        title="🏆 Best-Selling Products"
        items={topProducts}
        loading={loading}
      />
      <TopItemsChart
        title="🏆 Popular Menu Items"
        items={topMenuItems}
        loading={loading}
      />
    </div>
  );
};
