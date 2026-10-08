'use client';

import React, { useState, useEffect } from 'react';
import {
  Github,
  Star,
  GitFork,
  AlertCircle,
  GitCommit,
  ExternalLink,
  RefreshCw,
  Code2,
  CheckCircle2,
  Link2,
} from 'lucide-react';
import { GitHubRepoDetails } from '@/lib/github/githubService';

interface GitHubRepoViewProps {
  projectId: string;
  initialRepoUrl?: string | null;
  canManage?: boolean;
}

export default function GitHubRepoView({
  projectId,
  initialRepoUrl,
  canManage = true,
}: GitHubRepoViewProps) {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl || '');
  const [repoData, setRepoData] = useState<GitHubRepoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialRepoUrl) {
      loadRepoDetails(initialRepoUrl);
    }
  }, [initialRepoUrl]);

  const loadRepoDetails = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repository?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setRepoData(data.repository);
      } else {
        setError('Failed to fetch GitHub repository details');
      }
    } catch (e: any) {
      setError(e.message || 'Error loading repo');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setConnecting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/github/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          githubUrl: repoUrl.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRepoData(data.details);
        setSuccessMsg('GitHub repository connected successfully!');
      } else {
        setError(data.error || 'Failed to connect repository');
      }
    } catch (e: any) {
      setError(e.message || 'Error connecting repository');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connect/Update Form */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Github className="h-5 w-5 text-slate-800" />
          <h3 className="text-sm font-bold text-slate-900">
            {repoData ? 'Connected GitHub Repository' : 'Link GitHub Repository'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Link your project source code repository to track commits, stars, forks, and codebase activity.
        </p>

        {canManage && (
          <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://github.com/username/project-repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={connecting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all"
            >
              {connecting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Save & Sync Repo'
              )}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Repository Stats Card */}
      {repoData && (
        <div className="space-y-4">
          {/* Mock/Live status alert */}
          {repoData.isMock ? (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <Code2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Offline / Fallback Demonstration Mode:</span>
                <span className="ml-1 text-slate-600">
                  Using mock repository metadata and commit history. Configure <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono text-[11px]">GITHUB_TOKEN</code> in <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> for unlimited live GitHub REST API sync.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Live GitHub REST API Synchronized</span>
            </div>
          )}

          {/* Repo main overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-slate-800" />
                  <h4 className="text-base font-bold text-slate-900 font-mono">
                    {repoData.fullName}
                  </h4>
                </div>
                <p className="mt-1 text-xs text-slate-600 max-w-xl leading-relaxed">
                  {repoData.description}
                </p>
              </div>

              <a
                href={repoData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0"
              >
                <span>View on GitHub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>Stars</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{repoData.stars}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <GitFork className="h-3.5 w-3.5 text-blue-500" />
                  <span>Forks</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{repoData.forks}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <AlertCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Open Issues</span>
                </div>
                <span className="text-lg font-bold text-slate-900">{repoData.openIssues}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Code2 className="h-3.5 w-3.5 text-purple-500" />
                  <span>Primary Language</span>
                </div>
                <span className="text-sm font-bold text-slate-900 truncate block">
                  {repoData.language}
                </span>
              </div>
            </div>

            {/* Recent Commits Stream */}
            {repoData.recentCommits && repoData.recentCommits.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <GitCommit className="h-4 w-4 text-slate-500" />
                  Recent Commit Activity
                </h5>
                <div className="space-y-2.5">
                  {repoData.recentCommits.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                          {c.sha}
                        </span>
                        <p className="font-medium text-slate-800 truncate">{c.message}</p>
                      </div>
                      <div className="text-right shrink-0 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-600 block">{c.author}</span>
                        <span>{new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
