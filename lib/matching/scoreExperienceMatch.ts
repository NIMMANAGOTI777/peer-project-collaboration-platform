export function calculateExperienceMatch(
  studentExperience: string | null | undefined
): number {
  if (!studentExperience) return 0.7;

  const exp = studentExperience.toLowerCase();

  if (exp.includes('expert') || exp.includes('3+') || exp.includes('advanced') || exp.includes('3 years') || exp.includes('4 years')) {
    return 1.0;
  }
  if (exp.includes('intermediate') || exp.includes('2+') || exp.includes('2 years') || exp.includes('1-2 years')) {
    return 0.85;
  }
  if (exp.includes('1 year') || exp.includes('some experience') || exp.includes('junior')) {
    return 0.7;
  }
  if (exp.includes('beginner') || exp.includes('novice') || exp.includes('< 1')) {
    return 0.55;
  }

  return 0.75;
}
