import React from 'react';
import { RoleCategory } from '../../types';

export const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: RoleCategory | 'default' }) => {
  const variants: Record<string, string> = {
    default: 'bg-zinc-800 text-zinc-300',
    Town: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Mafia: 'bg-red-500/10 text-red-500 border-red-500/20',
    Killer: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    Neutral: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    Shifter: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  };
  return (
    <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-tight transition-colors ${variants[variant as string] || variants.default} ${className}`} {...props} />
  );
};
