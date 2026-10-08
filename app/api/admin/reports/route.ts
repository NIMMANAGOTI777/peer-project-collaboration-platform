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
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        targetUser: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true, ownerId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
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

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Report ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const updated = await prisma.report.update({
      where: { id },
      data: { status },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ report: updated, message: 'Report status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
