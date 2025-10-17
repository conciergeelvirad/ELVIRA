import React from "react";
import { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";
import { getDetailFields } from "./ShopOrderColumns";
import { Package } from "lucide-react";

interface ShopOrderDetailProps {
  item: ShopOrder | Record<string, unknown>;
}

export const ShopOrderDetail: React.FC<ShopOrderDetailProps> = ({ item }) => {
  const order = item as unknown as ShopOrder;

  // Extract order items
  const orderItems = (order as any).shop_order_items || [];

  // Calculate subtotal from items
  const subtotal = orderItems.reduce((sum: number, item: any) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Order Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Order Information
        </h3>
        {getDetailFields(order).map((field, index) => (
          <div
            key={index}
            className="py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="grid grid-cols-2 items-center">
              <div>
                <span className="text-sm font-medium text-gray-500 uppercase">
                  {field.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {field.value?.toString() || "-"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Items List */}
      {orderItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Order Items
          </h3>
          <div className="space-y-2">
            {orderItems.map((item: any, index: number) => {
              const product = item.product || {};
              const productName = product.name || "Unknown Product";
              const productPrice = product.price || 0;
              const quantity = item.quantity || 1;
              const itemTotal = productPrice * quantity;
              const imageUrl = product.image_url;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${productPrice.toFixed(2)} × {quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-700 uppercase">
                  Total
                </p>
                <p className="text-xs text-gray-500">
                  {orderItems.length} item{orderItems.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${order.total_price.toFixed(2)}
                </p>
                {subtotal !== order.total_price && (
                  <p className="text-xs text-gray-500">
                    Subtotal: ${subtotal.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
