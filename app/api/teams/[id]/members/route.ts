import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId } = params;
    const body = await req.json();
    const { userId, role } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        project: true,
        members: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.project.ownerId !== auth.id && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the project owner can add team members directly.' },
        { status: 403 }
      );
    }

    if (team.members.length >= team.project.preferredTeamSize) {
      return NextResponse.json(
        { error: `Team has already reached preferred size of ${team.project.preferredTeamSize}.` },
        { status: 400 }
      );
    }

    const existing = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User is already a team member.' }, { status: 409 });
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role: role || 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, profile: true } },
      },
    });

    // Notify new member
    await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        message: `You have been added as a team member to "${team.project.title}".`,
        link: `/projects/${team.projectId}/team`,
      },
    });

    return NextResponse.json({ member, message: 'Member added to team successfully' }, { status: 201 });
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

    const { id: teamId } = params;
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId');

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { project: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.project.ownerId === auth.id;
    const isSelfLeaving = auth.id === targetUserId;
    const isAdmin = auth.role === 'ADMIN';

    if (!isOwner && !isSelfLeaving && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot remove this team member.' },
        { status: 403 }
      );
    }

    if (targetUserId === team.project.ownerId && !isAdmin) {
      return NextResponse.json(
        { error: 'Cannot remove the project owner from the team.' },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: { teamId, userId: targetUserId },
      },
    });

    return NextResponse.json({ message: 'Team member removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
