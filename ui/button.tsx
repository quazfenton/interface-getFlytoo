import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
          ${variant === 'destructive' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
          ${variant === 'outline' ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100' : ''}
          ${variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
          ${variant === 'ghost' ? 'bg-transparent text-gray-700 hover:bg-gray-100' : ''}
          ${variant === 'link' ? 'bg-transparent text-blue-600 hover:underline' : ''}
          ${variant === 'default' || !variant ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
          ${size === 'sm' ? 'px-3 py-1.5 text-xs' : ''}
          ${size === 'lg' ? 'px-5 py-2.5 text-base' : ''}
          ${size === 'icon' ? 'p-2' : ''}
          ${className || ''}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };