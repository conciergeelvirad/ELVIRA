import { type Product } from "../../hooks/queries/hotel-management/products";
import { GenericCard, CardActionFooter } from "../common/data-display";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard = ({
  product,
  onClick,
  onEdit,
  onDelete,
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
      title={product.name}
      badge={statusBadge}
      price={{
        value: product.price,
        currency: "€",
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
