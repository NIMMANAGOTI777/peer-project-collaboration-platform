'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Users2,
  Bell,
  UserCheck,
  Settings,
  ShieldAlert,
  PlusCircle,
} from 'lucide-react';

const studentNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Discover Projects', href: '/projects', icon: Compass },
  { name: 'Teammate Matches', href: '/matches', icon: Sparkles },
  { name: 'Collaboration Requests', href: '/collaboration-requests', icon: Users2 },
  { name: 'My Profile & Skills', href: '/profile', icon: UserCheck },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Account Settings', href: '/settings', icon: Settings },
];

export default function StudentSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white p-4">
      <div className="space-y-6">
        {/* Student Mini Card */}
        {user && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.profile?.department || 'CSE Student'}</p>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <Link
          href="/projects/create"
          onClick={onItemClick}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-indigo-800 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Project
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Student Menu
          </p>
          {studentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/projects'
                ? pathname === '/projects' || (pathname.startsWith('/projects/') && !pathname.includes('/create'))
                : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100/80 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin shortcut if user is an ADMIN viewing the student platform */}
      {user?.role === 'ADMIN' && (
        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/admin"
            onClick={onItemClick}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            Switch to Admin Panel
          </Link>
        </div>
      )}
    </aside>
  );
}
