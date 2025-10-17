import { TableView } from "../../components/common/data-display/TableView";
import { EmptyState } from "../../components/common/data-display/EmptyState";
import { useRestaurantMenuItems } from "../../hooks/queries/hotel-management/restaurants";

interface RestaurantMenuTableProps {
  restaurantId?: string;
}

export const RestaurantMenuTable = ({
  restaurantId,
}: RestaurantMenuTableProps) => {
  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useRestaurantMenuItems(restaurantId || "");

  const columns = [
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "description",
      header: "Description",
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "service_type",
      header: "Service Type",
      render: (value: string[] | null) => value?.join(", ") || "-",
    },
    {
      key: "special_type",
      header: "Special Type",
      render: (value: string[] | null) => value?.join(", ") || "-",
    },
    {
      key: "is_available",
      header: "Available",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
  ];

  const rows = menuItems.map((item) => ({
    id: item.id,
    data: item,
  }));

  return <TableView columns={columns} rows={rows} />;
};
