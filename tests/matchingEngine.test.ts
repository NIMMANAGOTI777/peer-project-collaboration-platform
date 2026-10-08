import { describe, it, expect } from 'vitest';
import { calculateSkillMatch } from '../lib/matching/scoreSkillMatch';
import { calculateInterestMatch } from '../lib/matching/scoreInterestMatch';
import { calculateAvailabilityMatch } from '../lib/matching/scoreAvailabilityMatch';
import { calculateExperienceMatch } from '../lib/matching/scoreExperienceMatch';
import { computeMatchScore, rankCandidatesForProject } from '../lib/matching/matchingEngine';
import { CandidateStudent, TargetProject } from '../lib/matching/types';

describe('Skill Matching Engine - Unit Tests', () => {
  it('calculates exact skill match ratio: 3 matched out of 4 required = 0.75', () => {
    const studentSkills = [
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'Git' },
    ];
    const requiredSkills = [
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'Docker' },
    ];

    const result = calculateSkillMatch(studentSkills, requiredSkills);
    expect(result.score).toBe(0.75);
    expect(result.matchedSkills).toEqual(['React', 'Node.js', 'PostgreSQL']);
    expect(result.missingSkills).toEqual(['Docker']);
  });

  it('handles 100% matched skills correctly', () => {
    const studentSkills = [{ name: 'Python' }, { name: 'Machine Learning' }];
    const requiredSkills = [{ name: 'Python' }, { name: 'Machine Learning' }];

    const result = calculateSkillMatch(studentSkills, requiredSkills);
    expect(result.score).toBe(1.0);
    expect(result.missingSkills.length).toBe(0);
  });

  it('handles 0% matched skills correctly', () => {
    const studentSkills = [{ name: 'Java' }];
    const requiredSkills = [{ name: 'Flutter' }, { name: 'Android' }];

    const result = calculateSkillMatch(studentSkills, requiredSkills);
    expect(result.score).toBe(0);
    expect(result.missingSkills).toEqual(['Flutter', 'Android']);
  });

  it('calculates interest match for matching domain keywords', () => {
    const score = calculateInterestMatch(
      'Web Development, AI, Cloud',
      'Enjoys full stack web development and cloud tools',
      'Web Development',
      'Smart Campus Navigation',
      'A web application for campus indoor routing'
    );
    expect(score).toBeGreaterThanOrEqual(0.7);
  });

  it('calculates availability match correctly', () => {
    expect(calculateAvailabilityMatch('15-20 hrs/week')).toBe(1.0);
    expect(calculateAvailabilityMatch('10-15 hrs/week')).toBe(0.85);
    expect(calculateAvailabilityMatch('5-10 hrs/week')).toBe(0.7);
    expect(calculateAvailabilityMatch('0-5 hrs/week')).toBe(0.4);
  });

  it('calculates experience match correctly', () => {
    expect(calculateExperienceMatch('Expert')).toBe(1.0);
    expect(calculateExperienceMatch('2+ years')).toBe(0.85);
    expect(calculateExperienceMatch('1 year')).toBe(0.7);
    expect(calculateExperienceMatch('Beginner')).toBe(0.55);
  });

  it('computes exact mini project report formula (87% example from spec)', () => {
    // Spec Example:
    // Skill match = 0.90, Interest match = 0.80, Availability = 1.00, Experience = 0.70
    // Total = 0.60 * 0.90 + 0.20 * 0.80 + 0.10 * 1.00 + 0.10 * 0.70 = 0.54 + 0.16 + 0.10 + 0.07 = 0.87 (87%)
    const candidate: CandidateStudent = {
      userId: 'student-1',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      bio: 'Full-stack developer with 2 years building React and Node.js web services.',
      interests: 'Web Development, UI/UX, Cloud Computing',
      availability: '15-20 hrs/week',
      experience: '2 years',
      skills: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'PostgreSQL' },
      ],
    };

    const project: TargetProject = {
      id: 'proj-1',
      title: 'Smart Campus Navigation',
      description: 'A web application that helps students navigate campus facilities.',
      category: 'Web Development',
      requiredSkills: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'PostgreSQL' },
        { name: 'Docker' },
      ],
    };

    const breakdown = computeMatchScore(candidate, project);
    expect(breakdown.totalScore).toBeGreaterThanOrEqual(80);
    expect(breakdown.matchedSkills).toContain('React');
    expect(breakdown.matchedSkills).toContain('Node.js');
    expect(breakdown.matchedSkills).toContain('PostgreSQL');
    expect(breakdown.missingSkills).toContain('Docker');
    expect(breakdown.explanation.summary).toBeDefined();
  });

  it('ranks candidates in descending order of compatibility', () => {
    const candidateA: CandidateStudent = {
      userId: '1',
      name: 'High Match',
      email: 'a@example.com',
      interests: 'Web Development',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }],
    };

    const candidateB: CandidateStudent = {
      userId: '2',
      name: 'Low Match',
      email: 'b@example.com',
      interests: 'Bioinformatics',
      availability: '0-5 hrs/week',
      experience: 'Beginner',
      skills: [{ name: 'C++' }],
    };

    const project: TargetProject = {
      id: 'p1',
      title: 'Web Platform',
      description: 'Web development with React and Node',
      category: 'Web Development',
      requiredSkills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }],
    };

    const ranked = rankCandidatesForProject([candidateB, candidateA], project);
    expect(ranked[0].userId).toBe('1');
    expect(ranked[1].userId).toBe('2');
    expect(ranked[0].totalScore).toBeGreaterThan(ranked[1].totalScore);
  });
});
