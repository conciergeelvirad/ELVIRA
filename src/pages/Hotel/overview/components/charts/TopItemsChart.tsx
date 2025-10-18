import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopItem } from "../../types/overview.types";

interface TopItemsChartProps {
  title: string;
  items: TopItem[];
  loading?: boolean;
}

/**
 * Top items horizontal bar chart
 */
export const TopItemsChart: React.FC<TopItemsChartProps> = ({
  title,
  items,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-48 rounded bg-gray-200"></div>
          <div className="mt-4 h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-8 flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const data = items.map((item) => ({
    name:
      item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
    count: item.count,
  }));

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">Top 5 most popular items</p>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
