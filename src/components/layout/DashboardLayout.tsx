import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem?: string;
  onNavigate?: (itemId: string) => void;
}

export const DashboardLayout = ({
  children,
  activeItem,
  onNavigate,
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Always visible on small screens */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      <div className="hidden lg:block">
        <Sidebar
          activeItem={activeItem}
          onNavigate={onNavigate}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar
              activeItem={activeItem}
              onNavigate={onNavigate}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-[220px]"
        } flex flex-col`}
      >
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
