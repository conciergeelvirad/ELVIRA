import { Edit2, Trash2 } from "lucide-react";

interface ScheduleDetailCardProps {
  staffName: string;
  shiftTime: string;
  status: string;
  notes?: string;
  isConfirmed: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
} as const;

export const ScheduleDetailCard = ({
  staffName,
  shiftTime,
  status,
  notes,
  isConfirmed,
  canEdit = false,
  onEdit,
  onDelete,
}: ScheduleDetailCardProps) => {
  const statusStyle =
    STATUS_STYLES[status as keyof typeof STATUS_STYLES] ||
    STATUS_STYLES.SCHEDULED;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">
            {staffName}
          </span>
          <span className="text-xs text-gray-500">{shiftTime}</span>
        </div>
        {notes && <p className="mt-1 text-xs text-gray-600">{notes}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}
          >
            {status}
          </span>
          {isConfirmed && (
            <span className="text-xs text-green-600">✓ Confirmed</span>
          )}
        </div>

        {/* Edit/Delete Actions - Only visible for Hotel Admin and Manager */}
        {canEdit && (
          <div className="flex items-center gap-1 ml-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit schedule"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
