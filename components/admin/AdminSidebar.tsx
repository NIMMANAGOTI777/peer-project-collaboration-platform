'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  AlertTriangle,
  Tags,
  Send,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

const adminNavItems = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Project Moderation', href: '/admin/projects', icon: FolderKanban },
  { name: 'Incident Reports', href: '/admin/reports', icon: AlertTriangle },
  { name: 'Skills Taxonomy', href: '/admin/skills', icon: Tags },
  { name: 'Request Audits', href: '/admin/requests', icon: Send },
  { name: 'Platform Settings', href: '/admin/settings', icon: SlidersHorizontal },
];

export default function AdminSidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-100 p-4">
      <div className="space-y-6">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            Governance Navigation
          </p>
          <p className="text-xs text-slate-300 font-medium mt-0.5">Admin Control Center</p>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <ExternalLink className="h-4 w-4 text-indigo-400" />
          Exit to Student App
        </Link>
      </div>
    </aside>
  );
}
