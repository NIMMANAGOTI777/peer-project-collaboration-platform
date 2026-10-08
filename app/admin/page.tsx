'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  AlertTriangle,
  Tags,
  Send,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentProjects(data.recentProjects || []);
        setRecentUsers(data.recentUsers || []);
        setRecentRequests(data.recentRequests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" />
            Administrative Governance Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Platform Moderation & System Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time monitoring, user management, project governance, and platform compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/users"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-colors"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/reports"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Reports ({stats?.pendingReports || 0})
          </Link>
        </div>
      </div>

      {/* 7 Metric Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            {stats?.activeUsers || 0} active · {stats?.totalStudents || 0} students
          </p>
        </div>

        {/* Total Projects */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Projects</span>
            <FolderKanban className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-2">{stats?.totalProjects || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.activeProjects || 0} active listings
          </p>
        </div>

        {/* Formed Teams */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Teams</span>
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">{stats?.totalTeams || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.activeTeams || 0} active squads
          </p>
        </div>

        {/* Pending Requests */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <Send className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400 mt-2">{stats?.pendingRequests || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.totalRequests || 0} total exchanges
          </p>
        </div>

        {/* Pending Reports */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Pending Reports</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-2">{stats?.pendingReports || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.resolvedReports || 0} resolved
          </p>
        </div>

        {/* Platform Skills */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curated Skills</span>
            <Tags className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400 mt-2">{stats?.totalSkills || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Taxonomy entries</p>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Tasks</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 mt-2">{stats?.totalTasks || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.completedTasks || 0} completed
          </p>
        </div>

        {/* Quick Admin Settings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Matching Weights</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Skill 60% · Interest 20%</p>
            <p className="text-[11px] text-slate-400">Avail 10% · Exp 10%</p>
          </div>
          <Link href="/admin/settings" className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1 mt-2">
            Configure formula →
          </Link>
        </div>
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-amber-400" />
              Recently Created Projects
            </h3>
            <Link href="/admin/projects" className="text-xs font-semibold text-amber-400 hover:underline">
              View All Projects →
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentProjects.map((p) => (
              <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    Lead: {p.owner.name} ({p.owner.email}) · {p.category}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              Recently Registered Students
            </h3>
            <Link href="/admin/users" className="text-xs font-semibold text-amber-400 hover:underline">
              View All Users →
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{u.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {u.email} · {u.profile?.department || 'CSE'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 shrink-0">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
