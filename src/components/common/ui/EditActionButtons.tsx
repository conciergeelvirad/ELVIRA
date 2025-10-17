import { Check, X } from "lucide-react";
import { cn } from "../../../utils";
import {
  BUTTON_ICON_BASE,
  BUTTON_ICON_SAVE,
  BUTTON_ICON_CANCEL,
} from "../../../constants/styles";

interface EditActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  size?: "sm" | "md";
  className?: string;
}

export const EditActionButtons = ({
  onSave,
  onCancel,
  size = "sm",
  className,
}: EditActionButtonsProps) => {
  const iconSize = size === "sm" ? 16 : 18;
  const buttonClass = size === "md" ? "p-1.5 rounded-lg" : BUTTON_ICON_BASE;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={onSave}
        className={cn(buttonClass, BUTTON_ICON_SAVE)}
        aria-label="Save"
      >
        <Check size={iconSize} />
      </button>
      <button
        onClick={onCancel}
        className={cn(buttonClass, BUTTON_ICON_CANCEL)}
        aria-label="Cancel"
      >
        <X size={iconSize} />
      </button>
    </div>
  );
};
