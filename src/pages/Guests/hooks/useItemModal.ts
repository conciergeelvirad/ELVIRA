/**
 * useItemModal Hook
 *
 * Manages modal state for item details
 * Handles opening/closing and selected item state
 */

import { useState } from "react";
import type { RecommendedItem } from "../../../hooks/queries";

export const useItemModal = () => {
  const [selectedItem, setSelectedItem] = useState<RecommendedItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: RecommendedItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return {
    selectedItem,
    isModalOpen,
    openModal,
    closeModal,
  };
};
