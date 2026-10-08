'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Plus, Trash2, ArrowLeft, Sparkles, FolderKanban, CheckCircle2 } from 'lucide-react';

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js',
  'Express.js', 'Python', 'Java', 'C++', 'PostgreSQL', 'MongoDB', 'Redis',
  'Machine Learning', 'Data Science', 'PyTorch', 'UI/UX', 'Figma', 'DevOps',
  'Docker', 'Git', 'GitHub', 'Flutter', 'Android', 'Cybersecurity', 'Cloud Computing',
];

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [preferredTeamSize, setPreferredTeamSize] = useState('4');
  const [status, setStatus] = useState('OPEN');
  const [githubUrl, setGithubUrl] = useState('');

  // Required Skills state: array of { name: string, requiredLevel: string }
  const [skills, setSkills] = useState<{ name: string; requiredLevel: string }[]>([
    { name: 'React', requiredLevel: 'ADVANCED' },
    { name: 'Node.js', requiredLevel: 'INTERMEDIATE' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('INTERMEDIATE');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) return;

    setSkills([...skills, { name: newSkillName.trim(), requiredLevel: newSkillLevel }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleLevelChange = (skillName: string, newLevel: string) => {
    setSkills(
      skills.map((s) => (s.name === skillName ? { ...s, requiredLevel: newLevel } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one required skill for your project.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          preferredTeamSize,
          status,
          skills,
          githubUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/projects/${data.project.id}`);
      } else {
        setError(data.error || 'Failed to create project');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setError(e.message || 'Error creating project');
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create New Project</h1>
            <p className="text-xs text-slate-500">
              Pitch your capstone idea and find compatible teammates with matching skills.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Project Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Project Overview</h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart Campus Navigation"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Description & Goals *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, target users, architectural stack, and expected deliverables..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                  <option value="IoT">IoT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Team Size
                </label>
                <select
                  value={preferredTeamSize}
                  onChange={(e) => setPreferredTeamSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members (Standard)</option>
                  <option value="5">5 Members</option>
                  <option value="6">6 Members</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="OPEN">Open (Recruiting)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Required Skills & Competencies */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Required Team Skills *
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The matching algorithm uses these required skills to calculate compatibility scores for students.
              </p>
            </div>

            {/* Added Skills List */}
            <div className="space-y-2">
              {skills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-xs font-bold text-slate-900">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={s.requiredLevel}
                      onChange={(e) => handleLevelChange(s.name, e.target.value)}
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold text-indigo-700"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                      <option value="EXPERT">EXPERT</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.name)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                list="common-skills-list-project"
                placeholder="e.g. React, PostgreSQL, Docker..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <datalist id="common-skills-list-project">
                {COMMON_SKILLS.map((sk) => (
                  <option key={sk} value={sk} />
                ))}
              </datalist>

              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Required Skill
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/projects')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              {isSubmitting ? 'Publishing Project...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
