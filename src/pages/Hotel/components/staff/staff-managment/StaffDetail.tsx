import { StaffMember } from "../../../../../hooks/queries/hotel-management/staff";
import { Avatar } from "../../../../../components/common/ui";
import {
  DetailField,
  DetailBadge,
} from "../../../../../components/common/detail";

export const StaffDetail = ({ item }: { item: StaffMember }) => {
  return (
    <div className="space-y-6 -mx-6 -my-4">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-3 pb-6 border-b border-gray-200 px-6 pt-4">
        <Avatar
          src={item.photo}
          name={item.name}
          size="2xl"
          alt={`${item.name}'s avatar`}
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
          <p className="text-sm text-gray-500">{item.position}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-4 px-6 pb-4">
        <DetailBadge
          label="Status"
          value={item.status}
          color={item.status === "active" ? "green" : "gray"}
        />

        <DetailField label="Employee ID" value={item.employeeId} mono />

        <DetailField label="Position" value={item.position} />

        <DetailField label="Department" value={item.department} />

        <DetailField label="Name" value={item.name} fontWeight="medium" />

        <DetailField label="Email" value={item.email} />

        <DetailField label="Phone" value={item.phone} />

        <DetailField label="Hire Date" value={item.hireDate} />

        {item.dateOfBirth && (
          <DetailField label="Date of Birth" value={item.dateOfBirth} />
        )}

        {item.address && <DetailField label="Address" value={item.address} />}

        {item.city && <DetailField label="City" value={item.city} />}

        {item.zipCode && <DetailField label="Zip Code" value={item.zipCode} />}

        {item.emergencyContactName && (
          <DetailField
            label="Emergency Contact"
            value={item.emergencyContactName}
          />
        )}

        {item.emergencyContactNumber && (
          <DetailField
            label="Emergency Phone"
            value={item.emergencyContactNumber}
          />
        )}
      </div>
    </div>
  );
};
