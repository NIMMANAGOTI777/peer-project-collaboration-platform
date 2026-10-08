'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Users2, ArrowLeft, Plus, Trash2, Shield, UserMinus } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function ProjectTeamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
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

  const handleRemoveMember = async (targetUserId: string) => {
    if (!project?.team) return;
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const res = await fetch(`/api/teams/${project.team.id}/members?userId=${targetUserId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTeam();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to remove member');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  const isOwner = user?.id === project?.ownerId;
  const isAdmin = user?.role === 'ADMIN';
  const members = project?.team?.members || [];

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
              <h1 className="text-xl font-bold text-slate-900">
                {project?.title} — Team Management
              </h1>
              <p className="text-xs text-slate-500">
                {members.length} / {project?.preferredTeamSize} Members Active
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {member.role}
                  </span>
                  {(isOwner || isAdmin) && member.userId !== project.ownerId && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Remove member from team"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {member.user.profile?.avatarUrl ? (
                    <img
                      src={member.user.profile.avatarUrl}
                      alt={member.user.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                      {member.user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{member.user.name}</h4>
                    <p className="text-[11px] text-slate-500">{member.user.email}</p>
                    <p className="text-[10px] text-slate-400">{member.user.profile?.department || 'CSE'}</p>
                  </div>
                </div>

                {member.user.profile?.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {member.user.profile.bio}
                  </p>
                )}

                {/* Technical Skills */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.user.studentSkills?.map((sk: any) => (
                      <span
                        key={sk.id}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {sk.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Joined {new Date(member.joinedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <span>{member.user.profile?.availability || 'Available'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
