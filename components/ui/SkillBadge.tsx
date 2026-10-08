import React from 'react';

interface SkillBadgeProps {
  name: string;
  proficiency?: string;
  category?: string;
  variant?: 'default' | 'matched' | 'missing' | 'outline';
  size?: 'sm' | 'md';
}

export default function SkillBadge({
  name,
  proficiency,
  variant = 'default',
  size = 'sm',
}: SkillBadgeProps) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'matched') {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold';
  } else if (variant === 'missing') {
    badgeStyle = 'bg-rose-50 text-rose-600 border-rose-200/80 font-medium';
  } else if (variant === 'outline') {
    badgeStyle = 'bg-transparent text-slate-700 border-slate-300';
  } else {
    badgeStyle = 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60 font-medium';
  }

  const sizeStyle = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${badgeStyle} ${sizeStyle} transition-all`}
    >
      {variant === 'matched' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {variant === 'missing' && <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />}
      <span>{name}</span>
      {proficiency && (
        <span className="text-[10px] opacity-75 font-normal uppercase tracking-wider">
          • {proficiency.toLowerCase()}
        </span>
      )}
    </span>
  );
}
