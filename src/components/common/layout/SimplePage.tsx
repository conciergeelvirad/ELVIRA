import { LucideIcon } from "lucide-react";
import { PageContainer, PageHeader } from "../layout";
import { EmptyState } from "../ui";

interface SimplePageProps {
  title: string;
  message: string;
  icon: LucideIcon;
}

export const SimplePage = ({ title, message, icon }: SimplePageProps) => {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <EmptyState message={message} icon={icon} />
    </PageContainer>
  );
};
