import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';
import { rankProjectsForCandidate, CandidateStudent, TargetProject } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      include: {
        profile: true,
        studentSkills: { include: { skill: true } },
        ownedProjects: {
          include: {
            team: { include: { members: true } },
            tasks: true,
          },
        },
        teamMemberships: {
          include: {
            team: {
              include: {
                members: true,
                project: {
                  include: {
                    owner: { select: { id: true, name: true, profile: true } },
                    team: { include: { members: true } },
                    tasks: true,
                  },
                },
              },
            },
          },
        },
        assignedTasks: {
          where: { status: { not: 'COMPLETED' } },
          include: {
            project: { select: { id: true, title: true } },
          },
          orderBy: { dueDate: 'asc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Pending requests received
    const pendingReceivedCount = await prisma.collaborationRequest.count({
      where: { receiverId: auth.id, status: 'PENDING' },
    });

    // Unread notifications count
    const unreadNotificationsCount = await prisma.notification.count({
      where: { userId: auth.id, readStatus: false },
    });

    // Compute Active Projects list
    const activeProjectsMap = new Map();
    user.ownedProjects.forEach((p) => {
      const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const total = p.tasks.length;
      activeProjectsMap.set(p.id, {
        id: p.id,
        title: p.title,
        category: p.category,
        status: p.status,
        role: 'OWNER',
        teamSize: p.team?.members.length || 1,
        preferredTeamSize: p.preferredTeamSize,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    });

    user.teamMemberships.forEach((tm) => {
      const p = tm.team.project;
      if (!activeProjectsMap.has(p.id)) {
        const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
        const total = p.tasks.length;
        activeProjectsMap.set(p.id, {
          id: p.id,
          title: p.title,
          category: p.category,
          status: p.status,
          role: tm.role,
          teamSize: tm.team.members.length,
          preferredTeamSize: p.preferredTeamSize,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        });
      }
    });

    // Compute Recommended Projects
    const candidate: CandidateStudent = {
      userId: user.id,
      name: user.name,
      email: user.email,
      bio: user.profile?.bio,
      avatarUrl: user.profile?.avatarUrl,
      githubUsername: user.profile?.githubUsername,
      department: user.profile?.department,
      year: user.profile?.year,
      interests: user.profile?.interests,
      availability: user.profile?.availability,
      experience: user.profile?.experience,
      skills: user.studentSkills.map((sk) => ({
        id: sk.skill.id,
        name: sk.skill.name,
        proficiency: sk.proficiency,
      })),
    };

    const otherProjects = await prisma.project.findMany({
      where: {
        ownerId: { not: user.id },
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      include: {
        owner: { select: { id: true, name: true, profile: true } },
        projectSkills: { include: { skill: true } },
        team: { include: { members: true } },
      },
      take: 6,
    });

    const targetProjects: TargetProject[] = otherProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      requiredSkills: p.projectSkills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        proficiency: ps.requiredLevel,
      })),
    }));

    const ranked = rankProjectsForCandidate(candidate, targetProjects);
    const otherProjectsMap = new Map(otherProjects.map((p) => [p.id, p]));
    const recommendedProjects = ranked.slice(0, 4).map((r) => {
      const full = otherProjectsMap.get(r.id);
      return {
        ...full,
        match: r.match,
      };
    });

    // Recent Notifications as Recent Activity
    const recentActivity = await prisma.notification.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
      summary: {
        activeProjectsCount: activeProjectsMap.size,
        openTasksCount: user.assignedTasks.length,
        pendingRequestsCount: pendingReceivedCount,
        unreadNotificationsCount,
      },
      myProjects: Array.from(activeProjectsMap.values()),
      upcomingTasks: user.assignedTasks,
      recommendedProjects,
      recentActivity,
    });
  } catch (error: any) {
    console.error('Error fetching student dashboard:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
