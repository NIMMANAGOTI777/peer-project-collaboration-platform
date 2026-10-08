import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalProjects = await prisma.project.count();
    const activeTeams = await prisma.team.count({ where: { status: 'ACTIVE' } });
    const totalTasks = await prisma.task.count();
    const totalRequests = await prisma.collaborationRequest.count();
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const totalSkills = await prisma.skill.count();

    const recentProjects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentUsers = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStudents,
        totalProjects,
        activeTeams,
        totalTasks,
        totalRequests,
        pendingReports,
        totalSkills,
      },
      recentProjects,
      recentUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
