'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/components/auth/AuthContext';
import { X, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span>Verifying administrative authorization...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated or non-admin user
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-100 shadow-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-white">Administrator Access Required</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            This governance and moderation area is restricted strictly to platform administrators.
            {user ? ' Your current account is logged in as a STUDENT.' : ' You are currently not logged in.'}
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left">
            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              Demo Administrator Credentials
            </p>
            <p className="text-slate-400">Email: <code className="text-amber-400 font-mono">admin@example.com</code></p>
            <p className="text-slate-400">Password: <code className="text-amber-400 font-mono">Admin@123</code></p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Link
              href="/login"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              Sign In as Admin <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 shadow-2xl border-r border-slate-800">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Admin Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AdminSidebar onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
