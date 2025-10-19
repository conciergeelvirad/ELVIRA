import React from "react";
import { EmergencyContact } from "../../../../data/emergencyContacts";
import { getDetailFields } from "./EmergencyContactColumns";

interface EmergencyContactDetailProps {
  item: EmergencyContact | Record<string, unknown>;
}

export const EmergencyContactDetail: React.FC<EmergencyContactDetailProps> = ({
  item,
}) => {
  const contact = item as unknown as EmergencyContact;

  return (
    <div className="space-y-2">
      {getDetailFields(contact).map((field, index) => (
        <div
          key={index}
          className="py-2 border-b border-gray-100 last:border-b-0"
        >
          <div className="grid grid-cols-2 items-center">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase">
                {field.label}
              </span>
            </div>
            <div className="text-right">
              {field.type === "custom" ? (
                field.value
              ) : field.type === "status" ? (
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    typeof field.value === "boolean" && field.value
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {typeof field.value === "boolean"
                    ? field.value
                      ? "Active"
                      : "Inactive"
                    : field.value?.toString() || "-"}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {field.value?.toString() || "-"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
