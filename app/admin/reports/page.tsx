'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/admin/reports?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setActionSuccess(`Report status set to ${status}.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            Platform Moderation & Incident Reports
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Review and resolve student-submitted moderation tickets, policy violations, and project flags.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {['ALL', 'PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : reports.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Reports Matching Filter</h3>
          <p className="text-xs text-slate-400 mt-1">
            There are currently no reports in the "{statusFilter}" queue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      r.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : r.status === 'REVIEWED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : r.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {r.status}
                  </span>

                  <span className="text-xs font-bold text-slate-200">
                    Reporter: {r.reporter.name} ({r.reporter.email})
                  </span>

                  <span className="text-[10px] text-slate-500 ml-auto sm:ml-0">
                    {new Date(r.createdAt).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Reported Reason / Incident Details:
                  </span>
                  <p className="text-xs text-slate-200 italic leading-relaxed">
                    "{r.reason}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  {r.project && (
                    <p>
                      Target Project: <span className="font-bold text-white">{r.project.title}</span>
                    </p>
                  )}
                  {r.targetUser && (
                    <p>
                      Reported User: <span className="font-bold text-white">{r.targetUser.name} ({r.targetUser.email})</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                {r.status !== 'REVIEWED' && r.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateReport(r.id, 'REVIEWED')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Mark Reviewed
                  </button>
                )}

                {r.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateReport(r.id, 'RESOLVED')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm shadow-emerald-600/30"
                  >
                    Resolve Incident
                  </button>
                )}

                {r.status !== 'DISMISSED' && (
                  <button
                    onClick={() => handleUpdateReport(r.id, 'DISMISSED')}
                    className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
