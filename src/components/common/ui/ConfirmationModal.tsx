import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmationModalProps) => {
  const icons = {
    danger: <XCircle className="w-12 h-12 text-red-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />,
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
  };

  const buttonVariants = {
    danger: 'primary' as const,
    warning: 'primary' as const,
    info: 'primary' as const,
    success: 'primary' as const,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBody>
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          {icons[variant]}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={buttonVariants[variant]}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
