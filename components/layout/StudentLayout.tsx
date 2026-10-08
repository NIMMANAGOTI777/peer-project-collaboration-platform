'use client';

import React, { useState } from 'react';
import StudentHeader from '@/components/student/StudentHeader';
import StudentSidebar from '@/components/student/StudentSidebar';
import { X } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <StudentHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0">
          <StudentSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-900">Student Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <StudentSidebar onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
