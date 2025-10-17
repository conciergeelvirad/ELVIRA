/**
 * Q&As Data View Component
 *
 * Renders Q&As in table or grid view with pagination and action handlers.
 */

import React from "react";
import {
  GenericDataView,
  GenericCard,
  CardActionFooter,
} from "../../../../components/common/data-display";
import { qaTableColumns, qaGridColumns } from "./QAColumns";
import type { QARecommendation } from "../../../../hooks/queries/hotel-management/qa-recommendations";
import { HelpCircle, MessageCircle, Tag } from "lucide-react";

interface QAsDataViewProps {
  viewMode: "list" | "grid";
  filteredData: Record<string, unknown>[];
  handleRowClick: (qa: QARecommendation) => void;
  onEdit: (qa: QARecommendation) => void;
  onDelete: (qa: QARecommendation) => void;
}

/**
 * Q&A Card Component for Grid View
 */
const QACard: React.FC<{
  qa: QARecommendation;
  onClick: () => void;
  onEdit?: (qa: QARecommendation) => void;
  onDelete?: (qa: QARecommendation) => void;
}> = ({ qa, onClick, onEdit, onDelete }) => {
  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      icon: <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />,
      content: <p className="line-clamp-3">{qa.answer || "N/A"}</p>,
      className: "items-start",
    },
  ];

  if (qa.created_at) {
    sections.push({
      content: (
        <div className="text-xs text-gray-400">
          {new Date(qa.created_at).toLocaleDateString()}
        </div>
      ),
    });
  }

  return (
    <GenericCard
      icon={<HelpCircle className="w-5 h-5 text-blue-600" />}
      iconBgColor="bg-blue-100"
      title={<span className="line-clamp-2">{qa.question || "N/A"}</span>}
      subtitle={
        <div className="flex items-center space-x-1">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">
            {qa.category}
          </span>
        </div>
      }
      sections={sections}
      footer={
        <CardActionFooter
          onEdit={onEdit ? () => onEdit(qa) : undefined}
          onDelete={onDelete ? () => onDelete(qa) : undefined}
        />
      }
      onClick={onClick}
    />
  );
};

/**
 * Q&As data view with table and grid rendering
 */
export const QAsDataView: React.FC<QAsDataViewProps> = ({
  viewMode,
  filteredData,
  handleRowClick,
  onEdit,
  onDelete,
}) => {
  return (
    <GenericDataView<QARecommendation>
      viewMode={viewMode}
      filteredData={filteredData}
      tableColumns={qaTableColumns}
      gridColumns={qaGridColumns}
      getItemId={(qa) => qa.id}
      renderCard={(qa, onClick) => (
        <QACard qa={qa} onClick={onClick} onEdit={onEdit} onDelete={onDelete} />
      )}
      onItemClick={handleRowClick}
      emptyMessage="No Q&A items found"
    />
  );
};
