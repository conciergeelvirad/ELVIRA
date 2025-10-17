/**
 * Emergency Contacts Section Component
 *
 * Displays important emergency contact information with:
 * - Section title and description
 * - List of emergency contacts with names and phone numbers
 * - Clean, readable layout
 * - Data from database (emergency_contacts table)
 */

import { Phone } from "lucide-react";
import { useEmergencyContacts } from "../../../../../hooks/queries/hotel-management/emergency-contacts";

interface EmergencyContactsSectionProps {
  hotelId: string;
}

export const EmergencyContactsSection = ({
  hotelId,
}: EmergencyContactsSectionProps) => {
  // Fetch emergency contacts from database
  const { data: contacts, isLoading } = useEmergencyContacts(hotelId);

  // Filter only active contacts
  const activeContacts = contacts?.filter((c) => c.is_active) || [];

  const handleCallClick = (contactName: string, phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8 px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Contacts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Important contact information for your safety
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading contacts...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (activeContacts.length === 0) {
    return (
      <div className="mt-8 px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Contacts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Important contact information for your safety
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No emergency contacts available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
        <p className="text-sm text-gray-600 mt-1">
          Important contact information for your safety
        </p>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeContacts.map((contact, index) => (
          <div key={contact.id}>
            <button
              onClick={() =>
                handleCallClick(contact.contact_name, contact.phone_number)
              }
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
            >
              {/* Contact Name */}
              <span className="text-gray-900 font-medium text-left">
                {contact.contact_name}
              </span>

              {/* Phone Number */}
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-mono text-sm">
                  {contact.phone_number}
                </span>
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
            </button>

            {/* Divider - not shown after last item */}
            {index < activeContacts.length - 1 && (
              <div className="border-b border-gray-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
