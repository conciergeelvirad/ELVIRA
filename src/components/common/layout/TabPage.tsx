import { useState, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { PageContainer, PageHeader } from "../layout";
import { Tabs, EmptyState, type Tab } from "../ui";

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  message?: string;
  content?: ReactNode;
}

interface TabPageProps {
  title: string;
  tabs: TabConfig[];
  defaultTab?: string;
}

export const TabPage = ({ title, tabs, defaultTab }: TabPageProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const tabsWithContent: Tab[] = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    content: tab.content || (
      <EmptyState message={tab.message || ""} icon={tab.icon} />
    ),
  }));

  return (
    <PageContainer>
      <PageHeader title={title} />
      <Tabs
        tabs={tabsWithContent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </PageContainer>
  );
};
