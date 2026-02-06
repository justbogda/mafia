import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
      outline: 'border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300',
      ghost: 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.2)]',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-8',
      icon: 'h-9 w-9',
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
