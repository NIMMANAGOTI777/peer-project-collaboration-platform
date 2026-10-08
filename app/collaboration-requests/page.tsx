'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Users2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Inbox,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import Link from 'next/link';

export default function CollaborationRequestsPage() {
  const { user } = useAuth();
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/collaboration-requests');
      if (res.ok) {
        const data = await res.json();
        setReceived(data.received || []);
        setSent(data.sent || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/collaboration-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchRequests();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update request');
      }
    } catch (e) {
      alert('Error updating request');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  const pendingReceivedCount = received.filter((r) => r.status === 'PENDING').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users2 className="h-6 w-6 text-indigo-600" />
              Collaboration Requests
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage student invitations and project applications in real-time.
            </p>
          </div>
        </div>

        {/* Received / Sent Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'received'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Received Requests</span>
            {pendingReceivedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sent'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Sent Invitations ({sent.length})</span>
          </button>
        </div>

        {/* Tab 1: RECEIVED REQUESTS */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {received.length === 0 ? (
              <EmptyState
                title="No Received Collaboration Requests"
                description="When students or project leads invite you to collaborate, their requests will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {received.map((req) => {
                  const isPending = req.status === 'PENDING';
                  const isAccepted = req.status === 'ACCEPTED';
                  const isRejected = req.status === 'REJECTED';

                  return (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                            {req.project.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isPending
                                ? 'bg-amber-50 text-amber-700'
                                : isAccepted
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {/* Sender info */}
                        <div className="flex items-center gap-3 mb-3">
                          {req.sender.profile?.avatarUrl ? (
                            <img
                              src={req.sender.profile.avatarUrl}
                              alt={req.sender.name}
                              className="h-10 w-10 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                              {req.sender.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{req.sender.name}</h4>
                            <p className="text-[11px] text-slate-500">{req.sender.email}</p>
                          </div>
                        </div>

                        {/* Message body */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                          "{req.message}"
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>

                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={actionLoading === req.id}
                              onClick={() => handleUpdateRequest(req.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                            >
                              Reject
                            </button>
                            <button
                              disabled={actionLoading === req.id}
                              onClick={() => handleUpdateRequest(req.id, 'ACCEPTED')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
                            >
                              Accept & Join Team
                            </button>
                          </div>
                        ) : isAccepted ? (
                          <Link
                            href={`/projects/${req.projectId}/team`}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>Go to Team</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Declined</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SENT REQUESTS */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sent.length === 0 ? (
              <EmptyState
                title="No Sent Invitations"
                description="Explore projects or teammate matches to send collaboration requests."
                actionText="Find Teammates"
                actionHref="/matches"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sent.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {req.project.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            req.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700'
                              : req.status === 'ACCEPTED'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        {req.receiver.profile?.avatarUrl ? (
                          <img
                            src={req.receiver.profile.avatarUrl}
                            alt={req.receiver.name}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                            {req.receiver.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Sent to: {req.receiver.name}</h4>
                          <p className="text-[11px] text-slate-500">{req.receiver.email}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                        "{req.message}"
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Sent on {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>

                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateRequest(req.id, 'CANCELLED')}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
