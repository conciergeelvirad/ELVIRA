import { useState, useCallback } from "react";
import { ConfirmationModal } from "../../components/common/ui";

interface UseConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions>({});
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback((dialogOptions: UseConfirmDialogOptions = {}) => {
    setOptions(dialogOptions);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(false);
      setResolveRef(null);
    }
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(true);
      setResolveRef(null);
    }
  }, [resolveRef]);

  return {
    isOpen,
    confirm,
    close: handleClose,
    dialog: {
      isOpen,
      onClose: handleClose,
      onConfirm: handleConfirm,
      title: options.title || "Confirm",
      message: options.message || "Are you sure?",
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant || "warning",
    },
  };
};
