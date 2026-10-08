'use client';

import React, { useEffect, useState } from 'react';
import {
  Tags,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Search,
  X,
  AlertTriangle,
  FolderTree,
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'AI/ML',
  'DevOps',
  'Design',
  'Mobile',
  'Security',
  'Cloud',
  'Tools',
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, [categoryFilter, search]);

  const fetchSkills = async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/skills?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), category }),
      });
      const data = await res.json();
      if (res.ok) {
        setName('');
        setActionSuccess(`Skill "${data.skill.name}" added to taxonomy.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchSkills();
      } else {
        alert(data.error || 'Failed to add skill');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSkill.id,
          name: editingSkill.name.trim(),
          category: editingSkill.category,
        }),
      });
      if (res.ok) {
        setActionSuccess(`Skill "${editingSkill.name}" updated successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
        setEditingSkill(null);
        fetchSkills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeDeleteSkill = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${deleteConfirm.id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionSuccess(`Skill "${deleteConfirm.name}" removed from taxonomy.`);
        setTimeout(() => setActionSuccess(null), 3000);
        setDeleteConfirm(null);
        fetchSkills();
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
            <Tags className="h-6 w-6 text-amber-400" />
            Skills Taxonomy & Competency Registry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Define canonical technical skills, assign domains, and manage taxonomy weights for matching algorithms.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Register Skill Form Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Canonical Skill to Registry
        </h3>
        <form onSubmit={handleCreateSkill} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="e.g. Next.js, FastAPI, Kubernetes, Figma..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 font-semibold focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" /> Register Skill
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            categoryFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Categories ({skills.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              categoryFilter === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : skills.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <Tags className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Skills Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try another category or add a new skill above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-md flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{s.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                    {s.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {s._count?.studentSkills || 0} students · {s._count?.projectSkills || 0} projects
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditingSkill(s)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Skill"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ id: s.id, name: s.name })}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Delete Skill"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Skill Taxonomy</h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
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
            <h3 className="text-base font-bold text-white">Delete Skill</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-200">"{deleteConfirm.name}"</strong> from the platform taxonomy?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteSkill}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
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
