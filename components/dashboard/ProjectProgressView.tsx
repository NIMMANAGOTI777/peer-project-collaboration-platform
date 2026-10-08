'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Github,
  Award,
  Layers,
} from 'lucide-react';

interface ProjectProgressViewProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    progressPercentage: number;
    priorityBreakdown: {
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
    isGitHubConnected: boolean;
    repository?: any;
  };
  project: {
    title: string;
    category: string;
    preferredTeamSize: number;
    currentTeamSize: number;
  };
  memberContributions: Array<{
    userId: string;
    name: string;
    completed: number;
    total: number;
    percentage: number;
    avatarUrl?: string;
  }>;
}

export default function ProjectProgressView({
  stats,
  project,
  memberContributions,
}: ProjectProgressViewProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner: Big Progress Circular & Summary Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Gauge Card */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Project Health & Completion
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">{project.title}</h3>
          </div>

          <div className="my-6 flex items-center gap-6">
            {/* Radial Percentage indicator */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/10 border-4 border-indigo-400/40">
              <div className="text-center">
                <span className="text-3xl font-black text-white">{stats.progressPercentage}%</span>
                <span className="block text-[10px] uppercase font-bold text-indigo-200">Done</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-200 font-medium">
                  {stats.completedTasks} / {stats.totalTasks} Tasks Finished
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-200 font-medium">
                  {stats.inProgressTasks} In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-200 font-medium">
                  {stats.pendingTasks} Pending / To Do
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200">
            <span>Team: {project.currentTeamSize} / {project.preferredTeamSize} Members</span>
            <span>GitHub: {stats.isGitHubConnected ? 'Connected' : 'Not Linked'}</span>
          </div>
        </div>

        {/* 4 Grid Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.totalTasks}</p>
              <p className="text-xs font-semibold text-slate-500">Total Tasks</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.completedTasks}</p>
              <p className="text-xs font-semibold text-slate-500">Completed</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.inProgressTasks}</p>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{project.currentTeamSize}</p>
              <p className="text-xs font-semibold text-slate-500">Active Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts & Contribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Priority Breakdown Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Task Priority Distribution
          </h4>

          <div className="space-y-4">
            {/* High Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> High Priority
                </span>
                <span>{stats.priorityBreakdown.HIGH} Tasks</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.priorityBreakdown.HIGH / stats.totalTasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium Priority
                </span>
                <span>{stats.priorityBreakdown.MEDIUM} Tasks</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.priorityBreakdown.MEDIUM / stats.totalTasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> Low Priority
                </span>
                <span>{stats.priorityBreakdown.LOW} Tasks</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.priorityBreakdown.LOW / stats.totalTasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Member Contribution Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-600" />
            Team Member Milestone Contribution
          </h4>

          <div className="space-y-4">
            {memberContributions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No assigned task records yet.</p>
            ) : (
              memberContributions.map((m) => (
                <div key={m.userId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="h-5 w-5 rounded-full object-cover" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-slate-500 font-medium">
                      {m.completed}/{m.total} completed ({m.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${m.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
