'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MatchCard from '@/components/ui/MatchCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Sparkles, Filter, FolderKanban, Users2, ArrowUpDown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function MatchesPage() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'best' | 'experience' | 'skills'>('best');

  useEffect(() => {
    fetchMyProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMatches(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchMyProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        const userProjects = (data.projects || []).filter(
          (p: any) => p.ownerId === user?.id || p.team?.members.some((m: any) => m.userId === user?.id)
        );
        setMyProjects(userProjects);
        if (userProjects.length > 0) {
          setSelectedProjectId(userProjects[0].id);
        } else if (data.projects && data.projects.length > 0) {
          // Fallback to first project
          setSelectedProjectId(data.projects[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (pId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${pId}/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Sort matches
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'best') return b.totalScore - a.totalScore;
    if (sortBy === 'skills') return b.skillMatch - a.skillMatch;
    if (sortBy === 'experience') return b.experienceMatch - a.experienceMatch;
    return 0;
  });

  const currentProject = myProjects.find((p) => p.id === selectedProjectId);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              Recommended Teammates
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Deterministic skill-matching engine ranking students by compatibility score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Selector */}
            {myProjects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Matching for:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-indigo-700 focus:ring-1 focus:ring-indigo-500"
                >
                  {myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort select */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSortBy('best')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  sortBy === 'best'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Best Match
              </button>
              <button
                onClick={() => setSortBy('skills')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  sortBy === 'skills'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Top Skills
              </button>
              <button
                onClick={() => setSortBy('experience')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  sortBy === 'experience'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Most Experienced
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Formula Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950">
          <div>
            <span className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Explainable Recommendation Engine
            </span>
            <span className="text-slate-600 text-[11px]">
              Compatibility = 0.60 × Skill Match + 0.20 × Domain Interest + 0.10 × Availability + 0.10 × Experience
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white shrink-0 self-start sm:self-auto">
            Deterministic Evaluation
          </span>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : sortedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMatches.map((m) => (
              <MatchCard
                key={m.userId}
                match={m}
                projectId={selectedProjectId}
                projectTitle={currentProject?.title}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Candidate Matches Found"
            description="Create or select an active project with required skill tags to calculate compatibility rankings."
            actionText="Create a Project"
            actionHref="/projects/create"
          />
        )}
      </div>
    </AppLayout>
  );
}
