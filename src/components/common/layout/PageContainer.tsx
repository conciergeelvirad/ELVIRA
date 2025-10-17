import { ReactNode } from 'react';
import { cn } from "../../../utils";

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const maxWidthStyles = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
};

export const PageContainer = ({ children, maxWidth = 'full', className }: PageContainerProps) => {
  return (
    <div className={cn('p-8 w-full', maxWidthStyles[maxWidth], className)}>
      {children}
    </div>
  );
};
