import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../components/common/form";
import { FormModal } from "../../components/common/ui";
import type { RestaurantFormData, RestaurantFormProps } from "./types";
import { cuisineTypes, foodTypes } from "./types";

export const RestaurantFormModal: FC<RestaurantFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Add Restaurant",
  isLoading: parentLoading = false,
}) => {
  const [isLoading, setIsLoading] = useState(parentLoading);
  const form = useForm<RestaurantFormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      cuisine:
        (initialData?.cuisine as (typeof cuisineTypes)[number]) ?? "Other",
      description: initialData?.description ?? "",
      food_types: initialData?.food_types ?? [],
      is_active: initialData?.is_active ?? true,
    },
  });

  const handleInputChange = (
    value: string | number | boolean,
    name: string
  ) => {
    if (name === "food_types") {
      const currentTypes = form.watch("food_types");
      if (typeof value === "string") {
        if (currentTypes.includes(value)) {
          form.setValue(
            "food_types",
            currentTypes.filter((t) => t !== value)
          );
        } else {
          form.setValue("food_types", [...currentTypes, value]);
        }
      }
    } else {
      form.setValue(name as keyof RestaurantFormData, value);
    }
  };

  const handleSubmit = async (data: RestaurantFormData) => {
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

  const selectedFoodTypes = form.watch("food_types");

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitText={initialData ? "Update Restaurant" : "Create Restaurant"}
      cancelText="Cancel"
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-4">
        <FormField
          name="name"
          label="Restaurant Name"
          type="text"
          value={form.watch("name")}
          onChange={handleInputChange}
          required
          error={form.formState.errors.name?.message}
          placeholder="Enter restaurant name"
        />

        <FormField
          name="cuisine"
          label="Cuisine Type"
          type="select"
          value={form.watch("cuisine")}
          onChange={handleInputChange}
          required
          error={form.formState.errors.cuisine?.message}
          options={cuisineTypes.map((type) => ({ value: type, label: type }))}
        />

        <FormField
          name="description"
          label="Description"
          type="textarea"
          value={form.watch("description")}
          onChange={handleInputChange}
          placeholder="Enter restaurant description"
          rows={4}
        />

        <FormField
          name="is_active"
          label="Active Status"
          type="checkbox"
          value={form.watch("is_active")}
          onChange={handleInputChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Types
          </label>
          <div className="flex flex-wrap gap-2">
            {foodTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange(type, "food_types")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFoodTypes.includes(type)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
};
