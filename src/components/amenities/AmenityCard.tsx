import { type Amenity } from "../../hooks/queries/hotel-management/amenities";
import { GenericCard, CardActionFooter } from "../common/data-display";
import { Sparkles } from "lucide-react";

interface AmenityCardProps {
  amenity: Amenity;
  onEdit?: (amenity: Amenity) => void;
  onDelete?: (amenity: Amenity) => void;
  onClick?: () => void;
}

export const AmenityCard = ({
  amenity,
  onEdit,
  onDelete,
  onClick,
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
      title={amenity.name}
      badge={statusBadge}
      price={{
        value: amenity.price,
        currency: "$",
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
