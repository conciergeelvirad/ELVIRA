/**
 * Restaurant Entity Configuration
 *
 * Defines restaurant-specific behavior for the shared EntityTab component.
 * Note: Restaurants use a custom detail view (not ItemDetailView pattern)
 * so we keep the original RestaurantDetail component.
 */

import { RestaurantDetail, RESTAURANT_FORM_FIELDS } from "../index";
import type { Restaurant } from "../../../../../hooks/queries/hotel-management/restaurants";
import {
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { UtensilsCrossed, MapPin } from "lucide-react";

/**
 * Restaurant Entity Configuration
 */
export const restaurantEntityConfig = {
  // Entity metadata
  entityName: "Restaurant",
  searchPlaceholder: "Search restaurants...",
  addButtonLabel: "Add Restaurant",
  emptyMessage: "No restaurants found",

  // Form fields
  formFields: RESTAURANT_FORM_FIELDS,

  // Detail rendering - uses custom RestaurantDetail component
  /**
   * Render function for detail modal
   * Restaurant uses custom RestaurantDetail instead of EntityDetail
   */
  renderDetail: (item: Restaurant) => <RestaurantDetail restaurant={item} />,

  // Card rendering function for grid view
  renderCard: (
    restaurant: Restaurant,
    onClick: () => void,
    handlers: {
      onEdit: () => void;
      onDelete: () => void;
    }
  ) => {
    const status = restaurant.is_active ? "Active" : "Inactive";

    // Build sections array
    const sections = [];

    if (restaurant.description) {
      sections.push({
        icon: <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />,
        content: <span className="line-clamp-2">{restaurant.description}</span>,
        className: "items-start",
      });
    }

    if (restaurant.cuisine) {
      sections.push({
        icon: <UtensilsCrossed className="w-4 h-4" />,
        content: restaurant.cuisine,
      });
    }

    return (
      <GenericCard
        icon={<UtensilsCrossed className="w-6 h-6 text-orange-600" />}
        iconBgColor="bg-orange-100"
        title={restaurant.name}
        subtitle={restaurant.cuisine || "N/A"}
        badge={{
          label: status,
          variant: "soft",
        }}
        sections={sections}
        footer={
          <CardActionFooter
            onEdit={handlers.onEdit}
            onDelete={handlers.onDelete}
          />
        }
        onClick={onClick}
      />
    );
  },
};
