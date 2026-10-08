'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 sm:px-6 text-slate-100 shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Toggle admin navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">Admin Console</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Governance
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400">Peer Collaboration Platform</p>
          </div>
        </Link>
      </div>

      {/* Center status pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-emerald-400">System Healthy</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">Prisma Engine Active</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Student View</span>
        </Link>

        {/* Admin user dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-white max-w-[120px] truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="block text-[10px] text-amber-400 font-semibold uppercase">Admin</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl py-1.5 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Role: ADMIN
                </span>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Platform Settings
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-indigo-300 hover:bg-slate-800 hover:text-indigo-200"
              >
                Switch to Student Portal
              </Link>

              <div className="border-t border-slate-800 my-1" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
