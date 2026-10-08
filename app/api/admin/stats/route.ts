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

    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });
    
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
    });
    const completedProjects = await prisma.project.count({
      where: { status: 'COMPLETED' },
    });

    const totalTeams = await prisma.team.count();
    const activeTeams = await prisma.team.count({ where: { status: 'ACTIVE' } });
    
    const totalTasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({ where: { status: 'COMPLETED' } });
    
    const totalRequests = await prisma.collaborationRequest.count();
    const pendingRequests = await prisma.collaborationRequest.count({ where: { status: 'PENDING' } });
    const acceptedRequests = await prisma.collaborationRequest.count({ where: { status: 'ACCEPTED' } });
    
    const totalReports = await prisma.report.count();
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const resolvedReports = await prisma.report.count({ where: { status: 'RESOLVED' } });
    
    const totalSkills = await prisma.skill.count();

    const recentProjects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, profile: true } },
        _count: { select: { tasks: true, requests: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const recentUsers = await prisma.user.findMany({
      include: {
        profile: true,
        studentSkills: { include: { skill: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const recentRequests = await prisma.collaborationRequest.findMany({
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalStudents,
        totalAdmins,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTeams,
        activeTeams,
        totalTasks,
        completedTasks,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        totalReports,
        pendingReports,
        resolvedReports,
        totalSkills,
      },
      recentProjects,
      recentUsers,
      recentRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
