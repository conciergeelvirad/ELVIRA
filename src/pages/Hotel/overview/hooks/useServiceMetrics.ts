import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type {
  ServiceMetrics,
  StatusBreakdown,
  TopItem,
} from "../types/overview.types";

/**
 * Hook to fetch service-related metrics (amenities, shop, restaurant)
 */
export const useServiceMetrics = () => {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    amenityRequests: {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    },
    shopOrders: {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    },
    restaurantOrders: {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    },
    topAmenities: [],
    topProducts: [],
    topMenuItems: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServiceMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch amenity requests status breakdown
        const { data: amenityRequests, error: amenityError } = await supabase
          .from("amenity_requests")
          .select("status, amenity_id");

        if (amenityError) throw amenityError;

        const amenityStatus: StatusBreakdown = {
          pending: 0,
          confirmed: 0,
          preparing: 0,
          ready: 0,
          completed: 0,
          cancelled: 0,
        };

        amenityRequests?.forEach((req) => {
          const status = req.status?.toLowerCase();
          if (status === "pending") amenityStatus.pending++;
          else if (status === "confirmed") amenityStatus.confirmed!++;
          else if (status === "preparing") amenityStatus.preparing!++;
          else if (status === "ready") amenityStatus.ready!++;
          else if (status === "completed") amenityStatus.completed++;
          else if (status === "cancelled") amenityStatus.cancelled++;
          // Legacy support
          else if (status === "in_progress") amenityStatus.preparing!++;
        });

        // Fetch shop orders status breakdown
        const { data: shopOrders, error: shopError } = await supabase
          .from("shop_orders")
          .select("status");

        if (shopError) throw shopError;

        const shopStatus: StatusBreakdown = {
          pending: 0,
          confirmed: 0,
          preparing: 0,
          ready: 0,
          completed: 0,
          cancelled: 0,
        };

        shopOrders?.forEach((order) => {
          const status = order.status?.toLowerCase();
          if (status === "pending") shopStatus.pending++;
          else if (status === "confirmed") shopStatus.confirmed!++;
          else if (status === "preparing") shopStatus.preparing!++;
          else if (status === "ready") shopStatus.ready!++;
          else if (status === "completed") shopStatus.completed++;
          else if (status === "cancelled") shopStatus.cancelled++;
          // Legacy support
          else if (status === "processing") shopStatus.preparing!++;
          else if (status === "delivered") shopStatus.completed++;
        });

        // Fetch restaurant orders status breakdown
        const { data: restaurantOrders, error: restaurantError } =
          await supabase.from("dine_in_orders").select("status");

        if (restaurantError) throw restaurantError;

        const restaurantStatus: StatusBreakdown = {
          pending: 0,
          confirmed: 0,
          preparing: 0,
          ready: 0,
          completed: 0,
          cancelled: 0,
        };

        restaurantOrders?.forEach((order) => {
          const status = order.status?.toLowerCase();
          if (status === "pending") restaurantStatus.pending++;
          else if (status === "confirmed") restaurantStatus.confirmed!++;
          else if (status === "preparing") restaurantStatus.preparing!++;
          else if (status === "ready") restaurantStatus.ready!++;
          else if (status === "completed") restaurantStatus.completed++;
          else if (status === "cancelled") restaurantStatus.cancelled++;
          // Legacy support
          else if (status === "in_progress") restaurantStatus.preparing!++;
        });

        // Fetch top amenities
        const { data: topAmenitiesData, error: topAmenitiesError } =
          await supabase
            .from("amenity_requests")
            .select(
              `
            amenity_id,
            amenities (
              name,
              image_url
            )
          `
            )
            .not("amenities", "is", null);

        if (topAmenitiesError) throw topAmenitiesError;

        const amenityMap = new Map<
          string,
          { name: string; count: number; imageUrl?: string }
        >();
        topAmenitiesData?.forEach((req) => {
          const amenity = Array.isArray(req.amenities)
            ? req.amenities[0]
            : req.amenities;
          if (amenity) {
            const key = amenity.name;
            const existing = amenityMap.get(key);
            if (existing) {
              existing.count++;
            } else {
              amenityMap.set(key, {
                name: amenity.name,
                count: 1,
                imageUrl: amenity.image_url,
              });
            }
          }
        });

        const topAmenities: TopItem[] = Array.from(amenityMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => ({
            name: item.name,
            count: item.count,
            imageUrl: item.imageUrl,
          }));

        // Fetch top products
        const { data: shopOrderItems, error: shopItemsError } = await supabase
          .from("shop_order_items")
          .select(
            `
            product_id,
            quantity,
            products (
              name,
              image_url
            )
          `
          )
          .not("products", "is", null);

        if (shopItemsError) throw shopItemsError;

        const productMap = new Map<
          string,
          { name: string; count: number; imageUrl?: string }
        >();
        shopOrderItems?.forEach((item) => {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products;
          if (product) {
            const key = product.name;
            const existing = productMap.get(key);
            if (existing) {
              existing.count += item.quantity;
            } else {
              productMap.set(key, {
                name: product.name,
                count: item.quantity,
                imageUrl: product.image_url,
              });
            }
          }
        });

        const topProducts: TopItem[] = Array.from(productMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => ({
            name: item.name,
            count: item.count,
            imageUrl: item.imageUrl,
          }));

        // Fetch top menu items
        const { data: dineInOrderItems, error: dineInItemsError } =
          await supabase
            .from("dine_in_order_items")
            .select(
              `
            menu_item_id,
            quantity,
            menu_items (
              name,
              image_url
            )
          `
            )
            .not("menu_items", "is", null);

        if (dineInItemsError) throw dineInItemsError;

        const menuItemMap = new Map<
          string,
          { name: string; count: number; imageUrl?: string }
        >();
        dineInOrderItems?.forEach((item) => {
          const menuItem = Array.isArray(item.menu_items)
            ? item.menu_items[0]
            : item.menu_items;
          if (menuItem) {
            const key = menuItem.name;
            const existing = menuItemMap.get(key);
            if (existing) {
              existing.count += item.quantity;
            } else {
              menuItemMap.set(key, {
                name: menuItem.name,
                count: item.quantity,
                imageUrl: menuItem.image_url,
              });
            }
          }
        });

        const topMenuItems: TopItem[] = Array.from(menuItemMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => ({
            name: item.name,
            count: item.count,
            imageUrl: item.imageUrl,
          }));

        setMetrics({
          amenityRequests: amenityStatus,
          shopOrders: shopStatus,
          restaurantOrders: restaurantStatus,
          topAmenities,
          topProducts,
          topMenuItems,
        });
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching service metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceMetrics();
  }, []);

  return { metrics, isLoading, error };
};
