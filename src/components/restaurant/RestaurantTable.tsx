import { useState } from "react";
import { Trash2, Edit, X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TableView } from "../../components/common/data-display/TableView";
import { Button } from "../../components/common/ui/Button";
import { useConfirmDialog } from "../../hooks/ui/useConfirmDialog";
import { useToast } from "../../hooks/ui/useToast";
import {
  type Restaurant,
  useRestaurants,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../hooks/queries/hotel-management/restaurants";

interface RestaurantTableProps {
  onEdit?: (restaurant: Restaurant) => void;
}

export const RestaurantTable = ({ onEdit }: RestaurantTableProps) => {
  const HOTEL_ID = "086e11e4-4775-4327-8448-3fa0ee7be0a5"; // TODO: Get from context
  const { data: restaurants = [], isLoading } = useRestaurants(HOTEL_ID);
  const { mutate: deleteRestaurant } = useDeleteRestaurant();
  const { mutate: updateStatus } = useUpdateRestaurant();
  const { toast } = useToast();
  const { confirm } = useConfirmDialog();

  const handleStatusUpdate = async (restaurant: Restaurant) => {
    const newStatus = !restaurant.is_active;
    const confirmed = await confirm({
      title: `Confirm Status Update`,
      message: `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } this restaurant?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      updateStatus(
        {
          id: restaurant.id,
          data: { is_active: newStatus },
          hotelId: HOTEL_ID,
        },
        {
          onSuccess: () => {
            toast({
              message: "Restaurant status updated successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  const handleDelete = async (restaurant: Restaurant) => {
    const confirmed = await confirm({
      title: "Delete Restaurant",
      message: "Are you sure you want to delete this restaurant?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      deleteRestaurant(
        { id: restaurant.id, hotelId: HOTEL_ID },
        {
          onSuccess: () => {
            toast({
              message: "Restaurant deleted successfully",
              type: "success",
            });
          },
        }
      );
    }
  };

  return (
    <TableView<Restaurant>
      columns={[
        {
          key: "name",
          header: "Name",
        },
        {
          key: "cuisine",
          header: "Cuisine",
        },
        {
          key: "description",
          header: "Description",
          render: (_, row) => row.description || "-",
        },
        {
          key: "food_types",
          header: "Food Types",
          render: (_, row) => row.food_types?.join(", ") || "-",
        },
        {
          key: "status",
          header: "Status",
          render: (_, row) => (row.is_active ? "Active" : "Inactive"),
        },
        {
          key: "created",
          header: "Created",
          render: (_, row) =>
            row.created_at
              ? formatDistanceToNow(new Date(row.created_at), {
                  addSuffix: true,
                })
              : "-",
        },
        {
          key: "actions",
          header: "Actions",
          render: (_, row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={Edit}
                onClick={() => onEdit?.(row)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant={row.is_active ? "secondary" : "primary"}
                leftIcon={row.is_active ? X : Check}
                onClick={() => handleStatusUpdate(row)}
              >
                {row.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={Trash2}
                onClick={() => handleDelete(row)}
              >
                Delete
              </Button>
            </div>
          ),
        },
      ]}
      rows={restaurants.map((restaurant) => ({
        id: restaurant.id,
        data: restaurant,
      }))}
      loading={isLoading}
      emptyMessage="No restaurants found"
    />
  );
};
