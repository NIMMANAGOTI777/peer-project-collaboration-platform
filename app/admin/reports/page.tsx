'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
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
        fetchReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Platform Reports & Moderation
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Review user-submitted reports regarding inappropriate projects or conduct.
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : reports.length === 0 ? (
          <EmptyState
            title="No Flagged Reports"
            description="The platform is in healthy standing with zero pending moderation reports."
          />
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        r.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700'
                          : r.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Filed by {r.reporter.name} ({r.reporter.email})
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{r.reason}"
                  </p>

                  {r.project && (
                    <p className="text-[11px] text-slate-500">
                      Target Project: <span className="font-semibold text-slate-700">{r.project.title}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {r.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateReport(r.id, 'RESOLVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleUpdateReport(r.id, 'DISMISSED')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
