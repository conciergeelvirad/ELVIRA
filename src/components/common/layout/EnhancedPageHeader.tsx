import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

interface EnhancedPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}

export const EnhancedPageHeader = (props: EnhancedPageHeaderProps) => {
  return <PageHeader {...props} />;
};
