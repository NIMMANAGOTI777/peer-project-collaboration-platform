'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import SkillBadge from '@/components/ui/SkillBadge';
import MatchCard from '@/components/ui/MatchCard';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import GitHubRepoView from '@/components/github/GitHubRepoView';
import ProjectProgressView from '@/components/dashboard/ProjectProgressView';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  FolderKanban,
  Users2,
  CheckSquare,
  Github,
  TrendingUp,
  Sparkles,
  Edit3,
  Send,
  UserPlus,
  Share2,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [progressStats, setProgressStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'tasks' | 'github' | 'progress'>('overview');

  // Apply to join modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject();
      loadMatches();
      loadProgress();
    }
  }, [id]);

  const loadProject = async () => {
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

  const loadMatches = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await fetch(`/api/dashboard/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProgressStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !project) return;

    setApplying(true);
    try {
      const res = await fetch('/api/collaboration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: project.ownerId,
          projectId: project.id,
          message:
            applyMessage.trim() ||
            `Hi ${project.owner.name}, I would love to join your project "${project.title}" and contribute my technical skills!`,
        }),
      });

      if (res.ok) {
        setApplySuccess(true);
        setTimeout(() => {
          setShowApplyModal(false);
          setApplySuccess(false);
          setApplyMessage('');
        }, 1500);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to submit application');
      }
    } catch (e) {
      alert('Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This project may have been moved or removed.</p>
          <Link
            href="/projects"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Browse Projects
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isOwner = user?.id === project.ownerId;
  const isMember =
    isOwner || project.team?.members.some((m: any) => m.userId === user?.id);
  const isAdmin = user?.role === 'ADMIN';
  const canManage = isOwner || isAdmin;

  const teamMembers = project.team?.members || [];
  const teamMemberOptions = teamMembers.map((m: any) => ({
    id: m.userId,
    name: m.user.name,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Back Nav & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/projects')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {project.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {project.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isMember && user && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
              >
                <Send className="h-4 w-4" />
                Apply to Join Team
              </button>
            )}

            {canManage && (
              <Link
                href={`/projects/${project.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Project
              </Link>
            )}
          </div>
        </div>

        {/* 5-Tab Navigation Header */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FolderKanban },
            { id: 'team', label: `Team (${teamMembers.length}/${project.preferredTeamSize})`, icon: Users2 },
            { id: 'tasks', label: `Tasks (${project.tasks?.length || 0})`, icon: CheckSquare },
            { id: 'github', label: 'GitHub Sync', icon: Github },
            { id: 'progress', label: 'Progress & Metrics', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Description & Metadata Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Project Description & Scope
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Required Skills list */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Required Competencies & Proficiency Levels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.projectSkills.map((ps: any) => (
                    <SkillBadge
                      key={ps.skill.id}
                      name={ps.skill.name}
                      proficiency={ps.requiredLevel}
                      size="md"
                    />
                  ))}
                </div>
              </div>

              {/* Project Owner & Team Metadata */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  {project.owner.profile?.avatarUrl ? (
                    <img
                      src={project.owner.profile.avatarUrl}
                      alt={project.owner.name}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                      {project.owner.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Project Lead / Owner</span>
                    <span className="font-bold text-slate-900">{project.owner.name}</span>
                    <span className="ml-1.5 text-slate-400">({project.owner.email})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span>
                    <strong>Created:</strong>{' '}
                    {new Date(project.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>
                    <strong>Vacancies:</strong>{' '}
                    {Math.max(0, project.preferredTeamSize - teamMembers.length)} seats open
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Recommended Teammates (Skill Matching Engine Showcase) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Recommended Teammates for this Project
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated deterministically using our transparent 4-tier compatibility engine.
                  </p>
                </div>
              </div>

              {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matches.slice(0, 6).map((m) => (
                    <MatchCard
                      key={m.userId}
                      match={m}
                      projectId={project.id}
                      projectTitle={project.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  All available candidate students are already members of this project team.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TEAM MANAGEMENT */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Project Team Roster</h3>
                <p className="text-xs text-slate-500">
                  {teamMembers.length} active member(s) · Preferred team size: {project.preferredTeamSize}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center gap-3">
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
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {member.user.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{member.user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Technical Skills
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

                  <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                    <span>Joined: {new Date(member.joinedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TASKS (KANBAN BOARD) */}
        {activeTab === 'tasks' && (
          <KanbanBoard
            projectId={project.id}
            tasks={project.tasks || []}
            teamMembers={teamMemberOptions}
            onTaskUpdated={() => {
              loadProject();
              loadProgress();
            }}
            canManageTasks={isMember || isAdmin}
          />
        )}

        {/* TAB 4: GITHUB SYNC */}
        {activeTab === 'github' && (
          <GitHubRepoView
            projectId={project.id}
            initialRepoUrl={project.repository?.githubUrl}
            canManage={isMember || isAdmin}
          />
        )}

        {/* TAB 5: PROGRESS & METRICS */}
        {activeTab === 'progress' && progressStats && (
          <ProjectProgressView
            stats={progressStats.stats}
            project={progressStats.project}
            memberContributions={progressStats.memberContributions || []}
          />
        )}

        {/* Apply To Join Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Apply to Collaborate on {project.title}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Introduce yourself and highlight how your technical skills match the project scope.
              </p>

              {applySuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold text-center">
                  Collaboration request submitted successfully!
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message to Project Lead
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      placeholder={`Hi ${project.owner.name}, I would love to contribute to ${project.title}...`}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm"
                    >
                      {applying ? 'Sending...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
