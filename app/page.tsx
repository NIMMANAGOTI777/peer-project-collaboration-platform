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
  GraduationCap,
  Shield,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const { user, enterDemo } = useAuth();
  const [showDemoModal, setShowDemoModal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const demo = params.get('demo');
      if (demo) {
        const normalized = demo.toUpperCase();
        if (normalized === 'FACULTY_ADMIN' || normalized === 'ADMIN') {
          enterDemo('ADMIN');
        } else if (normalized === 'STUDENT') {
          enterDemo('STUDENT');
        }
      }
    }
  }, [enterDemo]);

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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Explore Demo CTA in Navbar */}
            <div className="relative">
              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold shadow-sm hover:brightness-105 transition-all"
                title="Open demo without login"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Explore Demo</span>
              </button>
            </div>

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
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Demo Selector Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Explore Demo Experience</h3>
                  <p className="text-[11px] text-slate-500">Instant access · No registration or login required</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {/* Option 1: Explore as Student */}
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  enterDemo('STUDENT');
                }}
                className="w-full p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 text-left transition-all group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Explore as Student</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Log in as Karthik Rao. Inspect student dashboard, browse 8 projects, view calculated matching scores, manage Kanban tasks, send simulated invites, and view GitHub sync.
                  </p>
                </div>
              </button>

              {/* Option 2: Explore as Admin */}
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  enterDemo('ADMIN');
                }}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-white hover:bg-amber-50/30 text-left transition-all group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Explore as Admin</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Governance
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Log in as Dr. Ramesh Kumar. View administrative governance console, system statistics, 16 users table, moderation reports, project oversight, and skill taxonomy.
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
              💡 <span className="font-semibold text-slate-700">Note:</span> Demo mode uses a persistent client-side state so actions (like creating tasks or moving Kanban columns) remain consistent across page navigations without modifying production data.
            </div>
          </div>
        </div>
      )}

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

          {/* Primary Demo & Action CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4 fill-current text-amber-300" />
              <span>Explore Demo (No Login Required)</span>
            </button>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm shadow-card transition-all flex items-center justify-center gap-2"
            >
              <Compass className="h-4 w-4 text-indigo-600" />
              Browse Projects
            </Link>
          </div>

          {/* Dual Instant Launch Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => enterDemo('STUDENT')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-colors"
            >
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              <span>Explore as Student</span>
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => enterDemo('ADMIN')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-amber-600" />
              <span>Explore as Admin</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Quick College Evaluation Box with 1-Click Launch */}
          <div className="mt-8 inline-block p-4 sm:p-5 rounded-2xl bg-white/95 border border-indigo-100 shadow-soft text-left max-w-md mx-auto">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-600" />
                Quick Evaluation Credentials:
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                1-Click Ready
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Student Account:</span>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">student@example.com</p>
                  <p className="font-mono text-[10px] text-slate-500">Student@123</p>
                </div>
                <button
                  onClick={() => enterDemo('STUDENT')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Launch Student</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Admin Account:</span>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">admin@example.com</p>
                  <p className="font-mono text-[10px] text-slate-500">Admin@123</p>
                </div>
                <button
                  onClick={() => enterDemo('ADMIN')}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Launch Admin</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
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
