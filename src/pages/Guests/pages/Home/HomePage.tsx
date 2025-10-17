/**
 * Home Page
 *
 * Guest dashboard home page - displays stay details and quick access sections
 */

import { useState } from "react";
import { GuestData } from "../../../../services/guestAuth.service";
import {
  StayDetailsCard,
  CategoryMenu,
  CategoryType,
  QuickAccessSection,
  RecommendedSection,
  ApprovedThirdPartySection,
  AboutUsSection,
  PhotoGallerySection,
  EmergencyContactsSection,
} from "./components";

interface HomePageProps {
  guestData: GuestData;
  hotelId: string;
  onNavigate?: (tab: string) => void;
}

export const HomePage = ({ guestData, hotelId, onNavigate }: HomePageProps) => {
  // For now, we'll use mock dates since they're not in the database yet
  // TODO: Add check_in_date and check_out_date to the guests table
  const mockCheckIn = "2025-08-29";
  const mockCheckOut = "2025-10-30";

  const [activeCategory, setActiveCategory] = useState<CategoryType>("hotel");

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
  };

  const handleQuickAccessClick = (cardId: string) => {
    // Navigate to the corresponding page/tab
    if (cardId === "amenities" && onNavigate) {
      onNavigate("services");
    } else if (cardId === "dine-in" && onNavigate) {
      onNavigate("dine-in");
    } else if (cardId === "hotel-shop" && onNavigate) {
      onNavigate("shop");
    } else if (cardId === "qna" && onNavigate) {
      onNavigate("qa");
    }
  };

  const getCategoryCards = () => {
    switch (activeCategory) {
      case "hotel":
        return [
          {
            id: "amenities",
            title: "Amenities",
            description: "Hotel facilities and services",
            onClick: () => handleQuickAccessClick("amenities"),
          },
          {
            id: "dine-in",
            title: "Dine In",
            description: "Room service and restaurant",
            onClick: () => handleQuickAccessClick("dine-in"),
          },
          {
            id: "hotel-shop",
            title: "Hotel Shop",
            description: "Purchase hotel merchandise",
            onClick: () => handleQuickAccessClick("hotel-shop"),
          },
          {
            id: "qna",
            title: "Q&A",
            description: "Frequently asked questions",
            onClick: () => handleQuickAccessClick("qna"),
          },
        ];
      case "experiences":
        return [
          {
            id: "gastronomy",
            title: "Gastronomy",
            description: "Discover local cuisine and dining experiences",
            onClick: () => onNavigate?.("gastronomy"),
          },
          {
            id: "tours",
            title: "Tours",
            description: "Explore the city with guided tours",
            onClick: () => onNavigate?.("tours"),
          },
        ];
      case "currency":
        return [
          {
            id: "exchange-rates",
            title: "Exchange Rates",
            description: "Current currency exchange rates",
          },
          {
            id: "atm-locations",
            title: "ATM Locations",
            description: "Find nearby ATMs and banks",
          },
        ];
      case "transport":
        return [
          {
            id: "airport-shuttle",
            title: "Airport Shuttle",
            description: "Book airport transfer services",
          },
          {
            id: "car-rental",
            title: "Car Rental",
            description: "Rent a car for your stay",
          },
          {
            id: "public-transport",
            title: "Public Transport",
            description: "Metro, bus, and train information",
          },
          {
            id: "taxi-services",
            title: "Taxi Services",
            description: "Book a taxi or rideshare",
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="pb-6">
      {/* Stay Details Card */}
      <StayDetailsCard
        checkInDate={mockCheckIn}
        checkOutDate={mockCheckOut}
        roomNumber={guestData.room_number}
        accessCode={guestData.verification_code || "******"}
      />

      {/* Category Menu */}
      <CategoryMenu onCategoryChange={handleCategoryChange} />

      {/* Quick Access Section - Dynamic based on category */}
      <QuickAccessSection items={getCategoryCards()} />

      {/* Recommended for You Section - Only visible in Hotel category */}
      {activeCategory === "hotel" && <RecommendedSection hotelId={hotelId} />}

      {/* Approved Third Party Section - Only visible in Experiences category */}
      {activeCategory === "experiences" && (
        <ApprovedThirdPartySection hotelId={hotelId} />
      )}

      {/* About Us Section */}
      <AboutUsSection hotelId={hotelId} />

      {/* Photo Gallery Section */}
      <PhotoGallerySection hotelId={hotelId} />

      {/* Emergency Contacts Section */}
      <EmergencyContactsSection hotelId={hotelId} />
    </div>
  );
};
