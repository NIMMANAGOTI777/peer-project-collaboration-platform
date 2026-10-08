export function calculateInterestMatch(
  studentInterests: string | null | undefined,
  studentBio: string | null | undefined,
  projectCategory: string,
  projectTitle: string,
  projectDescription: string
): number {
  if (!studentInterests && !studentBio) {
    return 0.5; // Neutral baseline
  }

  const parseTokens = (text: string | null | undefined): string[] => {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with', 'this', 'that', 'web', 'app'].includes(w));
  };

  const studentTokens = new Set([
    ...parseTokens(studentInterests),
    ...parseTokens(studentBio),
  ]);

  const projectTokens = [
    ...parseTokens(projectCategory),
    ...parseTokens(projectTitle),
    ...parseTokens(projectDescription),
  ];

  if (projectTokens.length === 0 || studentTokens.size === 0) {
    return 0.6;
  }

  let matches = 0;
  for (const token of projectTokens) {
    if (studentTokens.has(token)) {
      matches++;
    }
  }

  // Check direct category match
  const catLower = projectCategory.toLowerCase();
  if (studentInterests && studentInterests.toLowerCase().includes(catLower)) {
    matches += 2;
  }

  const rawScore = matches > 0 ? Math.min(1.0, 0.4 + matches * 0.15) : 0.4;
  return Number(rawScore.toFixed(2));
}
