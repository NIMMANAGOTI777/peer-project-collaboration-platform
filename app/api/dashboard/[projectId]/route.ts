import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, name: true, profile: true } },
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, profile: true } },
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, profile: true } },
          },
          orderBy: { updatedAt: 'desc' },
        },
        repository: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const pendingTasks = project.tasks.filter((t) => t.status === 'TODO').length;

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Member contribution distribution
    const memberContributionMap: { [userId: string]: { name: string; completed: number; total: number; avatarUrl?: string } } = {};
    
    project.team?.members.forEach((m) => {
      memberContributionMap[m.userId] = {
        name: m.user.name,
        completed: 0,
        total: 0,
        avatarUrl: m.user.profile?.avatarUrl || undefined,
      };
    });

    project.tasks.forEach((t) => {
      if (t.assigneeId && memberContributionMap[t.assigneeId]) {
        memberContributionMap[t.assigneeId].total++;
        if (t.status === 'COMPLETED') {
          memberContributionMap[t.assigneeId].completed++;
        }
      }
    });

    const memberContributions = Object.entries(memberContributionMap).map(([userId, val]) => ({
      userId,
      name: val.name,
      completed: val.completed,
      total: val.total,
      percentage: val.total > 0 ? Math.round((val.completed / val.total) * 100) : 0,
      avatarUrl: val.avatarUrl,
    }));

    // Task Priority distribution
    const priorityBreakdown = {
      HIGH: project.tasks.filter((t) => t.priority === 'HIGH').length,
      MEDIUM: project.tasks.filter((t) => t.priority === 'MEDIUM').length,
      LOW: project.tasks.filter((t) => t.priority === 'LOW').length,
    };

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        owner: project.owner,
        preferredTeamSize: project.preferredTeamSize,
        currentTeamSize: project.team?.members.length || 1,
      },
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        progressPercentage,
        priorityBreakdown,
        isGitHubConnected: Boolean(project.repository),
        repository: project.repository,
      },
      teamMembers: project.team?.members || [],
      memberContributions,
      recentTasks: project.tasks.slice(0, 5),
    });
  } catch (error: any) {
    console.error('Error fetching project dashboard:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
