/**
 * Recommended Section Component
 *
 * Horizontal scrolling carousel displaying recommended items with:
 * - Manual horizontal scrolling
 * - Recommended item cards
 * - "Recommended for You" title with blue accent
 * - Data fetched from database (products, amenities, menu_items)
 * - Modal for item details
 */

import { useState, useRef, useEffect } from "react";
import { RecommendedItemCard } from "./RecommendedItemCard";
import { RecommendedItemModal } from "./RecommendedItemModal";
import {
  useRecommendedItems,
  type RecommendedItem,
} from "../../../../../../hooks/queries";

interface RecommendedSectionProps {
  hotelId: string;
}

export const RecommendedSection = ({ hotelId }: RecommendedSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [selectedItem, setSelectedItem] = useState<RecommendedItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch recommended items from database
  const { data: items = [], isLoading } = useRecommendedItems(hotelId);

  const handleItemClick = (item: RecommendedItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Small delay before clearing selected item for smooth animation
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0) return;
    let animationFrameId: number;
    const SCROLL_SPEED = 0.5; // pixels per frame
    function animate() {
      if (container && container.scrollWidth > container.clientWidth) {
        container.scrollLeft += SCROLL_SPEED;
        // Loop back to start
        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth
        ) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [items.length]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="px-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recommended <span className="text-blue-600">for You</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Loading recommendations...
          </p>
        </div>
        <div className="flex gap-4 overflow-x-hidden px-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] bg-gray-200 rounded-lg animate-pulse"
              style={{ height: "240px" }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Hide section if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-6">
        {/* Section Header */}
        <div className="px-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recommended <span className="text-blue-600">for You</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Curated selections from our hotel services
          </p>
        </div>

        {/* Scrolling Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
        >
          {items.map((item) => (
            <RecommendedItemCard
              key={item.id}
              id={item.id}
              type={item.type}
              title={item.title}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
              category={item.category}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal for item details */}
      <RecommendedItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
