'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tags, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/admin/skills');
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
      if (res.ok) {
        setName('');
        fetchSkills();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to add skill');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to remove this skill from the platform registry?')) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSkills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tags className="h-6 w-6 text-indigo-600" />
            Skills Taxonomy Registry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Define canonical technical competencies and category tags for the matching algorithm.
          </p>
        </div>

        {/* Add Skill Form */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Register New Skill
          </h3>
          <form onSubmit={handleCreateSkill} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. GraphQL, Kubernetes, Swift..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Mobile">Mobile</option>
              <option value="Security">Security</option>
              <option value="Cloud">Cloud</option>
              <option value="Tools">Tools</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Skill
            </button>
          </form>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{s.name}</p>
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
                    {s.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
