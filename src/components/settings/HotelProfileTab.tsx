import { useHotel } from "../../contexts/HotelContext";
import { useHotelStaff } from "../../hooks/hotel/useHotelStaff";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
} from "lucide-react";
import { useMemo } from "react";

interface HotelData {
  id: string;
  name: string;
  owner_id: string;
  contact_email: string | null;
  phone_number: string | null;
  reception_phone: string | null;
  website: string | null;
  city: string | null;
  zip_code: string | null;
  country: string | null;
  address: string | null;
  stripe_account_id: string | null;
  number_rooms: number | null;
  created_at: string;
}

const InfoBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5 break-words">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </p>
    </div>
  </div>
);

export const HotelProfileTab = () => {
  const { currentHotel } = useHotel();
  const { hotelStaff } = useHotelStaff();
  const hotelId = currentHotel?.id;

  // Check if user is admin or manager
  const isAdminOrManager = useMemo(() => {
    return (
      hotelStaff?.position === "Hotel Admin" ||
      (hotelStaff?.position === "Hotel Staff" &&
        hotelStaff?.department === "Manager")
    );
  }, [hotelStaff]);

  // Fetch hotel details from database
  const { data: hotelData, isLoading } = useQuery<HotelData>({
    queryKey: ["hotel-profile", hotelId],
    queryFn: async () => {
      if (!hotelId) throw new Error("No hotel ID");

      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", hotelId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hotel data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Hotel Name */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-500">Hotel Name</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-0.5">
              {hotelData.name}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Information */}
        <InfoBlock title="Location">
          <InfoField icon={MapPin} label="Address" value={hotelData.address} />
          <InfoField icon={MapPin} label="City" value={hotelData.city} />
          <InfoField
            icon={MapPin}
            label="ZIP Code"
            value={hotelData.zip_code}
          />
          <InfoField icon={MapPin} label="Country" value={hotelData.country} />
        </InfoBlock>

        {/* Contact Information */}
        <InfoBlock title="Contact">
          <InfoField
            icon={Mail}
            label="Email"
            value={hotelData.contact_email}
          />
          <InfoField
            icon={Phone}
            label="Phone Number"
            value={hotelData.phone_number}
          />
          <InfoField
            icon={Phone}
            label="Reception Phone"
            value={hotelData.reception_phone}
          />
          <InfoField icon={Globe} label="Website" value={hotelData.website} />
        </InfoBlock>

        {/* Business Information */}
        <InfoBlock title="Business">
          <InfoField
            icon={Building2}
            label="Number of Rooms"
            value={hotelData.number_rooms}
          />
          <InfoField icon={Building2} label="Hotel ID" value={hotelData.id} />
          <InfoField
            icon={Building2}
            label="Created"
            value={new Date(hotelData.created_at).toLocaleDateString()}
          />
        </InfoBlock>

        {/* Payment Information - Only for Admin/Manager */}
        {isAdminOrManager && (
          <InfoBlock title="Payment">
            <InfoField
              icon={CreditCard}
              label="Stripe Account ID"
              value={hotelData.stripe_account_id}
            />
            {hotelData.stripe_account_id && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> This information is only visible to
                  Hotel Admins and Managers.
                </p>
              </div>
            )}
          </InfoBlock>
        )}
      </div>

      {/* Role Badge */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Your Role</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {hotelStaff?.position}
              {hotelStaff?.department && ` - ${hotelStaff.department}`}
            </p>
          </div>
          {isAdminOrManager && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Admin Access
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
