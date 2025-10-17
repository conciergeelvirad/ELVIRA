import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Filter } from 'lucide-react';
import { IconButton } from './IconButton';

interface FilterButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ active = false, size = 'md', className, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        icon={Filter}
        variant={active ? 'solid' : 'default'}
        size={size}
        className={className}
        {...props}
      />
    );
  }
);

FilterButton.displayName = 'FilterButton';
