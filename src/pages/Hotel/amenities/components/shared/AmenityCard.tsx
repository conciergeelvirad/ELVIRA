import { type Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import {
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Sparkles, Star } from "lucide-react";

interface AmenityCardProps {
  amenity: Amenity;
  onEdit?: (amenity: Amenity) => void;
  onDelete?: (amenity: Amenity) => void;
  onClick?: () => void;
  onRecommendedToggle?: (id: string, newValue: boolean) => Promise<void>;
  currency?: string;
}

export const AmenityCard = ({
  amenity,
  onEdit,
  onDelete,
  onClick,
  onRecommendedToggle,
  currency = "$",
}: AmenityCardProps) => {
  // Build sections for description and category
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  if (amenity.description) {
    sections.push({
      content: <p className="text-sm text-gray-600">{amenity.description}</p>,
    });
  }

  sections.push({
    content: (
      <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded">
        {amenity.category}
      </span>
    ),
  });

  // Status badge - displayed over the image
  const statusBadge = {
    label: amenity.is_active ? "Active" : "Inactive",
    variant: "soft" as const,
    className: amenity.is_active
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600",
  };

  // Additional badges (Recommended)
  const additionalBadges = [];

  if (amenity.hotel_recommended) {
    additionalBadges.push({
      label: "Recommended",
      variant: "soft" as const,
      className: "bg-blue-100 text-blue-700",
    });
  }

  return (
    <GenericCard
      image={amenity.image_url || undefined}
      imageFallback={<Sparkles className="w-16 h-16 text-purple-400" />}
      imageHeight="h-48"
      title={
        <div className="flex items-center gap-1">
          {onRecommendedToggle && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                console.log("⭐ RECOMMENDED STAR CLICKED (Amenity):", {
                  amenityId: amenity.id,
                  amenityName: amenity.name,
                  currentValue: amenity.recommended,
                  newValue: !amenity.recommended,
                });
                try {
                  await onRecommendedToggle(amenity.id, !amenity.recommended);
                } catch (error) {
                  console.error("❌ Recommended toggle failed:", error);
                }
              }}
              className="hover:scale-110 transition-transform"
              title={
                amenity.recommended
                  ? "Remove from recommended"
                  : "Mark as recommended"
              }
            >
              <Star
                className={`w-4 h-4 flex-shrink-0 ${
                  amenity.recommended
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          )}
          {!onRecommendedToggle && amenity.recommended && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
          <span className="line-clamp-1">{amenity.name}</span>
        </div>
      }
      badge={statusBadge}
      price={{
        value: amenity.price,
        currency: currency,
        className: "text-xl font-bold text-green-600",
      }}
      sections={sections}
      additionalBadges={additionalBadges}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(amenity) : undefined}
          onDelete={onDelete ? () => onDelete(amenity) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};
