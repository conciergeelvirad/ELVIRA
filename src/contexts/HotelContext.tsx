import { createContext, useContext, useState, ReactNode } from "react";
import { Hotel, SettingsState } from "../types";

interface HotelContextType {
  currentHotel: Hotel | null;
  setCurrentHotel: (hotel: Hotel) => void;
  updateHotelSettings: (
    hotelId: string,
    settings: Partial<SettingsState>
  ) => void;
  switchHotel: (hotelId: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};

// Default settings that work for most hotels
const DEFAULT_HOTEL_SETTINGS: SettingsState = {
  // Layout & Content
  aboutSection: true,
  doNotDisturb: true,
  hotelPhotoGallery: true,

  // Guest Services
  hotelAmenities: true,
  hotelShop: true,
  toursExcursions: true,
  roomServiceRestaurant: true,
  localRestaurants: true,
  liveChatSupport: true,

  // Information & Communication
  hotelAnnouncements: true,
  qaRecommendations: true,
  emergencyContacts: true,
  publicTransport: false, // Most hotels don't manage public transport
};

// Mock hotel data - in a real app, this would come from your backend
const AVAILABLE_HOTELS: Hotel[] = [
  {
    id: "086e11e4-4775-4327-8448-3fa0ee7be0a5",
    name: "Centro Hotel Mondial",
    initials: "CM",
    settings: {
      ...DEFAULT_HOTEL_SETTINGS,
      // Centro Hotel specific overrides
      hotelShop: true,
      toursExcursions: true,
    },
    branding: {
      primaryColor: "#1f2937",
      secondaryColor: "#6b7280",
      accentColor: "#3b82f6",
    },
  },
  {
    id: "grand-palace-hotel",
    name: "Grand Palace Hotel",
    initials: "GP",
    settings: {
      ...DEFAULT_HOTEL_SETTINGS,
      // Grand Palace specific overrides
      hotelShop: false, // No hotel shop
      publicTransport: true, // Located near transport hub
    },
    branding: {
      primaryColor: "#7c2d12",
      secondaryColor: "#a3a3a3",
      accentColor: "#dc2626",
    },
  },
  {
    id: "seaside-resort",
    name: "Seaside Resort & Spa",
    initials: "SR",
    settings: {
      ...DEFAULT_HOTEL_SETTINGS,
      // Seaside Resort specific overrides
      toursExcursions: true, // Beach resort with many activities
      localRestaurants: false, // Remote location
    },
    branding: {
      primaryColor: "#0c4a6e",
      secondaryColor: "#64748b",
      accentColor: "#0ea5e9",
    },
  },
];

interface HotelProviderProps {
  children: ReactNode;
  initialHotelId?: string;
}

export const HotelProvider = ({
  children,
  initialHotelId = "086e11e4-4775-4327-8448-3fa0ee7be0a5",
}: HotelProviderProps) => {
  // Find the initial hotel or default to the first one
  const initialHotel =
    AVAILABLE_HOTELS.find((hotel) => hotel.id === initialHotelId) ||
    AVAILABLE_HOTELS[0];

  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(initialHotel);

  const updateHotelSettings = (
    hotelId: string,
    newSettings: Partial<SettingsState>
  ) => {
    if (!currentHotel || currentHotel.id !== hotelId) {
      return;
    }

    // Update the current hotel's settings
    const updatedHotel: Hotel = {
      ...currentHotel,
      settings: {
        ...currentHotel.settings,
        ...newSettings,
      },
    };

    setCurrentHotel(updatedHotel);

    // In a real application, you would persist this to your backend
    // Example: await saveHotelSettings(hotelId, newSettings);
  };

  const switchHotel = (hotelId: string) => {
    const hotel = AVAILABLE_HOTELS.find((h) => h.id === hotelId);
    if (hotel) {
      setCurrentHotel(hotel);
    } else {
    }
  };

  return (
    <HotelContext.Provider
      value={{
        currentHotel,
        setCurrentHotel,
        updateHotelSettings,
        switchHotel,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};
