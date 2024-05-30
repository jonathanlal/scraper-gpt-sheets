import * as React from 'react';
import { Loader2Icon } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputWIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactElement;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean; // New prop
  destructive?: boolean; // New prop
}

const InputWIcon = React.forwardRef<HTMLInputElement, InputWIconProps>(
  (
    {
      className,
      icon,
      iconPosition = 'left',
      isLoading,
      destructive,
      ...props
    },
    ref
  ) => {
    // Conditionally choose the icon
    const iconToShow = isLoading ? (
      <Loader2Icon className="animate-spin h-5 w-5 text-gray-400" />
    ) : (
      React.cloneElement(icon, {
        className: cn('h-5 w-5 text-gray-400', icon.props.className),
      })
    );

    return (
      <div className="relative flex items-center flex-1">
        {iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {iconToShow}
          </div>
        )}
        <input
          className={cn(
            'h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'pl-10': iconPosition === 'left',
              'pr-10': iconPosition === 'right',
            },
            destructive &&
              'border-destructive placeholder-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {iconToShow}
          </div>
        )}
      </div>
    );
  }
);

InputWIcon.displayName = 'InputWIcon';

export { InputWIcon };
