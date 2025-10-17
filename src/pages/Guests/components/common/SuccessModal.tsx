/**
 * Success Modal Component
 *
 * Reusable confirmation modal with checkmark animation
 * Used for successful cart checkouts across Shop, DineIn, and Services
 *
 * Features:
 * - Green checkmark icon
 * - Custom title and message
 * - Centered overlay with backdrop
 * - Scale-in animation
 */

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
}

export const SuccessModal = ({ isOpen, title, message }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-scale-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
