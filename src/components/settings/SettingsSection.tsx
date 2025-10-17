import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  columns?: 2 | 4;
}

export const SettingsSection = ({
  title,
  children,
  columns = 2,
}: SettingsSectionProps) => {
  const gridClasses =
    columns === 4
      ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
      : "grid grid-cols-1 lg:grid-cols-2 gap-6";

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className={gridClasses}>{children}</div>
    </section>
  );
};
