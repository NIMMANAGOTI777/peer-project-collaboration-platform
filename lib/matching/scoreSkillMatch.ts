import { SkillInfo } from './types';

export interface SkillMatchResult {
  score: number; // 0.0 to 1.0
  matchedSkills: string[];
  missingSkills: string[];
}

export function calculateSkillMatch(
  studentSkills: SkillInfo[],
  requiredSkills: SkillInfo[]
): SkillMatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 1.0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const studentSkillNames = new Set(
    studentSkills.map((s) => s.name.trim().toLowerCase())
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of requiredSkills) {
    const reqName = req.name.trim();
    if (studentSkillNames.has(reqName.toLowerCase())) {
      matchedSkills.push(reqName);
    } else {
      missingSkills.push(reqName);
    }
  }

  const totalRequired = requiredSkills.length;
  const matchedCount = matchedSkills.length;
  const score = totalRequired > 0 ? Number((matchedCount / totalRequired).toFixed(2)) : 1.0;

  return {
    score,
    matchedSkills,
    missingSkills,
  };
}
