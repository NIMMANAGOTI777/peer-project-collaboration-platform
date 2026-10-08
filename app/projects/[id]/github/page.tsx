'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import GitHubRepoView from '@/components/github/GitHubRepoView';
import { ArrowLeft, Github } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function ProjectGitHubPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
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

  const isMember =
    user?.id === project?.ownerId ||
    project?.team?.members.some((m: any) => m.userId === user?.id);
  const isAdmin = user?.role === 'ADMIN';

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
                <Github className="h-5 w-5 text-slate-800" />
                {project?.title} — GitHub Repository
              </h1>
              <p className="text-xs text-slate-500">
                Track commits, stars, forks, and codebase activity through GitHub REST integration.
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

        <GitHubRepoView
          projectId={project.id}
          initialRepoUrl={project.repository?.githubUrl}
          canManage={isMember || isAdmin}
        />
      </div>
    </AppLayout>
  );
}
