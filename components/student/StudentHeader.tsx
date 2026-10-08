'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  Shield,
  Layers,
  Menu,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [globalSearch, setGlobalSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // silent
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
    } catch (e) {
      // silent
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      router.push(`/projects?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold shadow-md shadow-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">PeerCollab</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                CSE
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-medium">Student Collaboration Hub</p>
          </div>
        </Link>
      </div>

      {/* Global Project / Skill Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, skills, tech stacks..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </form>
      </div>

      {/* Right User & Notification Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <>
            <Link
              href="/projects/create"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all"
            >
              <Plus className="h-4 w-4" /> Create Project
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl py-2 z-50">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link || '/notifications'}
                          onClick={() => setShowNotifMenu(false)}
                          className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                            !n.readStatus ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="mt-1">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-800 font-medium leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  <div className="border-t border-slate-100 p-2 text-center">
                    <Link
                      href="/notifications"
                      onClick={() => setShowNotifMenu(false)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Student Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all"
              >
                {user.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden lg:block text-xs font-bold text-slate-800 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                  >
                    <User className="h-4 w-4" /> My Profile & Skills
                  </Link>

                  <Link
                    href="/collaboration-requests"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                  >
                    <Layers className="h-4 w-4" /> Collaboration Requests
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                  >
                    <Settings className="h-4 w-4" /> Account Settings
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold"
                    >
                      <Shield className="h-4 w-4" /> Open Admin Console
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-bold px-3.5 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
