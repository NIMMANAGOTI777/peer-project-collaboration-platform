'use client';

import React, { useState } from 'react';
import SkillBadge from './SkillBadge';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Send,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  UserCheck,
} from 'lucide-react';
import { MatchBreakdown } from '@/lib/matching/types';

interface MatchCardProps {
  match: MatchBreakdown;
  projectId?: string;
  projectTitle?: string;
  onInvite?: (candidateUserId: string) => void;
  isInvited?: boolean;
}

export default function MatchCard({
  match,
  projectId,
  projectTitle,
  onInvite,
  isInvited = false,
}: MatchCardProps) {
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(isInvited);
  const [inviteMsg, setInviteMsg] = useState('');
  const [showInviteBox, setShowInviteBox] = useState(false);

  const handleSendRequest = async () => {
    if (!projectId) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/collaboration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: match.userId,
          projectId,
          message:
            inviteMsg.trim() ||
            `Hi ${match.candidateName || 'there'}, your skills match our project "${projectTitle || 'requirements'}". We'd love to invite you to collaborate!`,
        }),
      });
      if (res.ok) {
        setSentSuccess(true);
        setShowInviteBox(false);
        if (onInvite) onInvite(match.userId);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to send collaboration request');
      }
    } catch (e) {
      alert('Error sending request');
    } finally {
      setIsSending(false);
    }
  };

  // Color gradient for score
  let scoreBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (match.totalScore >= 85) {
    scoreBadge = 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-500/10';
  } else if (match.totalScore >= 70) {
    scoreBadge = 'bg-blue-50 text-blue-700 border-blue-300';
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-soft hover:border-indigo-200 transition-all duration-200">
      <div>
        {/* Header: Candidate Info & Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {match.candidateAvatarUrl ? (
              <img
                src={match.candidateAvatarUrl}
                alt={match.candidateName || 'Candidate'}
                className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {(match.candidateName || 'U').charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {match.candidateName || 'Candidate'}
              </h4>
              <p className="text-[11px] text-slate-500">{match.candidateEmail}</p>
            </div>
          </div>

          {/* Explainable Match Badge */}
          <button
            onClick={() => setShowExplanationModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black shadow-xs hover:scale-105 transition-transform ${scoreBadge}`}
            title="Click to view explainable score breakdown"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{match.totalScore}% Match</span>
          </button>
        </div>

        {/* Bio */}
        {match.candidateBio && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {match.candidateBio}
          </p>
        )}

        {/* Availability & Experience Meta */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          {match.candidateAvailability && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{match.candidateAvailability}</span>
            </div>
          )}
          {match.candidateExperience && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100">
              <Briefcase className="h-3 w-3 text-slate-400" />
              <span>{match.candidateExperience} exp</span>
            </div>
          )}
        </div>

        {/* Matched vs Missing Skills breakdown */}
        <div className="mt-4 space-y-2">
          {match.matchedSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-3 w-3" /> Matched Skills ({match.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.matchedSkills.map((sk) => (
                  <SkillBadge key={sk} name={sk} variant="matched" size="sm" />
                ))}
              </div>
            </div>
          )}

          {match.missingSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1 mb-1">
                <XCircle className="h-3 w-3" /> Missing Skills ({match.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {match.missingSkills.map((sk) => (
                  <SkillBadge key={sk} name={sk} variant="missing" size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite box inline expanding */}
      {showInviteBox && (
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-indigo-100 text-xs animate-in fade-in duration-150">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Personalize your collaboration message:
          </label>
          <textarea
            rows={2}
            value={inviteMsg}
            onChange={(e) => setInviteMsg(e.target.value)}
            placeholder={`Hi ${match.candidateName}, your skills match our project requirements. Would you like to join?`}
            className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setShowInviteBox(false)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              disabled={isSending}
              onClick={handleSendRequest}
              className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              {isSending ? 'Sending...' : 'Confirm Invite'}
            </button>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowExplanationModal(true)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <Info className="h-3.5 w-3.5" />
          Why this score?
        </button>

        {sentSuccess ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Request Sent
          </span>
        ) : (
          <button
            onClick={() => setShowInviteBox(!showInviteBox)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Send className="h-3 w-3" />
            Invite Teammate
          </button>
        )}
      </div>

      {/* Modal: Transparent Compatibility Score Breakdown */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Compatibility Score Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score & Candidate Headline */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{match.candidateName}</p>
                <p className="text-[11px] text-slate-500">Candidate Evaluation Report</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">{match.totalScore}%</span>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Compatibility</span>
              </div>
            </div>

            {/* Exact mini project weighted breakdown */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-slate-700">Deterministic Mathematical Weighting:</p>
              
              {/* Skill Match: 60% */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">1. Skill Match (60% weight)</span>
                  <span className="font-bold text-indigo-600">{match.explanation.skillMatchPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${match.explanation.skillMatchPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Matched {match.matchedSkills.length} required skill(s): {match.matchedSkills.join(', ') || 'None'}.
                </p>
              </div>

              {/* Interest Match: 20% */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">2. Domain / Interest Alignment (20% weight)</span>
                  <span className="font-bold text-blue-600">{match.explanation.interestMatchPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${match.explanation.interestMatchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Availability Match: 10% */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">3. Weekly Availability (10% weight)</span>
                  <span className="font-bold text-emerald-600">{match.explanation.availabilityMatchPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${match.explanation.availabilityMatchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Experience Match: 10% */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">4. Experience Depth (10% weight)</span>
                  <span className="font-bold text-purple-600">{match.explanation.experienceMatchPercentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${match.explanation.experienceMatchPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Formula Callout */}
            <div className="mt-5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed font-mono">
              <span className="font-bold block text-slate-800 font-sans mb-1">Standard Report Formula:</span>
              compatibility = 0.60 × skill_match + 0.20 × interest_match + 0.10 × availability_match + 0.10 × experience_match
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
