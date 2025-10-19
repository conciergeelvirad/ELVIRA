import { Sparkles } from "lucide-react";
import { Column, GridColumn } from "../../../../../types/table";
import { ItemWithImage, StatusBadge } from "../../../../../components/common";
import { Amenity } from "../../../../../hooks/queries/hotel-management/amenities";

type EnhancedAmenity = Amenity & Record<string, unknown>;

// Helper function to convert Amenity to EnhancedAmenity
export const enhanceAmenity = (amenity: Amenity): EnhancedAmenity => {
  return amenity as unknown as EnhancedAmenity;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  currency?: string;
}

export const getTableColumns = ({
  handleStatusToggle,
  currency = "$",
}: GetColumnsOptions): Column<Amenity>[] => {
  return [
    {
      key: "amenity",
      header: "AMENITY",
      sortable: true,
      render: (_value, amenity) => (
        <ItemWithImage
          imageUrl={amenity.image_url}
          title={amenity.name}
          description={amenity.description}
          fallbackIcon={<Sparkles className="w-5 h-5" />}
          isRecommended={amenity.recommended}
        />
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
          {currency}
          {typeof value === "number" ? value.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "STATUS",
      sortable: true,
      render: (value, amenity) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            console.log("🖱️ AMENITY STATUS BADGE CLICKED:", {
              amenityId: amenity.id,
              currentStatus: value,
              newStatus: !value,
              amenity: amenity.name,
            });
            handleStatusToggle(amenity.id, !value);
          }}
          className="cursor-pointer"
        >
          <StatusBadge status={value ? "active" : "inactive"} size="sm" />
        </div>
      ),
    },
  ];
};

export const getGridColumns = ({
  handleStatusToggle,
  currency = "$",
}: GetColumnsOptions): GridColumn[] => {
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
      render: (value: number) => `${currency}${value.toFixed(2)}`,
    },
    {
      key: "hotel_recommended",
      label: "Recommended",
      accessor: "hotel_recommended",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Status",
      accessor: "is_active",
      render: (value: boolean, item: Amenity) => (
        <div
          onClick={async (e) => {
            e.stopPropagation();
            console.log("🖱️ STATUS BADGE CLICKED (Amenity Grid):", {
              amenityId: item.id,
              amenityName: item.name,
              currentValue: value,
              newValue: !value,
            });
            try {
              await handleStatusToggle(item.id, !value);
            } catch (error) {
              console.error("❌ Status toggle failed:", error);
            }
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={value ? "active" : "inactive"} size="sm" />
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
  {
    label: "Status",
    value: (
      <StatusBadge
        status={amenity.is_active ? "active" : "inactive"}
        size="sm"
      />
    ),
  },
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
