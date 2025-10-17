import { ReactNode } from "react";
import { cn } from "../../../utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  toolbar,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {toolbar && <div className="mt-4">{toolbar}</div>}
    </div>
  );
};
