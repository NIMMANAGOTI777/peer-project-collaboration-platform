'use client';

import React, { useEffect, useState } from 'react';
import { Send, CheckCircle2, XCircle, Clock, Filter, Layers } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/admin/requests?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-amber-400" />
            Collaboration Request Audit Log
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Audit peer project collaboration requests, invitations, and team formation activities across campus.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((tab) => (
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

      {/* Requests Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : requests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Send className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Collaboration Requests</h3>
          <p className="text-xs text-slate-400 mt-1">
            No requests matched the current filter "{statusFilter}".
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Sender (Candidate / Lead)</th>
                  <th className="py-3.5 px-4">Receiver</th>
                  <th className="py-3.5 px-4">Proposal / Message</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white max-w-xs truncate">{r.project.title}</p>
                      <span className="text-[10px] text-amber-400 font-semibold uppercase">{r.project.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{r.sender.name}</p>
                      <p className="text-[10px] text-slate-400">{r.sender.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{r.receiver.name}</p>
                      <p className="text-[10px] text-slate-400">{r.receiver.email}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-slate-300 italic line-clamp-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px]">
                        "{r.message}"
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          r.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : r.status === 'ACCEPTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] text-right">
                      {new Date(r.createdAt).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
