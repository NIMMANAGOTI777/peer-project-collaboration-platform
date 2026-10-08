'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Plus, Trash2, CheckCircle2, ArrowLeft, Save, Sparkles } from 'lucide-react';

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js',
  'Express.js', 'Python', 'Java', 'C++', 'PostgreSQL', 'MongoDB', 'Redis',
  'Machine Learning', 'Data Science', 'PyTorch', 'UI/UX', 'Figma', 'DevOps',
  'Docker', 'Git', 'GitHub', 'Flutter', 'Android', 'Cybersecurity', 'Cloud Computing',
];

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [availability, setAvailability] = useState('15-20 hrs/week');
  const [experience, setExperience] = useState('Intermediate');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [githubUsername, setGithubUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Skills state: array of { name: string, proficiency: string }
  const [skills, setSkills] = useState<{ name: string; proficiency: string }[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('INTERMEDIATE');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setName(u.name || '');
        if (u.profile) {
          setBio(u.profile.bio || '');
          setInterests(u.profile.interests || '');
          setAvailability(u.profile.availability || '15-20 hrs/week');
          setExperience(u.profile.experience || 'Intermediate');
          setDepartment(u.profile.department || 'Computer Science & Engineering');
          setYear(u.profile.year || '3rd Year');
          setGithubUsername(u.profile.githubUsername || '');
          setAvatarUrl(u.profile.avatarUrl || '');
        }
        if (u.studentSkills) {
          setSkills(
            u.studentSkills.map((sk: any) => ({
              name: sk.skill.name,
              proficiency: sk.proficiency,
            }))
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) return;

    setSkills([...skills, { name: newSkillName.trim(), proficiency: newSkillProf }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleProfChange = (skillName: string, newProf: string) => {
    setSkills(
      skills.map((s) => (s.name === skillName ? { ...s, proficiency: newProf } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          interests,
          availability,
          experience,
          department,
          year,
          githubUsername,
          avatarUrl,
          skills,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        await refreshUser();
        setTimeout(() => {
          router.push('/profile');
        }, 1200);
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to update profile');
      }
    } catch (e: any) {
      setError(e.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Edit Student Profile</h1>
              <p className="text-xs text-slate-500">
                Update your technical expertise and availability for the matching engine.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Profile updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Personal & Academic Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. karthik-rao-dev"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bio & Background
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell potential teammates about your interests, past projects, and capstone aspirations..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Technical Skills & Proficiency */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Technical Skills & Proficiency Levels
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add the technologies and frameworks you know. Used directly by the compatibility algorithm.
              </p>
            </div>

            {/* Current Added Skills List */}
            <div className="space-y-2">
              {skills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <span className="text-xs font-bold text-slate-900">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={s.proficiency}
                      onChange={(e) => handleProfChange(s.name, e.target.value)}
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
                list="common-skills-list"
                placeholder="e.g. React, PostgreSQL, Docker..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <datalist id="common-skills-list">
                {COMMON_SKILLS.map((sk) => (
                  <option key={sk} value={sk} />
                ))}
              </datalist>

              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
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
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            </div>
          </div>

          {/* Section 3: Availability & Experience Match Attributes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Matching Attributes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Weekly Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="20+ hrs/week">20+ hrs/week (High / Full Focus)</option>
                  <option value="15-20 hrs/week">15-20 hrs/week (Standard Capstone)</option>
                  <option value="10-15 hrs/week">10-15 hrs/week (Medium)</option>
                  <option value="5-10 hrs/week">5-10 hrs/week (Part-time)</option>
                  <option value="0-5 hrs/week">0-5 hrs/week (Low)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Coding / Project Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Expert">Expert (3+ years / Production Apps)</option>
                  <option value="2+ years">Advanced (2+ years / Hackathons)</option>
                  <option value="Intermediate">Intermediate (1-2 years / Academic coursework)</option>
                  <option value="Beginner">Beginner (&lt; 1 year / Learning)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interests & Domains (comma separated)
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Web Development, Distributed Systems, Cloud Computing, UI/UX"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
