import { useGuestMetrics } from "./useGuestMetrics";
import { useRevenueMetrics } from "./useRevenueMetrics";
import { useServiceMetrics } from "./useServiceMetrics";
import type { OverviewMetrics } from "../types/overview.types";

/**
 * Main hook that orchestrates all overview metrics
 */
export const useOverviewMetrics = (): OverviewMetrics => {
  const {
    metrics: guestMetrics,
    isLoading: guestLoading,
    error: guestError,
  } = useGuestMetrics();

  const {
    metrics: revenueMetrics,
    isLoading: revenueLoading,
    error: revenueError,
  } = useRevenueMetrics();

  const {
    metrics: serviceMetrics,
    isLoading: serviceLoading,
    error: serviceError,
  } = useServiceMetrics();

  return {
    guests: guestMetrics,
    revenue: revenueMetrics,
    services: serviceMetrics,
    isLoading: guestLoading || revenueLoading || serviceLoading,
    error: guestError || revenueError || serviceError,
  };
};
