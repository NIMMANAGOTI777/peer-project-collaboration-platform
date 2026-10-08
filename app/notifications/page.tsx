'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Users2,
  Github,
  CheckSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'COLLABORATION_REQUEST':
        return <Users2 className="h-4 w-4 text-indigo-600" />;
      case 'REQUEST_ACCEPTED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'TASK_ASSIGNED':
        return <CheckSquare className="h-4 w-4 text-amber-600" />;
      case 'GITHUB_CONNECTED':
        return <Github className="h-4 w-4 text-slate-800" />;
      default:
        return <Bell className="h-4 w-4 text-indigo-600" />;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-indigo-600" />
              Platform Notifications
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Real-time updates regarding collaboration requests, team invites, and task assignments.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Mark All as Read ({unreadCount})
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="No Notifications Yet"
            description="You're all caught up! Notifications regarding team requests and task milestones will appear here."
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card divide-y divide-slate-100 overflow-hidden">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.readStatus ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => !n.readStatus && markSingleRead(n.id)}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                  {!n.readStatus && (
                    <button
                      onClick={() => markSingleRead(n.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 text-[11px]"
                      title="Mark as read"
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
    </AppLayout>
  );
}
