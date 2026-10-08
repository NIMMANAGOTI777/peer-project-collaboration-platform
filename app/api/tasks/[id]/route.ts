import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, status, priority, assigneeId, dueDate } = body;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: { include: { members: true } },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const isMember =
      task.project.team?.members.some((m) => m.userId === auth.id) ||
      task.project.ownerId === auth.id;

    if (!isMember && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: You must be a project team member to modify tasks.' },
        { status: 403 }
      );
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId === 'UNASSIGNED' || !assigneeId ? null : assigneeId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: {
        assignee: {
          select: { id: true, name: true, profile: true },
        },
      },
    });

    // Notify assignee if changed
    if (assigneeId && assigneeId !== task.assigneeId && assigneeId !== auth.id) {
      await prisma.notification.create({
        data: {
          userId: assigneeId,
          type: 'TASK_ASSIGNED',
          message: `You were assigned task "${updated.title}" in ${task.project.title}.`,
          link: `/projects/${task.projectId}/tasks`,
        },
      });
    }

    return NextResponse.json({ task: updated, message: 'Task updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: { include: { members: true } },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const isOwner = task.project.ownerId === auth.id;
    const isAssignee = task.assigneeId === auth.id;
    const isAdmin = auth.role === 'ADMIN';

    if (!isOwner && !isAssignee && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this task.' },
        { status: 403 }
      );
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
