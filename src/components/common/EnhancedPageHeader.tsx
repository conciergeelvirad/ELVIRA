import { LucideIcon } from "lucide-react";

interface EnhancedPageHeaderProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
}

export function EnhancedPageHeader({
  title,
  icon: Icon,
  description,
}: EnhancedPageHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-6 h-6 text-gray-500" />}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );
}
