/**
 * Dine-In Menu Section Component
 *
 * Displays menu items using the ExperienceCard in an Uber Eats style
 * Shows available menu items from the hotel's restaurants
 */

import { useMemo } from "react";
import { ExperienceCard } from "../../../components/ExperienceCard";
import {
  useRestaurantMenuItems,
  filterAvailableMenuItems,
  groupMenuItemsByCategory,
  type MenuItem,
} from "../../../../../hooks/queries/hotel-management/restaurants";

interface DineInMenuSectionProps {
  hotelId: string;
}

export const DineInMenuSection = ({ hotelId }: DineInMenuSectionProps) => {
  // Fetch all menu items for the hotel
  const { data: menuItems = [], isLoading } = useRestaurantMenuItems(hotelId);

  // Filter only available items and group by category
  const categorizedMenu = useMemo(() => {
    const available = filterAvailableMenuItems(menuItems);
    return groupMenuItemsByCategory(available);
  }, [menuItems]);

  const handleCardClick = (item: MenuItem) => {
    // TODO: Open modal or navigate to item details
  };

  if (isLoading) {
    return (
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-[320px] bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-600">No menu items available</p>
        </div>
      </div>
    );
  }

  return (
    <div id="dine-in-section" className="px-6 mb-8 scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dine In Menu</h2>
        <p className="text-gray-600">
          Order delicious meals from our hotel restaurants
        </p>
      </div>

      {/* Render menu items grouped by category */}
      {Object.entries(categorizedMenu).map(([category, items]) => (
        <div key={category} className="mb-8">
          {/* Category Header */}
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">{category}</h3>
            <span className="ml-2 text-sm text-gray-500">
              ({items.length} items)
            </span>
          </div>

          {/* Horizontal Scrolling Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {items.map((item) => (
              <div key={item.id} className="min-w-[280px] flex-shrink-0">
                <ExperienceCard
                  id={item.id}
                  title={item.name}
                  description={item.description || undefined}
                  imageUrl={item.image_url || undefined}
                  category={category}
                  price={`$${item.price.toFixed(2)}`}
                  tags={[
                    ...(item.service_type || []),
                    ...(item.special_type || []),
                  ]}
                  onClick={() => handleCardClick(item)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
