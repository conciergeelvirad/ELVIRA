import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { SettingsState } from "../types";
import { useHotel } from "./HotelContext";
import { useHotelSettings } from "../hooks/queries";
import { supabase } from "../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: (key: keyof SettingsState, value: boolean) => void;
  hotelName?: string;
  hotelInitials?: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { currentHotel } = useHotel();
  const queryClient = useQueryClient();
  const hotelId = currentHotel?.id || "";

  // Default fallback settings
  const defaultSettings: SettingsState = {
    aboutSection: true,
    doNotDisturb: true,
    hotelPhotoGallery: true,
    hotelAmenities: true,
    hotelShop: true,
    toursExcursions: true,
    roomServiceRestaurant: true,
    localRestaurants: true,
    liveChatSupport: true,
    hotelAnnouncements: true,
    qaRecommendations: true,
    emergencyContacts: true,
    publicTransport: false,
  };

  // Fetch settings from Supabase
  const { data: dbSettings } = useHotelSettings(hotelId);

  // Convert database settings to SettingsState
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    if (dbSettings && dbSettings.length > 0) {
      const settingsMap: Partial<SettingsState> = {};

      dbSettings.forEach((setting) => {
        const key = setting.setting_key as keyof SettingsState;
        settingsMap[key] = setting.setting_value;
      });

      // Merge with default settings to ensure all keys exist
      const mergedSettings = { ...defaultSettings, ...settingsMap };
      setSettings(mergedSettings);

      console.log("[SettingsProvider] ✅ Settings loaded from database");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbSettings]);

  const updateSetting = async (key: keyof SettingsState, value: boolean) => {
    if (!hotelId) {
      console.error("[SettingsProvider] ❌ No hotelId available");
      return;
    }

    // Optimistically update local state
    setSettings((prev) => ({ ...prev, [key]: value }));
    console.log(`[SettingsProvider] 🔄 Updating "${key}" to ${value}`);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from("hotel_settings")
        .upsert(
          {
            hotel_id: hotelId,
            setting_key: key,
            setting_value: value,
          },
          {
            onConflict: "hotel_id,setting_key",
          }
        )
        .select();

      if (error) throw error;

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["hotel-settings", hotelId] });
      console.log(`[SettingsProvider] ✅ "${key}" saved to database`);
    } catch (error) {
      console.error(`[SettingsProvider] ❌ Failed to update "${key}":`, error);
      // Revert optimistic update on error
      setSettings((prev) => ({ ...prev, [key]: !value }));
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        hotelName: currentHotel?.name,
        hotelInitials: currentHotel?.initials,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
