'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users2,
  Compass,
  FolderKanban,
  Github,
  TrendingUp,
  ShieldCheck,
  Layers,
  Code2,
  Award,
  Terminal,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold shadow-md shadow-indigo-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">PeerCollab</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              B.Tech CSE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="/projects" className="hover:text-indigo-600 transition-colors">
              Browse Projects
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-all"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Academic Mini Project & Capstone Collaboration Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-tight">
            Find the Right Team. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
              Build Better Projects.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover student projects, find teammates with complementary skills, and manage your entire project lifecycle with transparent compatibility scoring, Kanban tasks, and GitHub sync.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4" />
              Find a Project
            </Link>
            <Link
              href="/projects/create"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm shadow-card transition-all flex items-center justify-center gap-2"
            >
              <FolderKanban className="h-4 w-4 text-indigo-600" />
              Create a Project
            </Link>
          </div>

          {/* Demo Account Callout Box */}
          <div className="mt-8 inline-block p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-soft text-left max-w-md mx-auto">
            <p className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-indigo-600" />
              Quick College Evaluation Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 font-sans block">Student:</span>
                student@example.com <br />
                Student@123
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 font-sans block">Admin:</span>
                admin@example.com <br />
                Admin@123
              </div>
            </div>
          </div>

          {/* Dashboard Preview UI Mockup */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-indigo-500/10">
            <div className="rounded-xl bg-slate-900 text-white p-4 sm:p-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    Smart Campus Navigation — Project Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    87% Match Score
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Preview Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Project Progress
                  </span>
                  <p className="text-2xl font-black text-indigo-400 mt-1">68% Completed</p>
                  <p className="text-xs text-slate-300 mt-1">14 total tasks · 9 finished</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Team Composition
                  </span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">3 / 5 Members</p>
                  <p className="text-xs text-slate-300 mt-1">React, Node.js, PostgreSQL, UI/UX</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    GitHub Sync
                  </span>
                  <p className="text-2xl font-black text-amber-400 mt-1">24 Stars · 8 Forks</p>
                  <p className="text-xs text-slate-300 mt-1">Main branch active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Structured Workflow
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              How the Peer Collaboration Platform Works
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Follow our five-step pipeline to form balanced student teams and deliver successful projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Build Profile',
                desc: 'Add technical skills with proficiency levels, domains of interest, availability, and GitHub link.',
              },
              {
                step: '02',
                title: 'Discover Projects',
                desc: 'Filter by category, tech stack, team vacancy, and review required project competencies.',
              },
              {
                step: '03',
                title: 'Find Your Match',
                desc: 'View deterministic, explainable compatibility scores with matched vs missing skills breakdown.',
              },
              {
                step: '04',
                title: 'Form Your Team',
                desc: 'Send collaboration requests, accept teammate invites, and manage project member permissions.',
              },
              {
                step: '05',
                title: 'Track & Deliver',
                desc: 'Manage milestones on the Kanban board, sync GitHub commits, and monitor completion progress.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-colors"
              >
                <div>
                  <span className="text-3xl font-black text-indigo-600/40">{s.step}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              System Modules
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything Needed for College Project Excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Skill-Based Matching Engine',
                desc: 'Transparent compatibility formula combining 60% skill alignment, 20% interest match, 10% availability, and 10% experience.',
              },
              {
                icon: Compass,
                title: 'Project Discovery & Search',
                desc: 'Fast debounced search with category filters, required skill tags, preferred team size, and real-time vacancy status.',
              },
              {
                icon: Users2,
                title: 'Team Collaboration Hub',
                desc: 'Send, accept, or reject collaboration invitations with automated team formation and notifications.',
              },
              {
                icon: FolderKanban,
                title: 'Kanban Task Board',
                desc: 'Interactive 3-column task management with assignees, priorities, due dates, and status transitions.',
              },
              {
                icon: Github,
                title: 'GitHub REST API Sync',
                desc: 'Connect repository URLs to display commit history, stars, forks, primary language, and open issue counts.',
              },
              {
                icon: TrendingUp,
                title: 'Progress Analytics Dashboard',
                desc: 'Radial completion percentages, task status distribution, and individual team member milestone contributions.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-soft hover:border-indigo-200 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Peer Project Collaboration Platform © 2026
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center">
            B.Tech Computer Science & Engineering Capstone Project · Next.js & Prisma
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link href="/projects" className="hover:text-indigo-600">Projects</Link>
            <Link href="/login" className="hover:text-indigo-600">Sign In</Link>
            <Link href="/register" className="hover:text-indigo-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
