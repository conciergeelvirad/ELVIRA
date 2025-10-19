/**
 * Generic Duration Section Component
 *
 * Displays duration with Clock icon (for tours, events, etc.)
 */

import { Clock } from "lucide-react";
import { formatDuration } from "../thirdPartyHelpers";

export const createDurationSection = (duration: string) => ({
  icon: <Clock className="w-4 h-4 text-blue-500" />,
  content: (
    <span className="text-sm font-medium">{formatDuration(duration)}</span>
  ),
});
