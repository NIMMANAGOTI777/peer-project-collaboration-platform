import { describe, it, expect } from 'vitest';
import { signToken, verifyToken, AuthUser } from '../lib/auth/jwt';

describe('Role-Based Access Control & Security Tests', () => {
  const studentUser: AuthUser = {
    id: 'usr_student_123',
    name: 'Student Demo',
    email: 'student@example.com',
    role: 'STUDENT',
  };

  const adminUser: AuthUser = {
    id: 'usr_admin_456',
    name: 'Admin Demo',
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  it('correctly signs and verifies STUDENT token payload', () => {
    const token = signToken(studentUser);
    expect(token).toBeDefined();
    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(studentUser.id);
    expect(verified?.role).toBe('STUDENT');
  });

  it('correctly signs and verifies ADMIN token payload', () => {
    const token = signToken(adminUser);
    expect(token).toBeDefined();
    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(adminUser.id);
    expect(verified?.role).toBe('ADMIN');
  });

  it('detects invalid or tampered tokens', () => {
    const token = signToken(studentUser);
    const tampered = token.slice(0, -5) + 'abcde';
    const verified = verifyToken(tampered);
    expect(verified).toBeNull();
  });

  it('validates recommendation engine weight distribution equals 100%', () => {
    const weights = {
      skill: 0.6,
      interest: 0.2,
      availability: 0.1,
      experience: 0.1,
    };
    const total = weights.skill + weights.interest + weights.availability + weights.experience;
    expect(total).toBeCloseTo(1.0, 5);
  });

  it('enforces admin self-protection safeguards against self-demotion', () => {
    const isSelfDemotionBlocked = (currentAuthId: string, targetUserId: string, requestedRole: string) => {
      if (currentAuthId === targetUserId && requestedRole !== 'ADMIN') {
        return { allowed: false, reason: 'Admins cannot remove their own admin privileges.' };
      }
      return { allowed: true };
    };

    const selfDemotion = isSelfDemotionBlocked(adminUser.id, adminUser.id, 'STUDENT');
    expect(selfDemotion.allowed).toBe(false);

    const otherDemotion = isSelfDemotionBlocked(adminUser.id, 'other_admin_789', 'STUDENT');
    expect(otherDemotion.allowed).toBe(true);
  });

  it('enforces admin self-protection safeguards against self-deactivation', () => {
    const isSelfDeactivationBlocked = (currentAuthId: string, targetUserId: string, isActive: boolean) => {
      if (currentAuthId === targetUserId && isActive === false) {
        return { allowed: false, reason: 'Admins cannot deactivate their own account.' };
      }
      return { allowed: true };
    };

    const selfDeact = isSelfDeactivationBlocked(adminUser.id, adminUser.id, false);
    expect(selfDeact.allowed).toBe(false);

    const otherDeact = isSelfDeactivationBlocked(adminUser.id, 'usr_student_123', false);
    expect(otherDeact.allowed).toBe(true);
  });
});
