import { Phone, AlertTriangle } from "lucide-react";
import {
  GenericCard,
  CardActionFooter,
} from "../../../../components/common/data-display";
import { EmergencyContact } from "../../../../data/emergencyContacts";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onStatusToggle: (contactId: string, newStatus: boolean) => void;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contact: EmergencyContact) => void;
  onView: (contact: EmergencyContact) => void;
  onClick?: () => void;
}

export const EmergencyContactCard = ({
  contact,
  onStatusToggle,
  onEdit,
  onDelete,
  onView,
  onClick,
}: EmergencyContactCardProps) => {
  const status = contact.status === "ACTIVE" ? "Active" : "Inactive";

  const sections: Array<{
    icon?: React.ReactNode;
    content: React.ReactNode;
    className?: string;
  }> = [
    {
      content: (
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {contact.type}
        </p>
      ),
    },
    {
      icon: <Phone className="w-4 h-4" />,
      content: (
        <span className="text-sm text-gray-700 font-mono">
          {contact.phoneNumber}
        </span>
      ),
    },
  ];

  return (
    <GenericCard
      icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
      iconBgColor="bg-red-50"
      title={contact.contactName}
      badge={{
        label: status,
        variant: "soft",
      }}
      sections={sections}
      onClick={onClick || (() => onView(contact))}
      footer={
        <CardActionFooter
          onEdit={() => onEdit(contact)}
          onDelete={() => onDelete(contact)}
        />
      }
    />
  );
};
