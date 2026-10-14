'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sparkles,
  Shield,
  GraduationCap,
  RotateCcw,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DEMO_COOKIE_NAME, resetDemoState } from '@/lib/demo/demoState';
import { isDemoModeActive, showDemoToast } from '@/lib/demo/demoInterceptor';
import { useAuth } from '@/components/auth/AuthContext';

export default function DemoBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const { enterDemo, exitDemo } = useAuth();
  const [demoInfo, setDemoInfo] = useState<{ isDemo: boolean; role: 'STUDENT' | 'ADMIN' | null }>({
    isDemo: false,
    role: null,
  });

  useEffect(() => {
    setDemoInfo(isDemoModeActive());
  }, [pathname]);

  if (!demoInfo.isDemo || !demoInfo.role) return null;

  const isStudent = demoInfo.role === 'STUDENT';

  const handleSwitchRole = (newRole: 'STUDENT' | 'ADMIN') => {
    enterDemo(newRole);
  };

  const handleResetData = () => {
    if (confirm('Reset demo state to initial seed dataset? (All simulated tasks and requests will be restored to defaults)')) {
      resetDemoState();
      showDemoToast('Demo dataset reset to initial state.', 'success');
      window.location.reload();
    }
  };

  const handleExitDemo = () => {
    exitDemo();
  };

  return (
    <div
      role="banner"
      aria-label="Demo Mode Notification Banner"
      className="sticky top-0 z-50 w-full border-b border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-2 text-white shadow-md backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Mode Title */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-2 font-bold tracking-tight">
            {isStudent ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                Student Demo Mode
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                Admin Demo Mode (Read-Only Sandbox)
              </span>
            )}
            <span className="hidden md:inline text-slate-300 font-normal">
              {isStudent
                ? 'Exploring as Karthik Rao (B.Tech CSE) · Full interaction enabled'
                : 'Exploring as Dr. Ramesh Kumar · Platform governance view'}
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isStudent ? (
            <button
              onClick={() => handleSwitchRole('ADMIN')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold transition-colors"
              title="Switch to Admin Console Demo"
            >
              <Shield className="h-3 w-3" />
              <span>Switch to Admin</span>
            </button>
          ) : (
            <button
              onClick={() => handleSwitchRole('STUDENT')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-semibold transition-colors"
              title="Switch to Student Dashboard Demo"
            >
              <GraduationCap className="h-3 w-3" />
              <span>Switch to Student</span>
            </button>
          )}

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-colors"
            title="Reset demo tasks, teams, and requests to initial sample state"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>

          <button
            onClick={handleExitDemo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold transition-colors"
            title="Exit demo and return to public platform"
          >
            <LogOut className="h-3 w-3" />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
