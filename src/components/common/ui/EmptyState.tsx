import { LucideIcon } from 'lucide-react';
import { cn } from "../../../utils";

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ message, icon: Icon, action, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {Icon && (
        <div className="mb-4 text-gray-400">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <p className="text-gray-500 text-center mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
