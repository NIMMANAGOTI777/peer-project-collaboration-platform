'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Search,
  Trash2,
  ExternalLink,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  Flag,
  Users,
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/projects?${params.toString()}`);
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

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, status: newStatus }),
      });
      if (res.ok) {
        setActionSuccess(`Project status set to ${newStatus}.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchProjects();
        if (selectedProject?.id === projectId) {
          setSelectedProject((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeDeleteProject = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${deleteConfirm.id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess(`Project "${deleteConfirm.title}" removed.`);
        setTimeout(() => setActionSuccess(null), 3000);
        setDeleteConfirm(null);
        if (selectedProject?.id === deleteConfirm.id) {
          setSelectedProject(null);
        }
        fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-amber-400" />
            Project Moderation & Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Audit published academic projects, check required competencies, approve listings, or remove flagged items.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search project title or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open for Collab</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
            <option value="FLAGGED">Flagged / Under Review</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Projects Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Project Lead</th>
                  <th className="py-3.5 px-4">Team Capacity</th>
                  <th className="py-3.5 px-4">Moderation Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white max-w-sm truncate">{p.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                        {p.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-300">{p.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{p.owner.name}</p>
                      <p className="text-[10px] text-slate-400">{p.owner.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-300">
                        {p.team?.members?.length || 1} / {p.preferredTeamSize}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border bg-slate-950 ${
                          p.status === 'FLAGGED'
                            ? 'border-rose-500/40 text-rose-400'
                            : p.status === 'COMPLETED'
                            ? 'border-emerald-500/40 text-emerald-400'
                            : 'border-slate-700 text-slate-300'
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="FLAGGED">FLAGGED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Inspect Project"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/projects/${p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="View on Public Portal"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm({ id: p.id, title: p.title })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Inspector Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Project Description
                </span>
                <p className="text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Lead Student</span>
                  <p className="font-bold text-white mt-0.5">{selectedProject.owner.name}</p>
                  <p className="text-[10px] text-slate-400">{selectedProject.owner.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                  <p className="font-bold text-amber-400 mt-0.5">{selectedProject.status}</p>
                  <p className="text-[10px] text-slate-400">Preferred size: {selectedProject.preferredTeamSize} members</p>
                </div>
              </div>

              {selectedProject.projectSkills && selectedProject.projectSkills.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                    Required Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.projectSkills.map((ps: any) => (
                      <span
                        key={ps.id}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px]"
                      >
                        {ps.skill.name} · <span className="text-amber-400 text-[10px]">{ps.requiredLevel}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedProject.id, 'FLAGGED')}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 flex items-center gap-1.5"
                >
                  <Flag className="h-3.5 w-3.5" /> Flag Listing
                </button>
                <button
                  onClick={() => handleStatusChange(selectedProject.id, 'OPEN')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve / Open
                </button>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Confirm Destructive Action</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-200">"{deleteConfirm.title}"</strong>?
              This will remove all associated tasks, team memberships, and request records.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteProject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
