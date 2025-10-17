import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';

interface UseEditableInputOptions {
  value: any;
  isEditing: boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
  allowEnterToSave?: boolean;
}

export const useEditableInput = <T extends HTMLElement>({
  value,
  isEditing,
  onSave,
  onCancel,
  allowEnterToSave = true,
}: UseEditableInputOptions) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<T>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (
        inputRef.current instanceof HTMLInputElement ||
        inputRef.current instanceof HTMLTextAreaElement
      ) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    onSave(editValue);
  }, [editValue, onSave]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && allowEnterToSave) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [allowEnterToSave, handleSave, onCancel]
  );

  return {
    editValue,
    setEditValue,
    inputRef,
    handleSave,
    handleKeyDown,
  };
};
