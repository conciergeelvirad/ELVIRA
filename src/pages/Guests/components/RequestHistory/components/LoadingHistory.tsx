/**
 * Loading History State
 *
 * Displayed while fetching order history
 */

import { Loader2 } from "lucide-react";

export const LoadingHistory = () => {
  return (
    <div className="text-center py-16 px-4">
      <Loader2 className="w-10 h-10 mx-auto mb-4 text-purple-600 animate-spin" />
      <p className="text-sm text-gray-600">Loading your request history...</p>
    </div>
  );
};
