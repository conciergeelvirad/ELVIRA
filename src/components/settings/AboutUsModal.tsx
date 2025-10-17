import { useState, useEffect } from "react";
import { FormModal, Input } from "../common";
import { useHotel } from "../../contexts/HotelContext";
import { supabase } from "../../lib/supabase";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal = ({ isOpen, onClose }: AboutUsModalProps) => {
  const { currentHotel } = useHotel();
  const hotelId = currentHotel?.id || "";

  const [aboutUsText, setAboutUsText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing settings from the aboutSection toggle row
  useEffect(() => {
    const fetchSettings = async () => {
      if (!hotelId) return;

      const { data, error } = await supabase
        .from("hotel_settings")
        .select("about_us, about_us_button")
        .eq("hotel_id", hotelId)
        .eq("setting_key", "aboutSection")
        .single();

      if (error) {
        console.log("[AboutUsModal] No existing settings found:", error);
        return;
      }

      if (data) {
        // Load about_us text
        if (data.about_us) {
          setAboutUsText(data.about_us);
        }

        // Load button data from about_us_button column (stored as JSON)
        if (data.about_us_button) {
          try {
            const buttonData = JSON.parse(data.about_us_button);
            setButtonText(buttonData.text || "");
            setButtonUrl(buttonData.url || "");
          } catch (e) {
            console.error("[AboutUsModal] Error parsing button data:", e);
          }
        }
      }
    };

    if (isOpen) {
      fetchSettings();
    }
  }, [hotelId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId) return;

    setIsLoading(true);
    try {
      // Create button data object
      const buttonData = {
        text: buttonText,
        url: buttonUrl,
      };

      console.log("[AboutUsModal] Saving settings:", {
        about_us: aboutUsText,
        about_us_button: JSON.stringify(buttonData),
      });

      // Update the aboutSection row with about_us and about_us_button columns
      const { error } = await supabase.from("hotel_settings").upsert(
        {
          hotel_id: hotelId,
          setting_key: "aboutSection",
          setting_value: true, // Keep the toggle enabled
          about_us: aboutUsText,
          about_us_button: JSON.stringify(buttonData),
        },
        {
          onConflict: "hotel_id,setting_key",
        }
      );

      if (error) {
        console.error("[AboutUsModal] Error saving:", error);
        throw error;
      }

      console.log("[AboutUsModal] Settings saved successfully");

      // Close modal on success
      onClose();
    } catch (error) {
      console.error("[AboutUsModal] Error saving about us settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="About Us Section"
      submitText="Save"
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Us Text
          </label>
          <textarea
            value={aboutUsText}
            onChange={(e) => setAboutUsText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
            placeholder="Enter information about your hotel..."
          />
          <p className="mt-1 text-sm text-gray-500">
            This text will be displayed in the About Us section of your hotel.
          </p>
        </div>

        <div>
          <Input
            label="About Us Button Text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="e.g., Learn More, Read More, Discover"
          />
          <p className="mt-1 text-sm text-gray-500">
            The text that will appear on the About Us button.
          </p>
        </div>

        <div>
          <Input
            label="About Us Button URL"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="e.g., https://yourhotel.com/about"
          />
          <p className="mt-1 text-sm text-gray-500">
            The URL where the About Us button will redirect to.
          </p>
        </div>
      </div>
    </FormModal>
  );
};
