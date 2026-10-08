'use client';

import React from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock, MoreVertical, Trash2, ArrowRight } from 'lucide-react';

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  dueDate?: string | null;
  assignee?: {
    id: string;
    name: string;
    profile?: { avatarUrl?: string | null } | null;
  } | null;
}

interface TaskCardProps {
  task: TaskItem;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priorityColors: { [key: string]: string } = {
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-soft hover:border-indigo-200 transition-all">
      {/* Priority and Actions header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
            priorityColors[task.priority] || 'bg-slate-100 text-slate-700'
          }`}
        >
          {task.priority} Priority
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-opacity"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Title & Description */}
      <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
      {task.description && (
        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due Date & Assignee */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Assignee */}
        <div className="flex items-center gap-1.5 min-w-0">
          {task.assignee ? (
            <>
              {task.assignee.profile?.avatarUrl ? (
                <img
                  src={task.assignee.profile.avatarUrl}
                  alt={task.assignee.name}
                  className="h-5 w-5 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {task.assignee.name.charAt(0)}
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[80px]">
                {task.assignee.name}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Status quick mover controls */}
      <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-dashed border-slate-100">
        <span className="text-[10px] font-medium text-slate-400">Move to:</span>
        <div className="flex items-center gap-1">
          {task.status !== 'TODO' && (
            <button
              onClick={() => onStatusChange(task.id, 'TODO')}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              To Do
            </button>
          )}
          {task.status !== 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
            >
              In Progress
            </button>
          )}
          {task.status !== 'COMPLETED' && (
            <button
              onClick={() => onStatusChange(task.id, 'COMPLETED')}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
            >
              Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
