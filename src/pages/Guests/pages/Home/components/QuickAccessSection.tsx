/**
 * Quick Access Section Component
 *
 * Displays a 2-column grid of quick access cards for common hotel services
 */

import { QuickAccessCard } from "./QuickAccessCard";

interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  onClick?: () => void;
}

interface QuickAccessSectionProps {
  items?: QuickAccessItem[];
}

const defaultItems: QuickAccessItem[] = [
  {
    id: "amenities",
    title: "Amenities",
    description: "Hotel facilities and services",
  },
  {
    id: "dine-in",
    title: "Dine In",
    description: "Room service and restaurant",
  },
  {
    id: "hotel-shop",
    title: "Hotel Shop",
    description: "Purchase hotel merchandise",
  },
  {
    id: "qna",
    title: "Q&A",
    description: "Frequently asked questions",
  },
];

export const QuickAccessSection = ({
  items = defaultItems,
}: QuickAccessSectionProps) => {
  return (
    <div className="px-4 mt-4">
      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <QuickAccessCard
            key={item.id}
            title={item.title}
            description={item.description}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
};
