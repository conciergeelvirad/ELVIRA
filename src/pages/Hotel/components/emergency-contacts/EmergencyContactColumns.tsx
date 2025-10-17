import { AlertTriangle } from "lucide-react";
import { Column, GridColumn } from "../../../../types/table";
import {
  UnifiedToggle,
  ActionButtonGroup,
} from "../../../../components/common";
import { EmergencyContact } from "../../../../data/emergencyContacts";
import { CRUDModalActions, CRUDFormActions } from "../../../../hooks";

type EnhancedEmergencyContact = EmergencyContact & Record<string, unknown>;

// Helper function to convert EmergencyContact to EnhancedEmergencyContact
export const enhanceContact = (
  contact: EmergencyContact
): EnhancedEmergencyContact => {
  return contact as unknown as EnhancedEmergencyContact;
};

interface GetColumnsOptions {
  handleStatusToggle: (id: string, newStatus: boolean) => void;
  modalActions: CRUDModalActions<EnhancedEmergencyContact>;
  formActions: CRUDFormActions;
}

export const getTableColumns = ({
  handleStatusToggle,
  modalActions,
  formActions,
}: GetColumnsOptions): Column<EmergencyContact>[] => {
  return [
    {
      key: "contactName",
      header: "CONTACT NAME",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "PHONE NUMBER",
      sortable: true,
      render: (value) => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {value}
        </span>
      ),
    },
    {
      key: "created",
      header: "CREATED",
      sortable: true,
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (value, contact) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UnifiedToggle
            checked={value === "ACTIVE"}
            onChange={(checked) => handleStatusToggle(contact.id, checked)}
            variant="compact"
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (_, contact) => (
        <ActionButtonGroup
          actions={[
            {
              type: "edit",
              onClick: (e) => {
                e.stopPropagation();
                formActions.setFormData({
                  contactName: contact.contactName,
                  phoneNumber: contact.phoneNumber,
                  type: contact.type,
                });
                modalActions.openEditModal(enhanceContact(contact));
              },
            },
            {
              type: "delete",
              onClick: (e) => {
                e.stopPropagation();
                modalActions.openDeleteModal(enhanceContact(contact));
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
      key: "contactName",
      label: "Contact Name",
      accessor: "contactName",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      accessor: "phoneNumber",
    },
    {
      key: "type",
      label: "Type",
      accessor: "type",
    },
    {
      key: "status",
      label: "Status",
      accessor: "status",
      render: (value: string, item: EmergencyContact) => (
        <UnifiedToggle
          checked={value === "ACTIVE"}
          onChange={(checked) => handleStatusToggle(item.id, checked)}
          variant="compact"
          size="sm"
        />
      ),
    },
  ];
};

// Form field configuration
export const FORM_FIELDS = [
  {
    key: "contactName",
    label: "Contact Name",
    placeholder: "Enter contact name",
    type: "text" as const,
    required: true,
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter phone number",
    type: "tel" as const,
    required: true,
  },
  {
    key: "type",
    label: "Contact Type",
    placeholder: "e.g., Police, Fire Department, Hospital",
    type: "text" as const,
    required: true,
  },
];

// Generate detail fields for view modal
export const getDetailFields = (contact: EmergencyContact) => [
  {
    label: "Contact Name",
    value: contact.contactName,
    type: "text",
  },
  {
    label: "Phone Number",
    value: contact.phoneNumber,
    type: "phone",
  },
  {
    label: "Contact Type",
    value: contact.type,
    type: "text",
  },
  {
    label: "Status",
    value: contact.status === "ACTIVE",
    type: "status",
  },
  {
    label: "Created Date",
    value: contact.created,
    type: "date",
  },
  {
    label: "Priority",
    value: contact.priority,
    type: "text",
  },
];
