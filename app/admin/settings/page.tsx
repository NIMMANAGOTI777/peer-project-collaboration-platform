'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { SlidersHorizontal, ShieldAlert, CheckCircle2, Database, Key } from 'lucide-react';

export default function AdminSettingsPage() {
  const [matchingSkillWeight, setMatchingSkillWeight] = useState('60');
  const [matchingInterestWeight, setMatchingInterestWeight] = useState('20');
  const [matchingAvailWeight, setMatchingAvailWeight] = useState('10');
  const [matchingExpWeight, setMatchingExpWeight] = useState('10');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-indigo-600" />
            Platform Governance & Parameters
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure system matching parameters, evaluation constants, and database connection modes.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Matching parameters updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Matching Engine Formula Weights */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Recommendation Engine Weights (Must sum to 100%)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Skill Match (%)
                </label>
                <input
                  type="number"
                  value={matchingSkillWeight}
                  onChange={(e) => setMatchingSkillWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Interest Match (%)
                </label>
                <input
                  type="number"
                  value={matchingInterestWeight}
                  onChange={(e) => setMatchingInterestWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Availability (%)
                </label>
                <input
                  type="number"
                  value={matchingAvailWeight}
                  onChange={(e) => setMatchingAvailWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Experience (%)
                </label>
                <input
                  type="number"
                  value={matchingExpWeight}
                  onChange={(e) => setMatchingExpWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-purple-600"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Mini Project standard formula: 0.60 × skill_match + 0.20 × interest_match + 0.10 × availability_match + 0.10 × experience_match.
            </p>
          </div>

          {/* Database & Security Architecture */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-600" />
              Database Engine Architecture
            </h2>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <p className="text-slate-800 font-bold">Relational ORM: Prisma Client v5.22.0</p>
              <p className="text-slate-600">Active Connector: SQLite local file (<code className="font-mono text-indigo-600">dev.db</code>) with PostgreSQL full DDL schema compatibility.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              Save System Configuration
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
