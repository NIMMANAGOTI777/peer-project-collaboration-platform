'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  AlertTriangle,
  Tags,
  Send,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';

const adminNavItems = [
  { name: 'Admin Overview', href: '/admin', icon: ShieldAlert },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Project Moderation', href: '/admin/projects', icon: FolderKanban },
  { name: 'Reports & Flagged', href: '/admin/reports', icon: AlertTriangle },
  { name: 'Skills Registry', href: '/admin/skills', icon: Tags },
  { name: 'Platform Requests', href: '/admin/requests', icon: Send },
  { name: 'Platform Settings', href: '/admin/settings', icon: SlidersHorizontal },
];

export default function AdminSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-slate-900 text-slate-100 p-4">
      <div className="space-y-6">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" />
            Admin Moderation
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Platform Control & Governance</p>
        </div>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Student View
        </Link>
      </div>
    </aside>
  );
}
