/**
 * Overview Dashboard Type Definitions
 */

export interface GuestMetrics {
  totalActiveGuests: number;
  guestsByCountry: CountryDistribution[];
  totalGuests: number;
}

export interface CountryDistribution {
  country: string;
  count: number;
}

export interface RevenueMetrics {
  shopRevenue: number;
  restaurantRevenue: number;
  amenityRevenue: number;
  totalRevenue: number;
  shopOrderCount: number;
  restaurantOrderCount: number;
  amenityRequestCount: number;
  averageShopOrder: number;
  averageRestaurantOrder: number;
  averageAmenityRequest: number;
}

export interface ServiceMetrics {
  amenityRequests: StatusBreakdown;
  shopOrders: StatusBreakdown;
  restaurantOrders: StatusBreakdown;
  topAmenities: TopItem[];
  topProducts: TopItem[];
  topMenuItems: TopItem[];
}

export interface StatusBreakdown {
  pending: number;
  confirmed?: number;
  preparing?: number;
  ready?: number;
  completed: number;
  cancelled: number;
  // Legacy status support (deprecated)
  in_progress?: number;
  processing?: number;
  delivered?: number;
}

export interface TopItem {
  name: string;
  count: number;
  imageUrl?: string;
}

export interface OverviewMetrics {
  guests: GuestMetrics;
  revenue: RevenueMetrics;
  services: ServiceMetrics;
  isLoading: boolean;
  error: Error | null;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  loading?: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
