import {
  Info,
  BellOff,
  Camera,
  Wifi,
  ShoppingBag,
  MapPin,
  Utensils,
  Car,
  MessageCircle,
  Megaphone,
  HelpCircle,
  AlertTriangle,
  Bus,
} from "lucide-react";
import { useState } from "react";
import { SettingsSection } from "./SettingsSection";
import { SettingsCard } from "./SettingsCard";
import { AboutUsModal } from "./AboutUsModal";
import { HotelPhotoGalleryModal } from "./HotelPhotoGalleryModal";
import { useSettings } from "../../contexts";

export const ControlPanel = () => {
  const { settings, updateSetting } = useSettings();
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isPhotoGalleryModalOpen, setIsPhotoGalleryModalOpen] = useState(false);

  return (
    <div className="max-w-7xl pl-4 pr-6 py-6 space-y-8">
      {/* Layout & Branding */}
      <SettingsSection title="Layout & Branding" columns={4}>
        <SettingsCard
          icon={Info}
          title="About Section"
          description="Display hotel information and custom content"
          checked={settings.aboutSection}
          onChange={(checked) => updateSetting("aboutSection", checked)}
          actionLabel="Edit"
          onAction={() => setIsAboutUsModalOpen(true)}
        />
        <SettingsCard
          icon={BellOff}
          title="Do Not Disturb"
          description="Allow guests to toggle do not disturb status"
          checked={settings.doNotDisturb}
          onChange={(checked) => updateSetting("doNotDisturb", checked)}
        />
        <SettingsCard
          icon={Camera}
          title="Hotel Photo Gallery"
          description="Upload and manage up to 8 photos"
          checked={settings.hotelPhotoGallery}
          onChange={(checked) => updateSetting("hotelPhotoGallery", checked)}
          actionLabel="Manage Photos"
          onAction={() => setIsPhotoGalleryModalOpen(true)}
        />
      </SettingsSection>

      {/* Guest Services */}
      <SettingsSection title="Guest Services" columns={4}>
        <SettingsCard
          icon={Wifi}
          title="Hotel Amenities"
          description="Hotel facilities and services information"
          checked={settings.hotelAmenities}
          onChange={(checked) => updateSetting("hotelAmenities", checked)}
        />
        <SettingsCard
          icon={ShoppingBag}
          title="Hotel Shop"
          description="Purchase hotel merchandise and essentials"
          checked={settings.hotelShop}
          onChange={(checked) => updateSetting("hotelShop", checked)}
        />
        <SettingsCard
          icon={MapPin}
          title="Tours & Excursions"
          description="Book local tours and activities"
          checked={settings.toursExcursions}
          onChange={(checked) => updateSetting("toursExcursions", checked)}
        />
        <SettingsCard
          icon={Utensils}
          title="Room Service & Hotel Restaurant"
          description="Order food from hotel restaurant or room service"
          checked={settings.roomServiceRestaurant}
          onChange={(checked) =>
            updateSetting("roomServiceRestaurant", checked)
          }
        />
        <SettingsCard
          icon={Car}
          title="Local Restaurants"
          description="Discover and book local dining options"
          checked={settings.localRestaurants}
          onChange={(checked) => updateSetting("localRestaurants", checked)}
        />
        <SettingsCard
          icon={MessageCircle}
          title="Live Chat Support"
          description="Direct communication with hotel reception"
          checked={settings.liveChatSupport}
          onChange={(checked) => updateSetting("liveChatSupport", checked)}
        />
      </SettingsSection>

      {/* Information & Communication */}
      <SettingsSection title="Information & Communication" columns={4}>
        <SettingsCard
          icon={Megaphone}
          title="Hotel Announcements"
          description="Display important hotel news and updates"
          checked={settings.hotelAnnouncements}
          onChange={(checked) => updateSetting("hotelAnnouncements", checked)}
        />
        <SettingsCard
          icon={HelpCircle}
          title="Q&A - Recommendations"
          description="Frequently asked questions and Recommendations"
          checked={settings.qaRecommendations}
          onChange={(checked) => updateSetting("qaRecommendations", checked)}
        />
        <SettingsCard
          icon={AlertTriangle}
          title="Emergency Contacts"
          description="Essential emergency contact information"
          checked={settings.emergencyContacts}
          onChange={(checked) => updateSetting("emergencyContacts", checked)}
        />
        <SettingsCard
          icon={Bus}
          title="Public Transport"
          description="Show public transport information"
          checked={settings.publicTransport}
          onChange={(checked) => updateSetting("publicTransport", checked)}
        />
      </SettingsSection>

      {/* About Us Modal */}
      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
      />

      {/* Hotel Photo Gallery Modal */}
      <HotelPhotoGalleryModal
        isOpen={isPhotoGalleryModalOpen}
        onClose={() => setIsPhotoGalleryModalOpen(false)}
      />
    </div>
  );
};
