import { LucideIcon } from "lucide-react";
import { cn } from "../../../utils";
import {
  PAGINATION_BUTTON_BASE,
  BUTTON_SECONDARY,
  BUTTON_DISABLED,
} from "../../../constants/styles";

interface PaginationButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
  label: string;
}

export const PaginationButton = ({
  icon: Icon,
  onClick,
  disabled,
  label,
}: PaginationButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        PAGINATION_BUTTON_BASE,
        disabled ? BUTTON_DISABLED : BUTTON_SECONDARY
      )}
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  );
};
