'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
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
    <AppLayout>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Send className="h-6 w-6 text-indigo-600" />
            Platform Collaboration Requests Audit
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Audit all collaboration requests, proposals, and team invitations exchanged across the university.
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Sender</th>
                    <th className="py-3.5 px-4">Receiver</th>
                    <th className="py-3.5 px-4">Message</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {r.project.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{r.sender.name}</span>
                        <span className="block text-[10px] text-slate-400">{r.sender.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{r.receiver.name}</span>
                        <span className="block text-[10px] text-slate-400">{r.receiver.email}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 italic">
                        "{r.message}"
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            r.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700'
                              : r.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[10px]">
                        {new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
