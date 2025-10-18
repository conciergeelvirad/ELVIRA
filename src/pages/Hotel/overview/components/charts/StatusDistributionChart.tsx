import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { StatusBreakdown } from "../../types/overview.types";

interface StatusDistributionChartProps {
  title: string;
  statuses: StatusBreakdown;
  loading?: boolean;
}

const COLORS = {
  pending: "#eab308", // yellow
  confirmed: "#3b82f6", // blue
  preparing: "#f97316", // orange
  ready: "#8b5cf6", // purple
  completed: "#22c55e", // green
  cancelled: "#ef4444", // red
  // Legacy support
  in_progress: "#f97316", // orange (map to preparing)
  processing: "#3b82f6", // blue (map to confirmed)
  delivered: "#16a34a", // dark green (map to completed)
};

/**
 * Status distribution pie chart
 */
export const StatusDistributionChart: React.FC<
  StatusDistributionChartProps
> = ({ title, statuses, loading = false }) => {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-200"></div>
          <div className="mt-4 h-64 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const data = Object.entries(statuses)
    .filter(([, value]) => value !== undefined && value > 0)
    .map(([name, value]) => ({
      name: name
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value,
      color: COLORS[name as keyof typeof COLORS] || "#6b7280",
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-8 flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: { name: string; percent: number }) =>
                `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
