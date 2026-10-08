'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import {
  FolderKanban,
  CheckCircle2,
  Users2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  AlertCircle,
  Bell,
  Calendar,
} from 'lucide-react';
import ProjectCard from '@/components/ui/ProjectCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard/student');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Track your academic collaboration milestones, explore teammate matches, and manage tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/matches"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Find Teammates
            </Link>
            <Link
              href="/projects/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              New Project
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Active Projects</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FolderKanban className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              {data?.summary?.activeProjectsCount ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Collaborating & Owned</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Open Tasks</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              {data?.summary?.openTasksCount ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Assigned to you</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Pending Requests</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Users2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              {data?.summary?.pendingRequestsCount ?? 0}
            </p>
            <Link
              href="/collaboration-requests"
              className="mt-1 inline-block text-[11px] font-semibold text-emerald-600 hover:underline"
            >
              Review incoming requests →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Unread Alerts</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Bell className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              {data?.summary?.unreadNotificationsCount ?? 0}
            </p>
            <Link
              href="/notifications"
              className="mt-1 inline-block text-[11px] font-semibold text-rose-600 hover:underline"
            >
              View notifications →
            </Link>
          </div>
        </div>

        {/* Section 1: Recommended Projects For You */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Recommended Projects For You
              </h2>
              <p className="text-xs text-slate-500">
                Matched automatically using your skills, interests, and availability.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : data?.recommendedProjects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommendedProjects.slice(0, 4).map((p: any) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              Complete your profile with technical skills to get smart project recommendations.
            </div>
          )}
        </div>

        {/* Section 2: My Projects & Upcoming Tasks Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-600" />
                My Active Projects
              </h3>
              <Link href="/projects/create" className="text-xs font-semibold text-indigo-600 hover:underline">
                + Create Another
              </Link>
            </div>

            {data?.myProjects?.length > 0 ? (
              <div className="space-y-3">
                {data.myProjects.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-card hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{p.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          {p.role}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
                        <span>{p.teamSize} / {p.preferredTeamSize} Members</span>
                        <span>{p.progress}% Completed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${p.id}/tasks`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Tasks
                      </Link>
                      <Link
                        href={`/projects/${p.id}/dashboard`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                You have not created or joined any projects yet.
              </div>
            )}
          </div>

          {/* Upcoming Tasks & Recent Notifications */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Upcoming Assigned Tasks
              </h3>
              {data?.upcomingTasks?.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {data.upcomingTasks.map((t: any) => (
                    <div key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                      <p className="text-xs font-bold text-slate-800">{t.title}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{t.project.title}</span>
                        {t.dueDate && (
                          <span className="font-semibold text-indigo-600">
                            Due: {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3">No pending tasks due.</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-600" />
                Recent Activity
              </h3>
              {data?.recentActivity?.length > 0 ? (
                <div className="space-y-3">
                  {data.recentActivity.map((a: any) => (
                    <div key={a.id} className="text-xs">
                      <p className="text-slate-700 font-medium leading-relaxed">{a.message}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3">No recent updates.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
