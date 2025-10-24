import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-[#E5CD9F] bg-white px-4 py-2 text-sm text-[#333A1A] placeholder:text-[#9C7750]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A50C0A] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

