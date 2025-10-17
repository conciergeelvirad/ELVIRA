import { ReactNode, useState } from 'react';
import { GenericSidebar } from './GenericSidebar';
import { Footer } from './Footer';
import { NavigationItem } from '../../types/navigation';

interface GenericDashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  systemLabel: string;
  navigationItems: NavigationItem[];
  activeItem?: string;
  onNavigate?: (itemId: string) => void;
}

export const GenericDashboardLayout = ({
  children,
  title,
  subtitle,
  systemLabel,
  navigationItems,
  activeItem,
  onNavigate,
}: GenericDashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <GenericSidebar
          title={title}
          subtitle={subtitle}
          systemLabel={systemLabel}
          navigationItems={navigationItems}
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
            <GenericSidebar
              title={title}
              subtitle={subtitle}
              systemLabel={systemLabel}
              navigationItems={navigationItems}
              activeItem={activeItem}
              onNavigate={onNavigate}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      )}

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-[220px]'} flex flex-col`}>
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
