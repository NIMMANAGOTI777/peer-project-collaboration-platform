export interface SkillInfo {
  id?: string;
  name: string;
  proficiency?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | string;
}

export interface CandidateStudent {
  userId: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
  githubUsername?: string | null;
  department?: string | null;
  year?: string | null;
  interests?: string | null;
  availability?: string | null;
  experience?: string | null;
  skills: SkillInfo[];
}

export interface TargetProject {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: SkillInfo[];
}

export interface MatchBreakdown {
  userId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateBio?: string | null;
  candidateAvatarUrl?: string | null;
  candidateGithub?: string | null;
  candidateAvailability?: string | null;
  candidateExperience?: string | null;
  totalScore: number; // 0 - 100
  skillMatch: number; // 0 - 1.0 (e.g. 0.90)
  interestMatch: number; // 0 - 1.0 (e.g. 0.80)
  availabilityMatch: number; // 0 - 1.0 (e.g. 1.00)
  experienceMatch: number; // 0 - 1.0 (e.g. 0.70)
  matchedSkills: string[];
  missingSkills: string[];
  explanation: {
    skillMatchPercentage: number;
    interestMatchPercentage: number;
    availabilityMatchPercentage: number;
    experienceMatchPercentage: number;
    summary: string;
  };
}
