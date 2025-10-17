import React, { ReactNode } from "react";

interface InputWrapperProps {
  children: React.ReactElement;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  hasAddons: boolean;
  hasIcons: boolean;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  hasAddons,
  hasIcons,
}) => {
  if (!hasAddons && !hasIcons) {
    return children;
  }

  return (
    <div className="relative flex">
      {leftAddon && (
        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {leftAddon}
        </span>
      )}

      <div className="relative flex-1">
        {leftIcon && !leftAddon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        {children}

        {rightIcon && !rightAddon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {rightAddon && (
        <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {rightAddon}
        </span>
      )}
    </div>
  );
};
