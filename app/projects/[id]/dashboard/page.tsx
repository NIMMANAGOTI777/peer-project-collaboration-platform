'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProjectProgressView from '@/components/dashboard/ProjectProgressView';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDashboard();
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`/api/dashboard/${id}`);
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

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-xs text-slate-500">Unable to load project metrics.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/projects/${id}`)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                {data.project.title} — Progress Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Track completion percentages, task distribution, and individual milestones.
              </p>
            </div>
          </div>

          <Link
            href={`/projects/${id}`}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            ← Back to Project Details
          </Link>
        </div>

        <ProjectProgressView
          stats={data.stats}
          project={data.project}
          memberContributions={data.memberContributions || []}
        />
      </div>
    </AppLayout>
  );
}
