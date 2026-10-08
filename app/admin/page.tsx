'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  AlertTriangle,
  Tags,
  Send,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.status === 403 || res.status === 401) {
        setUnauthorized(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentProjects(data.recentProjects || []);
        setRecentUsers(data.recentUsers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (unauthorized) {
    return (
      <AppLayout>
        <div className="p-12 text-center max-w-md mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mx-auto mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-500 mt-1">
            You must be logged in as an administrator to access the moderation console.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left">
            <span className="font-bold text-slate-700 block mb-1">Demo Admin Credentials:</span>
            Email: <code className="font-mono text-indigo-600">admin@example.com</code><br />
            Password: <code className="font-mono text-indigo-600">Admin@123</code>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Switch to Admin Account
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              Administrative Governance
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Platform Moderation Overview
            </h1>
            <p className="text-xs text-slate-500">
              Real-time monitoring, user management, project approvals, and platform compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/reports"
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-400"
            >
              Review Reports ({stats?.pendingReports || 0})
            </Link>
          </div>
        </div>

        {/* 6 Key Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Users</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stats?.totalStudents} Students</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-slate-400">Projects</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.totalProjects}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">8 Academic listings</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-slate-400">Active Teams</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.activeTeams}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Formed squads</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Tasks</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalTasks}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Kanban milestones</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-slate-400">Platform Skills</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalSkills}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Curated taxonomy</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-card">
            <span className="text-[10px] font-bold uppercase text-amber-800">Pending Reports</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{stats?.pendingReports}</p>
            <p className="text-[10px] text-amber-700 mt-0.5">Needs review</p>
          </div>
        </div>

        {/* Two-Column Recent Activity Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-600" />
                Recently Created Projects
              </h3>
              <Link href="/admin/projects" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentProjects.map((p) => (
                <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Owner: {p.owner.name} ({p.owner.email}) · {p.category}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Recently Registered Students
              </h3>
              <Link href="/admin/users" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <div key={u.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {u.email} · {u.profile?.department || 'CSE'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 shrink-0">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
