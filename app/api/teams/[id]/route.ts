import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            owner: { select: { id: true, name: true, email: true, profile: true } },
            projectSkills: { include: { skill: true } },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profile: true,
                studentSkills: { include: { skill: true } },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { status } = await req.json();

    const team = await prisma.team.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.project.ownerId !== auth.id && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the project owner or admin can update team status.' },
        { status: 403 }
      );
    }

    const updated = await prisma.team.update({
      where: { id },
      data: { status },
      include: { members: true },
    });

    return NextResponse.json({ team: updated, message: 'Team status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
