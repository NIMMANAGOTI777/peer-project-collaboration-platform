'use client';

import React from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Database,
  Key,
  Layers,
  Sparkles,
  Server,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-amber-400" />
          Platform Configuration & Algorithm Parameters
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Official B.Tech CSE Mini Project matching weights, architectural governance, and security policies.
        </p>
      </div>

      {/* Matching Algorithm Parameters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Recommendation & Compatibility Algorithm Weights
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Sum: 100% Normalized
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The peer matching engine calculates pairwise compatibility between students and project listings using the weighted multi-factor scoring formula:
        </p>

        {/* 4 Weight Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Skill Match
            </span>
            <span className="text-3xl font-black text-indigo-400">60%</span>
            <p className="text-[10px] text-slate-500 mt-1">Weight: 0.60</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Interest Match
            </span>
            <span className="text-3xl font-black text-blue-400">20%</span>
            <p className="text-[10px] text-slate-500 mt-1">Weight: 0.20</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Availability
            </span>
            <span className="text-3xl font-black text-emerald-400">10%</span>
            <p className="text-[10px] text-slate-500 mt-1">Weight: 0.10</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Experience
            </span>
            <span className="text-3xl font-black text-purple-400">10%</span>
            <p className="text-[10px] text-slate-500 mt-1">Weight: 0.10</p>
          </div>
        </div>

        {/* Formula Math Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300/90 leading-relaxed">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-sans">
            Mathematical Evaluation Formula:
          </span>
          Score = (0.60 × S_skill) + (0.20 × S_interest) + (0.10 × S_availability) + (0.10 × S_experience)
        </div>
      </div>

      {/* Relational Database & ORM Engine Architecture */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-400" />
          Database Engine & Schema Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">Relational ORM</p>
            <p className="text-slate-400">Prisma Client v5.22.0</p>
            <p className="text-[10px] text-emerald-400 font-semibold">✓ Type-safe queries with cascade deletion</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">Database Engine</p>
            <p className="text-slate-400">Relational SQLite / PostgreSQL DDL</p>
            <p className="text-[10px] text-indigo-400 font-semibold">✓ 11 Relational tables & indexes</p>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control & Security Policies */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Role-Based Access Control (RBAC) & Security Policies
        </h2>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong className="text-white">Authentication Protocol:</strong> JSON Web Tokens (JWT) signed with HMAC-SHA256 and stored in secure <code className="text-amber-400 font-mono">httpOnly</code> cookies.
          </p>
          <p>
            <strong className="text-white">Password Security:</strong> Bcrypt adaptive hashing with 10 salt rounds.
          </p>
          <p>
            <strong className="text-white">Boundary Isolation:</strong> Complete separation between the public/student client application and the administrative governance panel.
          </p>
          <p>
            <strong className="text-white">API Guards:</strong> Next.js Server Route Handlers enforce 401 Unauthorized for unauthenticated requests and 403 Forbidden for students attempting admin actions.
          </p>
        </div>
      </div>
    </div>
  );
}
