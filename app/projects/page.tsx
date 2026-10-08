'use client';

import React, { useEffect, useState, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ProjectCard from '@/components/ui/ProjectCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import { Search, Filter, PlusCircle, Compass, Sparkles, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const CATEGORIES = [
  'ALL',
  'Web Development',
  'AI/ML',
  'Mobile App',
  'Cybersecurity',
  'DevOps',
  'Tools',
  'IoT',
];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [teamSize, setTeamSize] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');

  useEffect(() => {
    fetchProjects();
  }, [search, category, status, teamSize, skillFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category !== 'ALL') params.append('category', category);
      if (status !== 'ALL') params.append('status', status);
      if (teamSize !== 'ALL') params.append('teamSize', teamSize);
      if (skillFilter !== 'ALL') params.append('skill', skillFilter);

      const res = await fetch(`/api/projects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('ALL');
    setStatus('ALL');
    setTeamSize('ALL');
    setSkillFilter('ALL');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'ALL' ||
    status !== 'ALL' ||
    teamSize !== 'ALL' ||
    skillFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header and Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-600" />
            Discover Academic Projects
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Browse student-led capstone ideas, explore required skills, and apply to join open teams.
          </p>
        </div>

        <Link
          href="/projects/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project title, keyword, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Select */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open for Applications</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Team Size Select */}
          <select
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">Any Team Size</option>
            <option value="3">3 Members</option>
            <option value="4">4 Members</option>
            <option value="5">5 Members</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects match your search"
          description="Try clearing your filters or create a new student collaboration project to get started."
          actionText="Create a Project"
          actionHref="/projects/create"
        />
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<CardSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </AppLayout>
  );
}
