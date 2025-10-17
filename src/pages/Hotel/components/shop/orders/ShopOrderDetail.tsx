import React from "react";
import { ShopOrder } from "../../../../../hooks/queries/hotel-management/shop-orders";
import { getDetailFields } from "./ShopOrderColumns";

interface ShopOrderDetailProps {
  item: ShopOrder | Record<string, unknown>;
}

export const ShopOrderDetail: React.FC<ShopOrderDetailProps> = ({ item }) => {
  const order = item as unknown as ShopOrder;

  return (
    <div className="space-y-2">
      {/* Order Details */}
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
  );
};
