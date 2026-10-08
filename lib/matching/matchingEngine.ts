import { CandidateStudent, TargetProject, MatchBreakdown } from './types';
import { calculateSkillMatch } from './scoreSkillMatch';
import { calculateInterestMatch } from './scoreInterestMatch';
import { calculateAvailabilityMatch } from './scoreAvailabilityMatch';
import { calculateExperienceMatch } from './scoreExperienceMatch';

/**
 * Deterministic, explainable matching algorithm based on mini project specification:
 * compatibility = 0.60 * skill_match + 0.20 * interest_match + 0.10 * availability_match + 0.10 * experience_match
 */
export function computeMatchScore(
  candidate: CandidateStudent,
  project: TargetProject
): MatchBreakdown {
  // 1. Skill Match (60% weight)
  const { score: skillMatch, matchedSkills, missingSkills } = calculateSkillMatch(
    candidate.skills,
    project.requiredSkills
  );

  // 2. Interest Match (20% weight)
  const interestMatch = calculateInterestMatch(
    candidate.interests,
    candidate.bio,
    project.category,
    project.title,
    project.description
  );

  // 3. Availability Match (10% weight)
  const availabilityMatch = calculateAvailabilityMatch(candidate.availability);

  // 4. Experience Match (10% weight)
  const experienceMatch = calculateExperienceMatch(candidate.experience);

  // Weighted Combination
  const weightedScore =
    0.60 * skillMatch +
    0.20 * interestMatch +
    0.10 * availabilityMatch +
    0.10 * experienceMatch;

  const totalScore = Math.min(100, Math.max(0, Math.round(weightedScore * 100)));

  const skillPercent = Math.round(skillMatch * 100);
  const interestPercent = Math.round(interestMatch * 100);
  const availPercent = Math.round(availabilityMatch * 100);
  const expPercent = Math.round(experienceMatch * 100);

  const summary = `${totalScore}% Match based on ${matchedSkills.length}/${project.requiredSkills.length} required skills matched (${skillPercent}%), ${interestPercent}% domain alignment, ${availPercent}% availability match, and ${expPercent}% experience depth.`;

  return {
    userId: candidate.userId,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    candidateBio: candidate.bio,
    candidateAvatarUrl: candidate.avatarUrl,
    candidateGithub: candidate.githubUsername,
    candidateAvailability: candidate.availability,
    candidateExperience: candidate.experience,
    totalScore,
    skillMatch,
    interestMatch,
    availabilityMatch,
    experienceMatch,
    matchedSkills,
    missingSkills,
    explanation: {
      skillMatchPercentage: skillPercent,
      interestMatchPercentage: interestPercent,
      availabilityMatchPercentage: availPercent,
      experienceMatchPercentage: expPercent,
      summary,
    },
  };
}

/**
 * Rank multiple candidates for a target project
 */
export function rankCandidatesForProject(
  candidates: CandidateStudent[],
  project: TargetProject
): MatchBreakdown[] {
  const matches = candidates.map((c) => computeMatchScore(c, project));
  return matches.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Rank multiple projects for a candidate student
 */
export function rankProjectsForCandidate(
  candidate: CandidateStudent,
  projects: TargetProject[]
): (TargetProject & { match: MatchBreakdown })[] {
  const list = projects.map((p) => ({
    ...p,
    match: computeMatchScore(candidate, p),
  }));
  return list.sort((a, b) => b.match.totalScore - a.match.totalScore);
}
