/**
 * Q&A Columns Configuration
 *
 * Defines column configurations for Q&A table/grid views and detail fields.
 */

import { HelpCircle, Tag, MessageCircle } from "lucide-react";
import type { Column } from "../../../../types/table";
import type { QARecommendation } from "../../../../hooks/queries/hotel-management/qa-recommendations";

/**
 * Table columns for Q&A
 */
export const qaTableColumns: Column<QARecommendation>[] = [
  {
    key: "category",
    header: "Category",
    accessor: "category",
  },
  {
    key: "question",
    header: "Question",
    accessor: (qa) => qa.question || "-",
  },
  {
    key: "answer",
    header: "Answer",
    accessor: (qa) => {
      const answer = qa.answer || "-";
      return answer.length > 100 ? `${answer.substring(0, 100)}...` : answer;
    },
  },
  {
    key: "created_at",
    header: "Created",
    accessor: (qa) =>
      qa.created_at ? new Date(qa.created_at).toLocaleDateString() : "-",
  },
];

/**
 * Grid columns for Q&A (card view)
 */
export const qaGridColumns = [
  { key: "category", label: "Category" },
  { key: "question", label: "Question" },
  { key: "answer", label: "Answer" },
];

/**
 * Detail view fields for Q&A modal
 */
export const qaDetailFields = [
  {
    key: "category",
    label: "Category",
    icon: Tag,
    accessor: (qa: QARecommendation) => qa.category || "N/A",
  },
  {
    key: "question",
    label: "Question",
    icon: HelpCircle,
    accessor: (qa: QARecommendation) => qa.question || "N/A",
  },
  {
    key: "answer",
    label: "Answer",
    icon: MessageCircle,
    accessor: (qa: QARecommendation) => qa.answer || "N/A",
  },
  {
    key: "created_at",
    label: "Created",
    accessor: (qa: QARecommendation) => {
      if (!qa.created_at) return "N/A";
      return new Date(qa.created_at).toLocaleString();
    },
  },
];
