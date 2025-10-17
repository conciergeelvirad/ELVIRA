/**
 * Mixed Service Warning
 *
 * Warning banner shown when cart has both restaurant and room service items
 * Blocks checkout until only one service type remains
 */

import { AlertTriangle } from "lucide-react";

export const MixedServiceWarning = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-red-900">Mixed Order Types</p>
        <p className="text-xs text-red-600">
          Cannot mix Restaurant and Room Service items. Please remove items to
          have only one type.
        </p>
      </div>
    </div>
  );
};
