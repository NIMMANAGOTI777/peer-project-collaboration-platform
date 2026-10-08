'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Search,
  Shield,
  UserCheck,
  UserX,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  Github,
  Award,
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function AdminUsersPage() {
  const { user: currentAuthUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentActive: boolean) => {
    if (currentAuthUser?.id === userId && currentActive) {
      setActionError('Self-protection safeguard: You cannot deactivate your own administrative account.');
      setTimeout(() => setActionError(null), 4000);
      return;
    }

    try {
      setActionError(null);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to update user status');
      } else {
        setActionSuccess(`User ${!currentActive ? 'activated' : 'deactivated'} successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchUsers();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (currentAuthUser?.id === userId && newRole !== 'ADMIN') {
      setActionError('Self-protection safeguard: You cannot remove your own administrative privileges.');
      setTimeout(() => setActionError(null), 4000);
      return;
    }

    try {
      setActionError(null);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to update role');
      } else {
        setActionSuccess(`Role updated to ${newRole}.`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchUsers();
      }
    } catch (e: any) {
      setActionError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-400" />
            Student & User Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Audit registered student accounts, manage administrative roles, and enforce moderation.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-semibold focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionError && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Department / Year</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => {
                  const isCurrentAdmin = currentAuthUser?.id === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.profile?.avatarUrl ? (
                            <img
                              src={u.profile.avatarUrl}
                              alt={u.name}
                              className="h-8 w-8 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                              {u.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-white">{u.name}</p>
                              {isCurrentAdmin && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-300">
                          {u.profile?.department || 'Computer Science'}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {u.profile?.year || 'Undergrad'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          disabled={isCurrentAdmin}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border bg-slate-950 text-slate-200 ${
                            isCurrentAdmin
                              ? 'border-amber-500/40 text-amber-400 cursor-not-allowed opacity-90'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            u.isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Inspect User Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            disabled={isCurrentAdmin}
                            onClick={() => handleToggleStatus(u.id, u.isActive)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              isCurrentAdmin
                                ? 'text-slate-600 cursor-not-allowed'
                                : u.isActive
                                ? 'text-rose-400 hover:bg-rose-950/40'
                                : 'text-emerald-400 hover:bg-emerald-950/40'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                {selectedUser.profile?.avatarUrl ? (
                  <img
                    src={selectedUser.profile.avatarUrl}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-500/40">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Role</span>
                  <p className="font-bold text-amber-400">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                  <p className={selectedUser.isActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {selectedUser.isActive ? 'Active Account' : 'Deactivated'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Department</span>
                  <p className="text-slate-300">{selectedUser.profile?.department || 'CSE'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Academic Year</span>
                  <p className="text-slate-300">{selectedUser.profile?.year || 'Student'}</p>
                </div>
              </div>

              {selectedUser.profile?.bio && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Bio</span>
                  <p className="text-slate-300 mt-0.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
                    {selectedUser.profile.bio}
                  </p>
                </div>
              )}

              {selectedUser.studentSkills && selectedUser.studentSkills.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                    Technical Skills & Proficiencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.studentSkills.map((sk: any) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold"
                      >
                        {sk.skill.name} · <span className="text-amber-400 text-[10px]">{sk.proficiency}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.profile?.githubUsername && (
                <div className="flex items-center gap-2 pt-2 text-slate-300">
                  <Github className="h-4 w-4 text-slate-400" />
                  <span>GitHub: <code className="text-indigo-400 font-mono">@{selectedUser.profile.githubUsername}</code></span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
