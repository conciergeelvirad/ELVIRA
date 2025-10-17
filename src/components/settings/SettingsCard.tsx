import { LucideIcon } from "lucide-react";
import { SettingsToggle } from "./SettingsToggle";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const SettingsCard = ({
  icon: Icon,
  title,
  description,
  checked = false,
  onChange,
  actionLabel,
  onAction,
}: SettingsCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
            {actionLabel && onAction && checked && (
              <button
                onClick={onAction}
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <SettingsToggle checked={checked} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};
