import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from "../../../utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'default' | 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
}

const variantStyles = {
  default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  solid: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700',
};

const sizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

const iconSizes = {
  sm: 16,
  md: 18,
  lg: 20,
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon: Icon, variant = 'default', size = 'md', shape = 'circle', className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          className
        )}
        {...props}
      >
        <Icon size={iconSizes[size]} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
