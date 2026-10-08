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

    const requests = await prisma.collaborationRequest.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true, email: true, profile: true } },
        receiver: { select: { id: true, name: true, email: true, profile: true } },
        project: { select: { id: true, title: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
