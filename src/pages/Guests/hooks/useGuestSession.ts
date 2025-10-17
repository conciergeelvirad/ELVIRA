/**
 * useGuestSession Hook
 *
 * Manages guest session loading, validation, and logout
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getGuestSession,
  clearGuestSession,
  type GuestData,
  type HotelData,
} from "../../../services/guestAuth.service";

interface UseGuestSessionReturn {
  guestData: GuestData | null;
  hotelData: HotelData | null;
  isLoading: boolean;
  handleLogout: () => void;
}

export const useGuestSession = (): UseGuestSessionReturn => {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get guest session
    const session = getGuestSession();

    if (!session || !session.guestData) {
      navigate("/guest");
      return;
    }

    // Check if access has expired
    const expiresAt = new Date(session.guestData.access_code_expires_at);
    const now = new Date();

    if (expiresAt < now) {
      clearGuestSession();
      navigate("/guest");
      return;
    }

    setGuestData(session.guestData);
    setHotelData(session.hotelData || null);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    clearGuestSession();
    navigate("/guest");
  };

  return {
    guestData,
    hotelData,
    isLoading,
    handleLogout,
  };
};
