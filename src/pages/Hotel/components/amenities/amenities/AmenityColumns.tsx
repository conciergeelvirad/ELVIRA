import { Sparkles } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import {
  UnifiedToggle,
  ActionButtonGroup,
} from "../../../../../components/common";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";
import { CRUDModalActions, CRUDFormActions } from "../../../../../hooks";

type EnhancedAmenity = Amenity & Record<string, unknown>;

// Helper function to convert Amenity to EnhancedAmenity
export const enhanceAmenity = (amenity: Amenity): EnhancedAmenity => {
  return amenity as unknown as EnhancedAmenity;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedAmenity>;
  formActions: CRUDFormActions;
}

export const getTableColumns = ({
  handleStatusToggle,
  modalActions,
  formActions,
}: GetColumnsOptions): Column<Amenity>[] => {
  return [
    {
      key: "name",
      header: "AMENITY NAME",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "price",
      header: "PRICE",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${typeof value === "number" ? value.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "hotel_recommended",
      header: "RECOMMENDED",
      sortable: true,
      render: (value) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            value ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {value ? "YES" : "NO"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "ACTIVE",
      sortable: true,
      render: (value, amenity) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === true}
            onChange={(checked) => handleStatusToggle(amenity.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (_, amenity) => (
        <ActionButtonGroup
          actions={[
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                formActions.setFormData({
                  name: amenity.name,
                  description: amenity.description,
                  category: amenity.category,
                  price: amenity.price,
                  hotel_recommended: amenity.hotel_recommended,
                  is_active: amenity.is_active,
                  image_url: amenity.image_url,
                });
                modalActions.openEditModal(enhanceAmenity(amenity));
              },
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                modalActions.openDeleteModal(enhanceAmenity(amenity));
              },
              variant: "danger",
            },
          ]}
          size="sm"
          compact
        />
      ),
    },
  ];
};

export const getGridColumns = ({
  handleStatusToggle,
}: Pick<GetColumnsOptions, "handleStatusToggle">): GridColumn[] => {
  return [
    {
      key: "name",
      label: "Amenity Name",
      accessor: "name",
    },
    {
      key: "category",
      label: "Category",
      accessor: "category",
    },
    {
      key: "price",
      label: "Price",
      accessor: "price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "hotel_recommended",
      label: "Recommended",
      accessor: "hotel_recommended",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Active",
      accessor: "is_active",
      render: (value: boolean, item: Amenity) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === true}
            onChange={(checked) => handleStatusToggle(item.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
  ];
};

// Detail fields for the modal
export const getDetailFields = (amenity: Amenity) => [
  { label: "Amenity Name", value: amenity.name },
  { label: "Description", value: amenity.description || "N/A" },
  { label: "Category", value: amenity.category },
  { label: "Price", value: `$${amenity.price.toFixed(2)}` },
  {
    label: "Hotel Recommended",
    value: amenity.hotel_recommended ? "Yes" : "No",
  },
  { label: "Active", value: amenity.is_active ? "Yes" : "No" },
  {
    label: "Created",
    value: amenity.created_at
      ? new Date(amenity.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  },
];

// Export functions with common naming pattern
export const getAmenityTableColumns = getTableColumns;
export const getAmenityGridColumns = getGridColumns;
export const getAmenityDetailFields = getDetailFields;
