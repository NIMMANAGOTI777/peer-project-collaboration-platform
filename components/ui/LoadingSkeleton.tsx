import React from 'react';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-24 bg-slate-200 rounded-md" />
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-2" />
      <div className="h-4 w-full bg-slate-100 rounded-md mb-4" />
      <div className="h-4 w-2/3 bg-slate-100 rounded-md mb-6" />
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-slate-200 rounded-lg" />
        <div className="h-6 w-16 bg-slate-200 rounded-lg" />
        <div className="h-6 w-16 bg-slate-200 rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="h-8 w-28 bg-slate-200 rounded-full" />
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 px-6 flex items-center justify-between">
            <div className="h-4 w-1/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/6 bg-slate-100 rounded" />
            <div className="h-4 w-1/6 bg-slate-200 rounded" />
            <div className="h-4 w-1/12 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
