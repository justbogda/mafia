import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium text-zinc-200 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
);
