import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { RevenueMetrics } from "../types/overview.types";

/**
 * Hook to fetch revenue-related metrics
 */
export const useRevenueMetrics = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    shopRevenue: 0,
    restaurantRevenue: 0,
    amenityRevenue: 0,
    totalRevenue: 0,
    shopOrderCount: 0,
    restaurantOrderCount: 0,
    amenityRequestCount: 0,
    averageShopOrder: 0,
    averageRestaurantOrder: 0,
    averageAmenityRequest: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRevenueMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch shop orders revenue (exclude cancelled orders)
        const { data: shopOrders, error: shopError } = await supabase
          .from("shop_orders")
          .select("total_price, status")
          .in("status", ["completed", "delivered", "processing", "pending"]);

        if (shopError) throw shopError;

        const shopRevenue =
          shopOrders?.reduce(
            (sum, order) => sum + (order.total_price || 0),
            0
          ) || 0;
        const shopOrderCount = shopOrders?.length || 0;

        // Fetch restaurant orders revenue (exclude cancelled orders)
        const { data: restaurantOrders, error: restaurantError } =
          await supabase
            .from("dine_in_orders")
            .select("total_price, status")
            .in("status", ["completed", "preparing", "pending"]);

        if (restaurantError) throw restaurantError;

        const restaurantRevenue =
          restaurantOrders?.reduce(
            (sum, order) => sum + (order.total_price || 0),
            0
          ) || 0;
        const restaurantOrderCount = restaurantOrders?.length || 0;

        // Fetch amenity requests with pricing
        const { data: amenityRequests, error: amenityError } = await supabase
          .from("amenity_requests")
          .select(
            `
            amenity_id,
            status,
            amenities (
              price
            )
          `
          )
          .in("status", ["completed", "in_progress", "confirmed", "pending"]);

        if (amenityError) throw amenityError;

        // Calculate amenity revenue
        let amenityRevenue = 0;
        let amenityRequestCount = 0;
        amenityRequests?.forEach((request) => {
          const amenity = Array.isArray(request.amenities)
            ? request.amenities[0]
            : request.amenities;
          if (amenity && amenity.price) {
            amenityRevenue += amenity.price;
            amenityRequestCount++;
          }
        });

        setMetrics({
          shopRevenue,
          restaurantRevenue,
          amenityRevenue,
          totalRevenue: shopRevenue + restaurantRevenue + amenityRevenue,
          shopOrderCount,
          restaurantOrderCount,
          amenityRequestCount,
          averageShopOrder:
            shopOrderCount > 0 ? shopRevenue / shopOrderCount : 0,
          averageRestaurantOrder:
            restaurantOrderCount > 0
              ? restaurantRevenue / restaurantOrderCount
              : 0,
          averageAmenityRequest:
            amenityRequestCount > 0 ? amenityRevenue / amenityRequestCount : 0,
        });
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching revenue metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueMetrics();
  }, []);

  return { metrics, isLoading, error };
};
