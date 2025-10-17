/**
 * Empty History State
 *
 * Displayed when guest has no order history
 */

import { Clock } from "lucide-react";

export const EmptyHistory = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Clock className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Request History
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Your order and request history will appear here once you place your
        first order
      </p>
    </div>
  );
};
