import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Database } from "../../../../../types/supabase";
import { FormField } from "../../../../../components/common/form";
import { FormModal } from "../../../../../components/common/ui";
import { Button } from "../../../../../components/common/ui";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_unlimited_stock: boolean;
  mini_bar: boolean;
  hotel_recommended: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product;
  title: string;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: ProductFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      category: initialData?.category ?? "",
      image_url: initialData?.image_url ?? "",
      stock_quantity: initialData?.stock_quantity ?? 0,
      is_unlimited_stock: initialData?.is_unlimited_stock ?? false,
      mini_bar: initialData?.mini_bar ?? false,
      hotel_recommended: initialData?.hotel_recommended ?? false,
    },
  });

  const handleInputChange = (
    value: string | number | boolean,
    name: string
  ) => {
    form.setValue(name as keyof ProductFormData, value);
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      onClose();
    } catch {
      // Error handling is managed by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitText={initialData ? "Update Product" : "Create Product"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <FormField
          name="name"
          label="Product Name"
          type="text"
          value={form.watch("name")}
          onChange={handleInputChange}
          required
          error={form.formState.errors.name?.message}
          placeholder="Enter product name"
        />

        <FormField
          name="description"
          label="Description"
          type="textarea"
          value={form.watch("description")}
          onChange={handleInputChange}
          placeholder="Enter product description"
        />

        <FormField
          name="price"
          label="Price"
          type="number"
          value={form.watch("price")}
          onChange={handleInputChange}
          required
          error={form.formState.errors.price?.message}
          placeholder="Enter price"
          step={0.01}
          min={0}
        />

        <FormField
          name="category"
          label="Category"
          type="text"
          value={form.watch("category")}
          onChange={handleInputChange}
          required
          error={form.formState.errors.category?.message}
          placeholder="Enter product category"
        />

        <FormField
          name="image_url"
          label="Image URL"
          type="url"
          value={form.watch("image_url")}
          onChange={handleInputChange}
          placeholder="Enter image URL"
        />

        <FormField
          name="is_unlimited_stock"
          label="Unlimited Stock"
          type="checkbox"
          value={form.watch("is_unlimited_stock")}
          onChange={handleInputChange}
        />

        {!form.watch("is_unlimited_stock") && (
          <FormField
            name="stock_quantity"
            label="Stock Quantity"
            type="number"
            value={form.watch("stock_quantity")}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            min={0}
          />
        )}

        <FormField
          name="mini_bar"
          label="Mini Bar Item"
          type="checkbox"
          value={form.watch("mini_bar")}
          onChange={handleInputChange}
        />

        <FormField
          name="hotel_recommended"
          label="Hotel Recommended"
          type="checkbox"
          value={form.watch("hotel_recommended")}
          onChange={handleInputChange}
        />
      </div>
    </FormModal>
  );
};
