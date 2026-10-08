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
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { category: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true, profile: true } },
        projectSkills: { include: { skill: true } },
        team: { include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } },
        _count: {
          select: { tasks: true, requests: true, reports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
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
    const { projectId, status, preferredTeamSize } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(status && { status }),
        ...(preferredTeamSize && { preferredTeamSize: Number(preferredTeamSize) }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ project: updated, message: 'Project status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: 'Project removed by administrator.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
