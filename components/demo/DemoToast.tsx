'use client';

import React, { useEffect, useState } from 'react';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export default function DemoToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (customEvent.detail) {
        const item = customEvent.detail;
        setToasts((prev) => [...prev, item]);

        // Auto remove after 5.5 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== item.id));
        }, 5500);
      }
    };

    window.addEventListener('peer-collab-demo-toast', handleToastEvent);
    return () => {
      window.removeEventListener('peer-collab-demo-toast', handleToastEvent);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-800'
              : 'bg-slate-900/95 text-slate-100 border-indigo-500/40'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            ) : (
              <Info className="h-4 w-4 text-indigo-400" />
            )}
          </div>
          <div className="flex-1 text-xs leading-relaxed font-medium">
            <span className="font-bold block text-[10px] tracking-wide uppercase opacity-75">
              Simulated Interaction
            </span>
            {toast.message}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
