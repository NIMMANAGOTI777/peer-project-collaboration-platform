import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const received = await prisma.collaborationRequest.findMany({
      where: { receiverId: auth.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
            studentSkills: { include: { skill: true } },
          },
        },
        project: {
          include: {
            projectSkills: { include: { skill: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sent = await prisma.collaborationRequest.findMany({
      where: { senderId: auth.id },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
            studentSkills: { include: { skill: true } },
          },
        },
        project: {
          include: {
            projectSkills: { include: { skill: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ received, sent });
  } catch (error: any) {
    console.error('Error fetching collaboration requests:', error);
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
    const { receiverId, projectId, message } = body;

    if (!receiverId || !projectId) {
      return NextResponse.json(
        { error: 'Receiver and Project are required.' },
        { status: 400 }
      );
    }

    if (receiverId === auth.id) {
      return NextResponse.json(
        { error: 'You cannot send a collaboration request to yourself.' },
        { status: 400 }
      );
    }

    // Check for existing pending request
    const existing = await prisma.collaborationRequest.findFirst({
      where: {
        senderId: auth.id,
        receiverId,
        projectId,
        status: 'PENDING',
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A pending collaboration request already exists.' },
        { status: 409 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true },
    });

    const sender = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { name: true },
    });

    const defaultMsg = message?.trim() || `Hi, I would love to collaborate on ${project?.title || 'this project'}!`;

    const request = await prisma.collaborationRequest.create({
      data: {
        senderId: auth.id,
        receiverId,
        projectId,
        message: defaultMsg,
        status: 'PENDING',
      },
      include: {
        sender: { select: { id: true, name: true, profile: true } },
        receiver: { select: { id: true, name: true, profile: true } },
        project: true,
      },
    });

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'COLLABORATION_REQUEST',
        message: `You received a collaboration request from ${sender?.name || 'a student'} for ${project?.title || 'a project'}.`,
        link: '/collaboration-requests',
      },
    });

    return NextResponse.json(
      { request, message: 'Collaboration request sent successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating collaboration request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
