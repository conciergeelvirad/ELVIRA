/**
 * Modal Action Buttons Component
 *
 * Displays action buttons based on item type (Add to Cart, Book Now, Order Now, Close)
 */

interface ModalActionButtonsProps {
  itemType: "product" | "amenity" | "menu_item";
  hideActionButtons?: boolean;
  onClose: () => void;
}

export const ModalActionButtons = ({
  itemType,
  hideActionButtons = false,
  onClose,
}: ModalActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {!hideActionButtons && (
        <>
          {itemType === "product" && (
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors touch-manipulation text-sm">
              Add to Cart
            </button>
          )}
          {itemType === "amenity" && (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors touch-manipulation text-sm">
              Book Now
            </button>
          )}
          {itemType === "menu_item" && (
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors touch-manipulation text-sm">
              Order Now
            </button>
          )}
        </>
      )}
      <button
        onClick={onClose}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors touch-manipulation text-sm"
      >
        Close
      </button>
    </div>
  );
};
