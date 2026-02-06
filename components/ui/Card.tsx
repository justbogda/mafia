import React from 'react';

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-sm backdrop-blur-sm ${className}`} {...props} />
);
