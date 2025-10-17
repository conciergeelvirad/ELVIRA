/**
 * Quick Access Sections Component
 *
 * Displays horizontal tabs for Hotel, Experiences, Currency, and Transport
 * Matches the reference design with icon-based navigation
 */

import { Building2, MapPin, Coins, Car } from "lucide-react";
import { useState } from "react";

type QuickSection = "hotel" | "experiences" | "currency" | "transport";

interface QuickAccessSectionsProps {
  onSectionChange?: (section: QuickSection) => void;
}

interface SectionItem {
  id: QuickSection;
  label: string;
  icon: React.ReactNode;
}

const sections: SectionItem[] = [
  {
    id: "hotel",
    label: "Hotel",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "experiences",
    label: "Experiences",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: "currency",
    label: "Currency",
    icon: <Coins className="w-5 h-5" />,
  },
  {
    id: "transport",
    label: "Transport",
    icon: <Car className="w-5 h-5" />,
  },
];

export const QuickAccessSections = ({
  onSectionChange,
}: QuickAccessSectionsProps) => {
  const [activeSection, setActiveSection] = useState<QuickSection>("hotel");

  const handleSectionClick = (sectionId: QuickSection) => {
    setActiveSection(sectionId);
    onSectionChange?.(sectionId);
  };

  return (
    <div className="px-4 mt-6">
      {/* Horizontal tabs */}
      <div className="grid grid-cols-4 gap-2 bg-gray-50 p-1.5 rounded-xl">
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-3 px-2
                rounded-lg transition-all duration-200 touch-manipulation
                ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {section.icon}
              <span className="text-xs font-medium">{section.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
