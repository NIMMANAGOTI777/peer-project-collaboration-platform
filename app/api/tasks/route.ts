import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status && status !== 'ALL') where.status = status;
    if (priority && priority !== 'ALL') where.priority = priority;
    if (assigneeId && assigneeId !== 'ALL') where.assigneeId = assigneeId === 'UNASSIGNED' ? null : assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, profile: true },
        },
        project: {
          select: { id: true, title: true, ownerId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, title, description, priority, status, assigneeId, dueDate } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: 'Project ID and task title are required.' },
        { status: 400 }
      );
    }

    // Verify user is member of the project team or owner or admin
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember = project.team?.members.some((m) => m.userId === auth.id) || project.ownerId === auth.id;
    if (!isMember && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: You must be a team member to create tasks in this project.' },
        { status: 403 }
      );
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, profile: true },
        },
      },
    });

    // Notify assignee if assigned
    if (assigneeId && assigneeId !== auth.id) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          type: 'TASK_ASSIGNED',
          message: `You were assigned a new task: "${task.title}" on ${project.title}.`,
          link: `/projects/${projectId}/tasks`,
        },
      });
    }

    return NextResponse.json({ task, message: 'Task created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
