import { type Product } from "../../../../../hooks/queries/hotel-management/products";
import {
  GenericCard,
  CardActionFooter,
} from "../../../../../components/common/data-display";
import { Package, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onRecommendedToggle?: (id: string, newValue: boolean) => Promise<void>;
  currency?: string;
}

export const ProductCard = ({
  product,
  onClick,
  onEdit,
  onDelete,
  onRecommendedToggle,
  currency = "$",
}: ProductCardProps) => {
  // Build sections
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [];

  if (product.description) {
    sections.push({
      content: (
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
      ),
    });
  }

  sections.push({
    content: (
      <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded">
        {product.category}
      </span>
    ),
  });

  if (!product.is_unlimited_stock) {
    sections.push({
      content: (
        <span className="text-sm text-gray-600">
          Stock: {product.stock_quantity}
        </span>
      ),
    });
  }

  // Build badge for status (shows over image)
  const statusBadge = {
    label: product.is_active ? "Active" : "Inactive",
    variant: "soft" as const,
    className: product.is_active
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600",
  };

  return (
    <GenericCard
      image={product.image_url || undefined}
      imageFallback={<Package className="w-16 h-16 text-gray-400" />}
      title={
        <div className="flex items-center gap-1">
          {onRecommendedToggle && (
            <button
              onClick={async (e) => {
                e.stopPropagation();
                console.log("⭐ RECOMMENDED STAR CLICKED (Product):", {
                  productId: product.id,
                  productName: product.name,
                  currentValue: product.recommended,
                  newValue: !product.recommended,
                });
                try {
                  await onRecommendedToggle(product.id, !product.recommended);
                } catch (error) {
                  console.error("❌ Recommended toggle failed:", error);
                }
              }}
              className="hover:scale-110 transition-transform"
              title={
                product.recommended
                  ? "Remove from recommended"
                  : "Mark as recommended"
              }
            >
              <Star
                className={`w-4 h-4 flex-shrink-0 ${
                  product.recommended
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          )}
          {!onRecommendedToggle && product.recommended && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          )}
          <span className="line-clamp-1">{product.name}</span>
        </div>
      }
      badge={statusBadge}
      price={{
        value: product.price,
        currency: currency,
        className: "text-xl font-bold text-blue-600",
      }}
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(product) : undefined}
          onDelete={onDelete ? () => onDelete(product.id) : undefined}
        />
      }
      onClick={onClick}
      disableHover={false}
    />
  );
};
