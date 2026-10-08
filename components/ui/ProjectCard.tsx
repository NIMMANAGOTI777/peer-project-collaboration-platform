import React from 'react';
import Link from 'next/link';
import SkillBadge from './SkillBadge';
import { Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    preferredTeamSize: number;
    createdAt?: string;
    owner: {
      id: string;
      name: string;
      email?: string;
      profile?: {
        avatarUrl?: string | null;
        department?: string | null;
      } | null;
    };
    projectSkills: Array<{
      skill: { id: string; name: string; category?: string };
      requiredLevel: string;
    }>;
    team?: {
      members?: Array<any>;
    } | null;
    match?: {
      totalScore: number;
      explanation?: {
        summary?: string;
      };
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const teamCount = project.team?.members?.length || 1;
  const preferredSize = project.preferredTeamSize || 4;
  const isFull = teamCount >= preferredSize;

  const statusColors: { [key: string]: string } = {
    OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    COMPLETED: 'bg-purple-50 text-purple-700 border-purple-200/80',
    CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft hover:border-indigo-200/90 transition-all duration-200">
      <div>
        {/* Top meta: Category, Status & Match badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {project.category}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                statusColors[project.status] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {project.match && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>{project.match.totalScore}% Match</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Required Skills list */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.projectSkills.slice(0, 4).map((ps) => (
              <SkillBadge
                key={ps.skill.id}
                name={ps.skill.name}
                proficiency={ps.requiredLevel}
                size="sm"
              />
            ))}
            {project.projectSkills.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center font-medium">
                +{project.projectSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Owner, Team counter, Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Owner Info */}
        <div className="flex items-center gap-2 min-w-0">
          {project.owner.profile?.avatarUrl ? (
            <img
              src={project.owner.profile.avatarUrl}
              alt={project.owner.name}
              className="h-7 w-7 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              {project.owner.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{project.owner.name}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Users className="h-3 w-3" />
              <span>
                {teamCount} / {preferredSize} members
              </span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white border border-slate-200 group-hover:border-indigo-600 transition-all shadow-xs"
        >
          View Project
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
