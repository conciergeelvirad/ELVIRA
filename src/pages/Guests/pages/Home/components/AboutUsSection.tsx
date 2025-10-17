/**
 * About Us Section Component
 *
 * Displays hotel information with:
 * - "About Us" title with blue accent
 * - Hotel description from database
 * - Customizable booking button from database
 * - Data from database (hotel_settings.about_us, about_us_button)
 */

import { useHotelSettings } from "../../../../../hooks/queries/useHotelSettings";

interface AboutUsSectionProps {
  hotelId: string;
}

export const AboutUsSection = ({ hotelId }: AboutUsSectionProps) => {
  // Fetch hotel settings from database
  const { data: settings, isLoading, error } = useHotelSettings(hotelId);

  // Find the about section setting
  const aboutSetting = settings?.find((s) => s.setting_key === "aboutSection");

  // Parse button data (could be JSON with text and URL)
  const parseButtonData = (
    buttonData: string | null
  ): { text: string; url?: string } => {
    if (!buttonData) {
      return { text: "Booking" };
    }

    try {
      const parsed = JSON.parse(buttonData);
      return {
        text: parsed.text || "Booking",
        url: parsed.url,
      };
    } catch {
      // If not JSON, treat as plain text
      return { text: buttonData };
    }
  };

  const buttonConfig = parseButtonData(aboutSetting?.about_us_button || null);
  const description =
    aboutSetting?.about_us ||
    "Located one kilometer from Munich Central Station, two kilometers from the Theresienwiese U-Bahn station, and 36 kilometers from Munich International Airport (MUC), Centro Hotel Mondial München, Trademark Collection by Wyndham welcomes you with free Wi-Fi, a breakfast buffet, and paid on-site parking.";

  const handleBookingClick = () => {
    if (buttonConfig.url) {
      window.open(buttonConfig.url, "_blank");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="bg-gray-900 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
            About <span className="text-blue-500">Us</span>
          </h2>
          <div className="bg-white rounded-xl p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Dark background container */}
      <div className="bg-gray-900 p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
          About <span className="text-blue-500">Us</span>
        </h2>

        {/* Content card */}
        <div className="bg-white rounded-xl p-6 sm:p-8">
          {/* Description */}
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center mb-6">
            {description}
          </p>

          {/* Booking button */}
          <div className="flex justify-center">
            <button
              onClick={handleBookingClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 shadow-md hover:shadow-lg"
            >
              {buttonConfig.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
