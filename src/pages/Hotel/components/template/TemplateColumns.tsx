import {
  FormFieldConfig,
  CRUDModalActions,
  CRUDFormActions,
} from "../../../../hooks";
import { TemplateEntity } from "../../../../data/templateData";
import { Column, GridColumn } from "../../../../types/table";

type EnhancedTemplateEntity = TemplateEntity & Record<string, unknown>;

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedTemplateEntity>;
  formActions: CRUDFormActions;
}

// TODO: Customize these form fields for your entity
export const TEMPLATE_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter template name",
    required: true,
    validation: (value) => {
      if (!value) return "Name is required";
      return null;
    },
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter description",
    required: true,
    validation: (value) => {
      if (!value) return "Description is required";
      return null;
    },
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category",
    required: true,
    options: [
      { value: "General", label: "General" },
      { value: "Specific", label: "Specific" },
      { value: "Advanced", label: "Advanced" },
      // TODO: Add your category options
    ],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    placeholder: "Select priority",
    required: true,
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ],
  },
];

// TODO: Update enhance function for your entity
export const enhanceTemplate = (
  template: TemplateEntity
): EnhancedTemplateEntity => {
  return template as EnhancedTemplateEntity;
};

// TODO: Update table columns for your entity
export const getTableColumns = ({
  handleStatusToggle,
  modalActions,
  formActions,
}: GetColumnsOptions): Column<TemplateEntity>[] => [
  {
    key: "name",
    header: "Name",
    accessor: "name",
  },
  {
    key: "description",
    header: "Description",
    accessor: "description",
  },
  {
    key: "category",
    header: "Category",
    accessor: "category",
  },
  {
    key: "priority",
    header: "Priority",
    accessor: "priority",
    render: (value: string) => {
      const priority = String(value || "");
      let colorClass = "bg-gray-100 text-gray-800";

      if (priority === "High") {
        colorClass = "bg-red-100 text-red-800";
      } else if (priority === "Medium") {
        colorClass = "bg-yellow-100 text-yellow-800";
      } else if (priority === "Low") {
        colorClass = "bg-green-100 text-green-800";
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (value: string) => {
      const status = String(value || "");
      const isActive = status === "ACTIVE";
      return (
        <div className="flex items-center">
          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>{isActive ? "Active" : "Inactive"}</span>
        </div>
      );
    },
  },
  {
    key: "actions",
    header: "Actions",
    render: (_value: unknown, item: TemplateEntity) => {
      const isActive = String(item.status || "") === "ACTIVE";
      return (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Update form fields to match your entity
              const editData = {
                name: item.name,
                description: item.description,
                category: item.category,
                priority: item.priority,
              };
              formActions.setFormData(editData);
              modalActions.openEditModal(enhanceTemplate(item));
            }}
          >
            Edit
          </button>
          <button
            className={`text-sm ${
              isActive
                ? "text-red-600 hover:text-red-800"
                : "text-green-600 hover:text-green-800"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusToggle(String(item.id), !isActive);
            }}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      );
    },
  },
];

// TODO: Update grid columns for your entity
export const getGridColumns = (): GridColumn[] => [
  {
    key: "name",
    label: "Name",
    accessor: "name",
  },
  {
    key: "category",
    label: "Category",
    accessor: "category",
  },
  {
    key: "priority",
    label: "Priority",
    accessor: "priority",
  },
  {
    key: "status",
    label: "Status",
    accessor: "status",
  },
];
