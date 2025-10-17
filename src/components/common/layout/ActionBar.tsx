import { ReactNode } from 'react';
import { cn } from "../../../utils";

interface ActionBarProps {
  children: ReactNode;
  className?: string;
}

export const ActionBar = ({ children, className }: ActionBarProps) => {
  return (
    <div className={cn('flex items-center justify-between gap-4 w-full', className)}>
      {children}
    </div>
  );
};

interface ActionBarSectionProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const ActionBarSection = ({ children, className, align = 'left' }: ActionBarSectionProps) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={cn('flex items-center gap-2', alignStyles[align], className)}>
      {children}
    </div>
  );
};

ActionBar.Section = ActionBarSection;
