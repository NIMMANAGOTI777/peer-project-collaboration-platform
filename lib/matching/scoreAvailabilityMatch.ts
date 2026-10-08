export function calculateAvailabilityMatch(
  studentAvailability: string | null | undefined
): number {
  if (!studentAvailability) return 0.7;

  const avail = studentAvailability.toLowerCase();

  if (avail.includes('20') || avail.includes('full-time') || avail.includes('high') || avail.includes('15-20') || avail.includes('25')) {
    return 1.0;
  }
  if (avail.includes('10-15') || avail.includes('medium') || avail.includes('part-time') || avail.includes('15')) {
    return 0.85;
  }
  if (avail.includes('5-10') || avail.includes('10')) {
    return 0.7;
  }
  if (avail.includes('low') || avail.includes('1-5') || avail.includes('0-5')) {
    return 0.4;
  }

  return 0.8;
}
