import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';
    const statusFilter = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (roleFilter && (roleFilter === 'STUDENT' || roleFilter === 'ADMIN')) {
      where.role = roleFilter;
    }
    if (statusFilter === 'active') {
      where.isActive = true;
    } else if (statusFilter === 'inactive') {
      where.isActive = false;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        studentSkills: { include: { skill: true } },
        _count: {
          select: {
            ownedProjects: true,
            teamMemberships: true,
            assignedTasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, isActive, role } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Safety checks: do not allow an admin to accidentally demote or deactivate their own account
    if (userId === auth.id) {
      if (role && role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Action denied: Administrators cannot remove their own admin privileges.' },
          { status: 400 }
        );
      }
      if (isActive === false) {
        return NextResponse.json(
          { error: 'Action denied: Administrators cannot deactivate their own account.' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(role !== undefined && { role }),
      },
      include: { profile: true },
    });

    return NextResponse.json({ user: updated, message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
