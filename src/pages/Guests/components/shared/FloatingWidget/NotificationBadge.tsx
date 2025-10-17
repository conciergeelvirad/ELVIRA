/**
 * Notification Badge Component
 *
 * Displays a numeric badge showing unread count
 * Features:
 * - Pulse animation to draw attention
 * - Auto-hides when count is 0
 * - Max display of 99+ for large numbers
 */

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge = ({
  count,
  className = "",
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <div
      className={`absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-badge-pulse ${className}`}
      aria-label={`${count} unread messages`}
    >
      {displayCount}
    </div>
  );
};
