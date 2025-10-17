import { cn } from "../../../utils";
import { useEditableInput } from "../../../hooks";
import { EditActionButtons } from "../ui/EditActionButtons";
import {
  INPUT_BASE,
  INPUT_PADDING_SM,
  TABLE_CELL_PADDING,
} from "../../../constants/styles";

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
  type?: "text" | "number" | "email" | "date" | "select";
  options?: { label: string; value: any }[];
  className?: string;
  placeholder?: string;
}

export const EditableCell = ({
  value,
  isEditing,
  onSave,
  onCancel,
  type = "text",
  options = [],
  className,
  placeholder = "",
}: EditableCellProps) => {
  const { editValue, setEditValue, inputRef, handleSave, handleKeyDown } =
    useEditableInput<HTMLInputElement | HTMLSelectElement>({
      value,
      isEditing,
      onSave,
      onCancel,
      allowEnterToSave: true,
    });

  if (!isEditing) {
    return (
      <div
        className={cn(TABLE_CELL_PADDING, "text-sm text-gray-900", className)}
      >
        {type === "select"
          ? options.find((opt) => opt.value === value)?.label || value
          : value || "-"}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 px-2 py-2", className)}>
      {type === "select" ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(INPUT_BASE, INPUT_PADDING_SM)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(INPUT_BASE, INPUT_PADDING_SM)}
        />
      )}

      <EditActionButtons onSave={handleSave} onCancel={onCancel} />
    </div>
  );
};
