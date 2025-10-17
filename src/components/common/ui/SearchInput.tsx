import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from "../../../utils";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearchChange?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = 'Search...', onSearchChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onSearchChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full',
            'text-sm text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200',
            className
          )}
          placeholder={placeholder}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
