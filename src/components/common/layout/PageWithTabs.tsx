import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { Tabs } from "../ui/Tabs";

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

interface PageWithTabsProps {
  title: string;
  tabs: TabConfig[];
  defaultTab?: string;
  toolbar?: React.ReactNode;
  className?: string;
}

export const PageWithTabs = ({
  title,
  tabs,
  defaultTab,
  toolbar,
  className,
}: PageWithTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const tabsData = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    content: tab.content,
  }));

  return (
    <PageContainer className={className}>
      <PageHeader title={title} toolbar={toolbar} />
      <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} />
    </PageContainer>
  );
};
