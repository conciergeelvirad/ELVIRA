import React from "react";
import { Edit2, Trash2, Eye, MoreHorizontal, Settings } from "lucide-react";
import { cn } from "../../../utils";

export interface ActionButton {
  type: "edit" | "delete" | "view" | "settings" | "custom";
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  variant?: "default" | "danger" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

interface ActionButtonGroupProps {
  actions: ActionButton[];
  layout?: "horizontal" | "vertical" | "dropdown";
  size?: "sm" | "md" | "lg";
  className?: string;
  dropdownTrigger?: React.ReactNode;
  showLabels?: boolean;
  compact?: boolean;
}

const defaultIcons = {
  edit: Edit2,
  delete: Trash2,
  view: Eye,
  settings: Settings,
  custom: MoreHorizontal,
};

const variantStyles = {
  default: "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
  danger: "text-red-600 hover:text-red-800 hover:bg-red-50",
  primary: "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
  secondary: "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
};

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  layout = "horizontal",
  size = "md",
  className,
  dropdownTrigger,
  showLabels = false,
  compact = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) {
    return null;
  }

  const handleActionClick = (action: ActionButton, e: React.MouseEvent) => {
    e.stopPropagation();
    action.onClick(e);
    if (layout === "dropdown") {
      setIsDropdownOpen(false);
    }
  };

  const renderAction = (action: ActionButton, index: number) => {
    const IconComponent = action.icon
      ? () => action.icon as React.ReactElement
      : defaultIcons[action.type];

    const variant =
      action.variant || (action.type === "delete" ? "danger" : "default");
    const actionSize = action.size || size;

    if (showLabels && action.label) {
      return (
        <button
          key={index}
          onClick={(e) => handleActionClick(action, e)}
          disabled={action.disabled}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
            variantStyles[variant],
            action.disabled ? "opacity-50 cursor-not-allowed" : "",
            actionSize === "sm" ? "px-2 py-1 text-xs" : "",
            actionSize === "lg" ? "px-4 py-2" : ""
          )}
          title={action.label}
        >
          <IconComponent
            size={actionSize === "sm" ? 14 : actionSize === "lg" ? 20 : 16}
          />
          {action.label}
        </button>
      );
    }

    return (
      <button
        key={index}
        onClick={(e: React.MouseEvent) => handleActionClick(action, e)}
        disabled={action.disabled}
        className={cn(
          "p-2 rounded-lg transition-colors",
          variantStyles[variant],
          compact ? "p-1" : "",
          action.disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        title={action.label}
      >
        <IconComponent
          size={actionSize === "sm" ? 14 : actionSize === "lg" ? 20 : 16}
        />
      </button>
    );
  };

  if (layout === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            variantStyles.default
          )}
        >
          {dropdownTrigger || <MoreHorizontal size={16} />}
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {visibleActions.map((action, index) => {
                const IconComponent = action.icon
                  ? () => action.icon as React.ReactElement
                  : defaultIcons[action.type];
                const variant =
                  action.variant ||
                  (action.type === "delete" ? "danger" : "default");

                return (
                  <button
                    key={index}
                    onClick={(e) => handleActionClick(action, e)}
                    disabled={action.disabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors",
                      variantStyles[variant],
                      "hover:bg-gray-50",
                      action.disabled ? "opacity-50 cursor-not-allowed" : ""
                    )}
                  >
                    <IconComponent size={16} />
                    {action.label ||
                      action.type.charAt(0).toUpperCase() +
                        action.type.slice(1)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  const containerClass = cn(
    "flex items-center",
    layout === "horizontal" && compact ? "gap-1" : "",
    layout === "horizontal" && !compact ? "gap-2" : "",
    layout === "vertical" ? "flex-col gap-1" : "",
    className
  );

  return (
    <div className={containerClass}>{visibleActions.map(renderAction)}</div>
  );
};
