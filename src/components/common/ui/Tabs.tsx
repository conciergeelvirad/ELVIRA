import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../../utils";

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabsProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm uppercase tracking-wide transition-colors whitespace-nowrap",
                  isActive
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {Icon && <Icon size={18} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};
