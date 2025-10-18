import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../../types/overview.types";

interface RevenueChartProps {
  shopRevenue: number;
  restaurantRevenue: number;
  amenityRevenue: number;
  currency?: string;
  loading?: boolean;
}

/**
 * Revenue comparison chart
 */
export const RevenueChart: React.FC<RevenueChartProps> = ({
  shopRevenue,
  restaurantRevenue,
  amenityRevenue,
  currency = "€",
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

  const data: ChartDataPoint[] = [
    {
      name: "Shop",
      revenue: shopRevenue,
      value: shopRevenue,
    },
    {
      name: "Restaurant",
      revenue: restaurantRevenue,
      value: restaurantRevenue,
    },
    {
      name: "Amenities",
      revenue: amenityRevenue,
      value: amenityRevenue,
    },
  ];

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Revenue Comparison</h3>
      <p className="mt-1 text-sm text-gray-500">
        Total revenue by service type
      </p>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency:
                    currency === "€" ? "EUR" : currency === "$" ? "USD" : "EUR",
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (€)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
