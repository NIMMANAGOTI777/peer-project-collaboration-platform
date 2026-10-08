'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import SkillBadge from '@/components/ui/SkillBadge';
import {
  User,
  Github,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit3,
  Layers,
  FolderKanban,
  Users2,
} from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.user);
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

  const p = profileData?.profile || {};
  const skills = profileData?.studentSkills || [];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Main Profile Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={profileData?.name || 'Profile'}
                  className="h-20 w-20 rounded-full object-cover border-4 border-indigo-50 shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {(profileData?.name || 'U').charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profileData?.name}
                </h1>
                <p className="text-xs text-slate-500">{profileData?.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                    {p.department || 'CSE Undergrad'}
                  </span>
                  {p.year && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {p.year}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {profileData?.role}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>

          {/* Bio and metadata row */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                About & Bio
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {p.bio || 'No biography added yet.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Weekly Availability</span>
                  <span className="font-semibold">{p.availability || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Briefcase className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Experience Level</span>
                  <span className="font-semibold">{p.experience || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Github className="h-4 w-4 text-slate-800 shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">GitHub Profile</span>
                  {p.githubUsername ? (
                    <a
                      href={`https://github.com/${p.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      @{p.githubUsername}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not connected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Technical Skills & Proficiencies
            </h3>
            <Link
              href="/profile/edit"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              + Manage Skills
            </Link>
          </div>

          {skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((item: any) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-900">{item.skill.name}</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                    {item.proficiency}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No technical skills added yet. Add your skills to unlock the matching engine recommendations.
            </div>
          )}
        </div>

        {/* Interests & Domains */}
        {p.interests && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Domains of Interest</h3>
            <div className="flex flex-wrap gap-2">
              {p.interests.split(',').map((interest: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                >
                  {interest.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Created and Teams Joined */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-indigo-600" />
              Owned Projects ({profileData?.ownedProjects?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {profileData?.ownedProjects?.map((proj: any) => (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.id}`}
                  className="block p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors"
                >
                  <p className="text-xs font-bold text-slate-800">{proj.title}</p>
                  <span className="text-[10px] text-slate-500">{proj.category} · {proj.status}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users2 className="h-4 w-4 text-emerald-600" />
              Team Memberships ({profileData?.teamMemberships?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {profileData?.teamMemberships?.map((tm: any) => (
                <Link
                  key={tm.id}
                  href={`/projects/${tm.team.project.id}`}
                  className="block p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                >
                  <p className="text-xs font-bold text-slate-800">{tm.team.project.title}</p>
                  <span className="text-[10px] text-slate-500">Role: {tm.role}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
